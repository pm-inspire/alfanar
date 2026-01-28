import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AutoPartCard from "@/components/search/AutoPartCard";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import {
  searchAiParts,
  type AiSearchSuggestion,
  type AiSearchResult,
} from "@/lib/aiSearch";
import { autoParts, brandLabels } from "@/data/autoParts";

const AiSearch = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [filters, setFilters] = useState({
    brand: "",
    car_type: "",
    year: "",
    section_main: "",
    section_sub: "",
  });

  const debouncedQuery = useDebouncedValue(query, 400);
  const hasFilters = Object.values(filters).some(Boolean);

  const { data, isFetching } = useQuery({
    queryKey: ["ai-search", debouncedQuery, filters],
    queryFn: () =>
      searchAiParts({
        query: debouncedQuery,
        brand: filters.brand || undefined,
        car_type: filters.car_type || undefined,
        year: filters.year ? Number(filters.year) : undefined,
        section_main: filters.section_main || undefined,
        section_sub: filters.section_sub || undefined,
      }),
    enabled: debouncedQuery.length >= 2 || hasFilters,
  });

  const highlightTokens = useMemo(
    () =>
      debouncedQuery
        .split(" ")
        .map((token) => token.trim())
        .filter((token) => token.length > 1),
    [debouncedQuery]
  );

  const brands = useMemo(
    () => Array.from(new Set(autoParts.map((part) => part.brand))),
    []
  );
  const carTypes = useMemo(
    () => Array.from(new Set(autoParts.map((part) => part.car_type))),
    []
  );
  const years = useMemo(
    () =>
      Array.from(new Set(autoParts.map((part) => part.year)))
        .sort((a, b) => b - a)
        .map(String),
    []
  );
  const sectionsMain = useMemo(
    () => Array.from(new Set(autoParts.map((part) => part.section_main))),
    []
  );
  const sectionsSub = useMemo(
    () =>
      Array.from(
        new Set(
          autoParts
            .filter((part) =>
              filters.section_main ? part.section_main === filters.section_main : true
            )
            .map((part) => part.section_sub)
        )
      ),
    [filters.section_main]
  );

  const suggestions = data?.suggestions ?? [];

  const handleSuggestion = (suggestion: AiSearchSuggestion) => {
    if (suggestion.type === "part") {
      const part = data?.results.find((item) => item.id === suggestion.id);
      if (part) {
        setQuery(part.name_ar);
      }
    }
    if (suggestion.type === "brand") {
      const brand = suggestion.id.replace("brand-", "");
      setFilters((prev) => ({ ...prev, brand }));
    }
    if (suggestion.type === "car") {
      const carType = suggestion.id.replace("car-", "");
      setFilters((prev) => ({ ...prev, car_type: carType }));
    }
    if (suggestion.type === "section") {
      const section = suggestion.id.replace("section-", "");
      setFilters((prev) => ({ ...prev, section_main: section }));
    }
    setIsFocused(false);
  };

  const handleClearFilters = () => {
    setFilters({
      brand: "",
      car_type: "",
      year: "",
      section_main: "",
      section_sub: "",
    });
  };

  const handleAddToCart = (id: string) => {
    console.log("Add to cart:", id);
  };

  return (
    <>
      <Helmet>
        <title>البحث الذكي عن قطع الغيار | إقبال ستور</title>
        <meta
          name="description"
          content="ابحث عن قطع غيار أصلية بكلماتك العربية أو رقم القطعة مع مطابقة السيارة والموديل."
        />
      </Helmet>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl space-y-8">
          <section className="bg-card rounded-2xl border border-border shadow-soft p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  البحث الذكي عن قطع الغيار
                </h1>
                <p className="text-muted-foreground">
                  ابحث بالوصف العربي أو رقم القطعة أو موديل السيارة، وسنقترح القطع المتوافقة فوراً.
                </p>
              </div>

              <div className="relative">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                  placeholder="مثال: ماء رديتر ميتسوبيشي 2015 أو رقم القطعة"
                  className="h-12 text-base pr-12"
                  dir="rtl"
                />
                {isFetching && (
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                )}
                {isFocused && suggestions.length > 0 && (
                  <div className="absolute z-20 mt-2 w-full bg-card border border-border rounded-xl shadow-card max-h-72 overflow-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        className="w-full text-right px-4 py-3 hover:bg-muted transition-colors"
                        onMouseDown={() => handleSuggestion(suggestion)}
                      >
                        <span className="text-sm text-muted-foreground ml-2">
                          {suggestion.type === "part" && "قطعة"}
                          {suggestion.type === "brand" && "ماركة"}
                          {suggestion.type === "car" && "موديل"}
                          {suggestion.type === "section" && "قسم"}
                        </span>
                        <span className="text-foreground font-medium">{suggestion.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <Select
                  value={filters.brand}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, brand: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="الماركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brandLabels[brand] ?? brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.car_type}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, car_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="الموديل" />
                  </SelectTrigger>
                  <SelectContent>
                    {carTypes.map((carType) => (
                      <SelectItem key={carType} value={carType}>
                        {carType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.year}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, year: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="السنة" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.section_main}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, section_main: value, section_sub: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="القسم الرئيسي" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionsMain.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.section_sub}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, section_sub: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="القسم الفرعي" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectionsSub.map((section) => (
                      <SelectItem key={section} value={section}>
                        {section}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {data?.corrected_query && (
                  <Badge variant="outline">هل تقصد: {data.corrected_query}</Badge>
                )}
                {data?.intent?.brand && (
                  <Badge variant="secondary">
                    تطابق الماركة: {brandLabels[String(data.intent.brand)] ?? data.intent.brand}
                  </Badge>
                )}
                {data?.intent?.year && <Badge variant="secondary">السنة: {data.intent.year}</Badge>}
                {data?.intent?.section_main && (
                  <Badge variant="secondary">القسم: {data.intent.section_main}</Badge>
                )}
                {(hasFilters || query) && (
                  <Button variant="outline" size="sm" onClick={handleClearFilters}>
                    مسح الفلاتر
                  </Button>
                )}
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">نتائج البحث</h2>
              {data && <span className="text-muted-foreground">{data.total} نتيجة</span>}
            </div>

            {isFetching && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={index} className="h-[420px] rounded-xl" />
                ))}
              </div>
            )}

            {!isFetching && data?.results?.length === 0 && (
              <div className="bg-card rounded-xl border border-border p-8 text-center">
                <p className="text-lg font-semibold text-foreground mb-2">لا توجد نتائج مطابقة</p>
                <p className="text-muted-foreground">
                  جرب تغيير الكلمات أو إزالة بعض الفلاتر، أو اكتب رقم القطعة مباشرة.
                </p>
              </div>
            )}

            {!isFetching && data?.results?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.results.map((part: AiSearchResult) => (
                  <AutoPartCard
                    key={part.id}
                    part={part}
                    highlightTokens={highlightTokens}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            ) : null}
          </section>

          {data?.alternatives?.length ? (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">قطع بديلة متوافقة</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.alternatives.map((part: AiSearchResult) => (
                  <AutoPartCard
                    key={part.id}
                    part={part}
                    highlightTokens={highlightTokens}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AiSearch;
