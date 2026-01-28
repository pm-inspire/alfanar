import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type AiSearchResult } from "@/lib/aiSearch";

interface AutoPartCardProps {
  part: AiSearchResult;
  highlightTokens?: string[];
  onAddToCart?: (id: string) => void;
}

const AutoPartCard = ({ part, highlightTokens = [], onAddToCart }: AutoPartCardProps) => {
  const formatPrice = (value: number) =>
    new Intl.NumberFormat("ar-SA", { style: "currency", currency: "SAR" }).format(value);

  return (
    <div className="bg-card rounded-xl border border-border shadow-soft overflow-hidden flex flex-col">
      <div className="relative bg-muted aspect-square">
        <img src={part.image} alt={part.name_ar} className="w-full h-full object-cover" />
        {part.compatibility_match && (
          <Badge className="absolute top-3 right-3">متوافق</Badge>
        )}
        {part.stock <= 0 && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            غير متوفر
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <h3 className="font-bold text-foreground text-lg leading-relaxed min-h-[3rem]">
          {renderHighlightedText(part.name_ar, highlightTokens)}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{part.description}</p>
        <div className="text-sm text-muted-foreground">
          رقم القطعة:{" "}
          <span className="text-foreground font-medium" dir="ltr">
            {part.part_number}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{part.brand_ar ?? part.brand}</Badge>
          <Badge variant="secondary">{part.car_type}</Badge>
          <Badge variant="outline">{part.year}</Badge>
          <Badge variant="outline">{part.section_main}</Badge>
          <Badge variant="outline">{part.section_sub}</Badge>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-primary">{formatPrice(part.price)}</span>
          <span
            className={cn(
              "text-sm font-semibold",
              part.stock > 0 ? "text-green-600" : "text-destructive"
            )}
          >
            {part.stock > 0 ? "متوفر" : "نفذت الكمية"}
          </span>
        </div>
        <Button
          variant="gold"
          className="w-full"
          disabled={part.stock <= 0}
          onClick={() => onAddToCart?.(part.id)}
        >
          إضافة إلى السلة
        </Button>
      </div>
    </div>
  );
};

function renderHighlightedText(text: string, tokens: string[]) {
  if (!tokens.length) return text;
  const normalizedTokens = tokens.map(normalizeArabic);
  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join("|")})`, "gi");
  const parts = text.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const isMatch = normalizedTokens.includes(normalizeArabic(part));
    return (
      <span
        key={`${part}-${index}`}
        className={cn(isMatch && "bg-accent/30 text-foreground px-1 rounded")}
      >
        {part}
      </span>
    );
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizeArabic(value: string) {
  return value
    .toLowerCase()
    .replace(/[إأآا]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default AutoPartCard;
