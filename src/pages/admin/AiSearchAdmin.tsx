import { Helmet } from "react-helmet-async";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import {
  getAiSearchAnalytics,
  getAiSearchSettings,
  triggerEmbeddingRebuild,
  updateAiSearchSettings,
} from "@/lib/aiSearchAdmin";
import { brandLabels } from "@/data/autoParts";

const AiSearchAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading: isSettingsLoading } = useQuery({
    queryKey: ["ai-search-settings"],
    queryFn: getAiSearchSettings,
  });

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["ai-search-analytics"],
    queryFn: getAiSearchAnalytics,
  });

  const updateMutation = useMutation({
    mutationFn: updateAiSearchSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-search-settings"] });
      toast({ title: "تم تحديث إعدادات البحث الذكي" });
    },
  });

  const rebuildMutation = useMutation({
    mutationFn: triggerEmbeddingRebuild,
    onSuccess: () => {
      toast({ title: "تم إرسال مهمة إعادة بناء المتجهات" });
    },
  });

  return (
    <>
      <Helmet>
        <title>إدارة البحث الذكي | إقبال ستور</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl space-y-8">
          <section className="bg-card rounded-2xl border border-border shadow-soft p-6 md:p-8 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">لوحة إدارة البحث الذكي</h1>
              <p className="text-muted-foreground">
                فعّل/عطّل البحث الذكي وتابع تحليلات البحث وإعادة بناء المتجهات.
              </p>
            </div>

            <div className="flex items-center justify-between gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">تفعيل البحث الذكي</h2>
                <p className="text-sm text-muted-foreground">
                  عند التعطيل سيتم الرجوع للبحث النصي التقليدي.
                </p>
              </div>
              <Switch
                checked={settings?.enabled ?? true}
                disabled={isSettingsLoading}
                onCheckedChange={(checked) =>
                  updateMutation.mutate({
                    enabled: checked,
                    embedding_model: settings?.embedding_model ?? null,
                    vector_store: settings?.vector_store ?? null,
                  })
                }
              />
            </div>

            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">إعادة بناء المتجهات</h3>
                <p className="text-sm text-muted-foreground">
                  استخدمها عند تحديث بيانات المنتجات أو إضافة مخزون جديد.
                </p>
              </div>
              <Button
                variant="gold"
                onClick={() => rebuildMutation.mutate()}
                disabled={rebuildMutation.isPending}
              >
                {rebuildMutation.isPending ? "جاري الإرسال..." : "إعادة توليد المتجهات"}
              </Button>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">أكثر العبارات بحثاً</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العبارة</TableHead>
                    <TableHead>عدد البحث</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAnalyticsLoading && (
                    <TableRow>
                      <TableCell colSpan={2}>جاري التحميل...</TableCell>
                    </TableRow>
                  )}
                  {analytics?.top_queries.map((row) => (
                    <TableRow key={row.query}>
                      <TableCell>{row.query}</TableCell>
                      <TableCell>{row.searches}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">العلامات الأكثر طلباً</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>العلامة</TableHead>
                    <TableHead>عدد البحث</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAnalyticsLoading && (
                    <TableRow>
                      <TableCell colSpan={2}>جاري التحميل...</TableCell>
                    </TableRow>
                  )}
                  {analytics?.popular_brands.map((row) => (
                    <TableRow key={row.brand}>
                      <TableCell>{brandLabels[String(row.brand)] ?? row.brand}</TableCell>
                      <TableCell>{row.searches}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            <Card className="p-5">
              <h3 className="text-lg font-semibold mb-4">استعلامات بلا نتائج</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>الاستعلام</TableHead>
                    <TableHead>عدد البحث</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isAnalyticsLoading && (
                    <TableRow>
                      <TableCell colSpan={2}>جاري التحميل...</TableCell>
                    </TableRow>
                  )}
                  {analytics?.no_results.map((row) => (
                    <TableRow key={row.query}>
                      <TableCell>{row.query}</TableCell>
                      <TableCell>{row.searches}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AiSearchAdmin;
