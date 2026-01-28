import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminAnalytics, adminGetConfig, adminRegenerateEmbeddings, adminToggle } from "@/lib/aiSearchAdminApi";

const TOKEN_KEY = "ai_admin_token";

export default function AiSearchAdminPage() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [days, setDays] = useState(7);
  const [busy, setBusy] = useState<null | "toggle" | "regen">(null);

  useEffect(() => {
    localStorage.setItem(TOKEN_KEY, token);
  }, [token]);

  const canQuery = useMemo(() => token.trim().length > 0, [token]);

  const configQuery = useQuery({
    queryKey: ["admin-ai-search-config", token],
    queryFn: () => adminGetConfig(token),
    enabled: canQuery,
    retry: false,
  });

  const analyticsQuery = useQuery({
    queryKey: ["admin-ai-search-analytics", token, days],
    queryFn: () => adminAnalytics(token, days),
    enabled: canQuery,
    retry: false,
  });

  return (
    <>
      <Helmet>
        <title>لوحة تحكم البحث الذكي</title>
      </Helmet>

      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <div className="bg-card rounded-xl border border-border p-6 shadow-soft">
            <h1 className="text-2xl font-bold text-foreground mb-2">لوحة البحث الذكي</h1>
            <p className="text-muted-foreground mb-6">
              إدارة تشغيل/إيقاف البحث الدلالي، إعادة توليد embeddings، ومراجعة إحصائيات البحث.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="token">Admin Token</Label>
                <Input
                  id="token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="ضع ADMIN_TOKEN هنا"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground">
                  يتم إرسالها كـ <span dir="ltr">x-admin-token</span> إلى API.
                </p>
              </div>

              <div className="space-y-2">
                <Label>فترة الإحصائيات (أيام)</Label>
                <Input
                  value={String(days)}
                  onChange={(e) => setDays(Math.max(1, Math.min(90, Number(e.target.value) || 7)))}
                  inputMode="numeric"
                  dir="ltr"
                />
              </div>
            </div>

            {!canQuery ? (
              <div className="text-muted-foreground">أدخل Admin Token لعرض الإعدادات.</div>
            ) : configQuery.isError ? (
              <div className="text-destructive">غير مصرح أو تعذر جلب الإعدادات.</div>
            ) : configQuery.isLoading ? (
              <div className="text-muted-foreground">جاري تحميل الإعدادات…</div>
            ) : configQuery.data ? (
              <div className="space-y-5">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-foreground">تشغيل البحث الذكي (Semantic)</div>
                      <div className="text-sm text-muted-foreground">
                        Env AI enabled: <span className="font-semibold">{String(configQuery.data.aiEnabledEnv)}</span>
                        {" • "}
                        Model: <span className="font-semibold">{configQuery.data.embeddingModel}</span>
                      </div>
                    </div>
                    <Switch
                      checked={configQuery.data.aiSearchEnabled}
                      disabled={busy === "toggle"}
                      onCheckedChange={async (checked) => {
                        try {
                          setBusy("toggle");
                          await adminToggle(token, checked);
                          await configQuery.refetch();
                        } finally {
                          setBusy(null);
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <div className="font-semibold text-foreground">إعادة توليد Embeddings</div>
                      <div className="text-sm text-muted-foreground">
                        في هذا المشروع التجريبي يتم توليد embeddings لملف{" "}
                        <span dir="ltr">server/data/products.sample.json</span>.
                      </div>
                    </div>
                    <Button
                      variant="gold"
                      disabled={busy === "regen"}
                      onClick={async () => {
                        try {
                          setBusy("regen");
                          await adminRegenerateEmbeddings(token);
                          await configQuery.refetch();
                        } finally {
                          setBusy(null);
                        }
                      }}
                    >
                      {busy === "regen" ? "جاري التوليد…" : "توليد الآن"}
                    </Button>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-semibold text-foreground">إحصائيات البحث</div>
                    <Button variant="outline" onClick={() => analyticsQuery.refetch()} disabled={analyticsQuery.isLoading}>
                      تحديث
                    </Button>
                  </div>
                  {analyticsQuery.isError ? (
                    <div className="text-destructive">تعذر جلب الإحصائيات.</div>
                  ) : analyticsQuery.isLoading ? (
                    <div className="text-muted-foreground">جاري تحميل الإحصائيات…</div>
                  ) : analyticsQuery.data ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="rounded-lg border border-border p-3">
                          <div className="text-xs text-muted-foreground">عمليات البحث</div>
                          <div className="text-xl font-bold text-foreground">{analyticsQuery.data.totals.searches}</div>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <div className="text-xs text-muted-foreground">بدون نتائج</div>
                          <div className="text-xl font-bold text-foreground">{analyticsQuery.data.totals.noResults}</div>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <div className="text-xs text-muted-foreground">بـ AI</div>
                          <div className="text-xl font-bold text-foreground">{analyticsQuery.data.totals.withAi}</div>
                        </div>
                        <div className="rounded-lg border border-border p-3">
                          <div className="text-xs text-muted-foreground">متوسط الزمن (ms)</div>
                          <div className="text-xl font-bold text-foreground">
                            {analyticsQuery.data.totals.avgTookMs ?? "—"}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-foreground mb-2">أكثر الاستعلامات</div>
                        {analyticsQuery.data.topQueries.length === 0 ? (
                          <div className="text-sm text-muted-foreground">لا يوجد بيانات بعد.</div>
                        ) : (
                          <ul className="space-y-1">
                            {analyticsQuery.data.topQueries.map((t) => (
                              <li key={t.query} className="text-sm text-muted-foreground flex justify-between gap-4">
                                <span className="line-clamp-1">{t.query}</span>
                                <span className="font-semibold text-foreground">{t.count}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

