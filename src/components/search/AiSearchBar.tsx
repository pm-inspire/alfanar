import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { aiSearch } from "@/lib/aiSearchApi";
import type { AiSearchItem } from "@/lib/aiSearchTypes";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function AiSearchBar({ className }: { className?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const debounced = useDebouncedValue(value, 250);

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<AiSearchItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canSearch = debounced.trim().length >= 2;

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!canSearch) {
        setItems([]);
        setError(null);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await aiSearch({ query: debounced.trim(), perPage: 5 });
        if (cancelled) return;
        setItems(res.items);
      } catch (e) {
        if (cancelled) return;
        setError("تعذر البحث الآن، حاول لاحقاً");
        setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [debounced, canSearch]);

  const hint = useMemo(() => {
    return "ابحث برقم القطعة أو وصفها (مثال: ماء رديتر ميتسوبيشي 2015)";
  }, []);

  const goToResults = (q: string) => {
    const query = q.trim();
    if (!query) return;
    setOpen(false);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className={cn("relative w-full max-w-xl", className)} dir="rtl">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // allow click selection
            window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              goToResults(value);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={hint}
          className="pr-9"
          aria-label="بحث قطع الغيار"
        />
        {loading && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        )}
      </div>

      {open && (error || items.length > 0 || canSearch) && (
        <div className="absolute mt-2 w-full rounded-xl border border-border bg-popover shadow-card overflow-hidden z-50">
          <div className="p-2">
            {!canSearch && (
              <div className="text-sm text-muted-foreground px-2 py-3">
                اكتب كلمتين على الأقل للبحث…
              </div>
            )}

            {error && <div className="text-sm text-destructive px-2 py-3">{error}</div>}

            {canSearch && !error && items.length === 0 && !loading && (
              <div className="text-sm text-muted-foreground px-2 py-3">لا توجد نتائج مقترحة.</div>
            )}

            {items.length > 0 && (
              <ul className="max-h-72 overflow-auto">
                {items.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => goToResults(debounced)}
                      className="w-full text-right rounded-lg px-3 py-2 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-foreground line-clamp-1">{p.name_ar}</div>
                          <div className="text-xs text-muted-foreground mt-1 line-clamp-1" dir="ltr">
                            {p.part_number ? `PN: ${p.part_number}` : ""}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground whitespace-nowrap">
                          {p.brand}
                          {p.year ? ` • ${p.year}` : ""}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {canSearch && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => goToResults(debounced)}
                className="w-full text-right mt-2 rounded-lg px-3 py-2 bg-primary text-primary-foreground hover:opacity-95 transition-opacity"
              >
                عرض كل النتائج
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

