import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { aiSearch } from "@/lib/aiSearchApi";
import type { AiSearchFilters } from "@/lib/aiSearchTypes";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

function toNumberOrUndefined(s: string | null) {
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";

  const [query, setQuery] = useState(q);
  const debouncedQuery = useDebouncedValue(query, 300);

  const filters: AiSearchFilters = useMemo(
    () => ({
      brand: params.get("brand") || undefined,
      car_type: params.get("car_type") || undefined,
      year: toNumberOrUndefined(params.get("year")),
      section_main: params.get("section_main") || undefined,
      section_sub: params.get("section_sub") || undefined,
      in_stock: params.get("in_stock") === "1" ? true : undefined,
    }),
    [params]
  );

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["ai-search", debouncedQuery, filters],
    queryFn: () => aiSearch({ query: debouncedQuery.trim(), perPage: 12, filters }),
    enabled: debouncedQuery.trim().length >= 2,
  });

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };

  const syncQueryToUrl = () => {
    const next = new URLSearchParams(params);
    if (query.trim()) next.set("q", query.trim());
    else next.delete("q");
    setParams(next, { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>بحث قطع الغيار | بحث ذكي</title>
      </Helmet>

      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <div className="flex flex-col gap-6">
            <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
              <h1 className="text-2xl font-bold text-foreground mb-4">بحث ذكي عن قطع الغيار</h1>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
                <div className="lg:col-span-2 space-y-2">
                  <Label htmlFor="q">اكتب ما تبحث عنه</Label>
                  <Input
                    id="q"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onBlur={syncQueryToUrl}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        syncQueryToUrl();
                        refetch();
                      }
                    }}
                    placeholder="مثال: ماء رديتر ميتسوبيشي ازرق | قطع غيار تويوتا 2010 فرامل | TY-BRK-7788"
                    dir="rtl"
                  />
                  {data?.inferred?.brand || data?.inferred?.year ? (
                    <p className="text-sm text-muted-foreground">
                      اقتراحات الفهم:{" "}
                      {data.inferred.brand ? <span className="font-semibold">{data.inferred.brand}</span> : null}
                      {data.inferred.year ? <span> • {data.inferred.year}</span> : null}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="gold"
                    className="flex-1"
                    onClick={() => {
                      syncQueryToUrl();
                      refetch();
                    }}
                    disabled={debouncedQuery.trim().length < 2}
                  >
                    بحث
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setQuery("");
                      setParams(new URLSearchParams(), { replace: true });
                    }}
                  >
                    مسح
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
                <div className="space-y-2">
                  <Label>الماركة</Label>
                  <Input
                    value={filters.brand || ""}
                    onChange={(e) => updateParam("brand", e.target.value.trim() || undefined)}
                    placeholder="مثال: Toyota"
                  />
                </div>
                <div className="space-y-2">
                  <Label>النوع / الموديل</Label>
                  <Input
                    value={filters.car_type || ""}
                    onChange={(e) => updateParam("car_type", e.target.value.trim() || undefined)}
                    placeholder="مثال: Corolla"
                  />
                </div>
                <div className="space-y-2">
                  <Label>السنة</Label>
                  <Input
                    value={filters.year ? String(filters.year) : ""}
                    onChange={(e) => updateParam("year", e.target.value.trim() || undefined)}
                    inputMode="numeric"
                    placeholder="مثال: 2015"
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label>متوفر بالمخزون</Label>
                  <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 bg-background">
                    <span className="text-sm text-muted-foreground">إظهار المتوفر فقط</span>
                    <Switch
                      checked={filters.in_stock === true}
                      onCheckedChange={(checked) => updateParam("in_stock", checked ? "1" : undefined)}
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>القسم الرئيسي</Label>
                  <Input
                    value={filters.section_main || ""}
                    onChange={(e) => updateParam("section_main", e.target.value.trim() || undefined)}
                    placeholder="مثال: الفرامل"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>القسم الفرعي</Label>
                  <Input
                    value={filters.section_sub || ""}
                    onChange={(e) => updateParam("section_sub", e.target.value.trim() || undefined)}
                    placeholder="مثال: فحمات"
                  />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-lg font-bold text-foreground">
                  النتائج{" "}
                  {data ? <span className="text-muted-foreground font-normal">({data.total})</span> : null}
                </h2>
                {data ? (
                  <div className="text-sm text-muted-foreground">
                    {data.meta.hasAi ? "بحث دلالي + كلمات" : "بحث كلمات + تصحيح"}
                    {data.meta.embeddingModel ? ` • ${data.meta.embeddingModel}` : ""}
                  </div>
                ) : null}
              </div>

              {error ? (
                <div className="text-destructive">حدث خطأ أثناء البحث.</div>
              ) : isLoading ? (
                <div className="text-muted-foreground">جاري البحث…</div>
              ) : !data ? (
                <div className="text-muted-foreground">ابدأ بكتابة استعلام للبحث.</div>
              ) : data.items.length === 0 ? (
                <div className="text-muted-foreground">لا توجد نتائج.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.items.map((p) => (
                    <div key={p.id} className="space-y-3">
                      <ProductCard
                        id={p.id}
                        name={p.name_ar}
                        image={p.image}
                        price={p.price}
                        description={p.description}
                        inStock={p.stock > 0}
                      />

                      <div className="text-sm text-muted-foreground">
                        <div className="flex flex-wrap gap-2">
                          {p.brand ? <span className="bg-secondary px-2 py-1 rounded-md">{p.brand}</span> : null}
                          {p.car_type ? <span className="bg-secondary px-2 py-1 rounded-md">{p.car_type}</span> : null}
                          {p.year ? <span className="bg-secondary px-2 py-1 rounded-md">{p.year}</span> : null}
                          {p.part_number ? (
                            <span className="bg-secondary px-2 py-1 rounded-md" dir="ltr">
                              PN: {p.part_number}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {p.alternatives?.length ? (
                        <div className="rounded-lg border border-border bg-background p-3">
                          <div className="text-sm font-semibold text-foreground mb-2">بدائل/قطع مشابهة</div>
                          <ul className="space-y-1">
                            {p.alternatives.slice(0, 3).map((alt) => (
                              <li key={alt.id} className="text-sm text-muted-foreground">
                                {alt.name_ar}{" "}
                                {alt.part_number ? (
                                  <span dir="ltr" className="text-xs">
                                    (PN: {alt.part_number})
                                  </span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

