import { useMemo, useState } from "react";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ProductVariant = {
  label: string;
  value: string;
};

export type ProductCardProps = {
  thumbnailSrc: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  currency?: string;
  variants?: ProductVariant[];
  defaultQuantity?: number;
  onAddToCart?: (payload: { quantity: number }) => void;
  onToggleWishlist?: (payload: { isWishlisted: boolean }) => void;
  className?: string;
};

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("ar", { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export default function ProductCard({
  thumbnailSrc,
  name,
  price,
  compareAtPrice,
  currency = "OMR",
  variants,
  defaultQuantity = 1,
  onAddToCart,
  onToggleWishlist,
  className,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(Math.max(1, defaultQuantity));
  const [isWishlisted, setIsWishlisted] = useState(false);

  const hasDiscount = typeof compareAtPrice === "number" && compareAtPrice > price;
  const discountPercent = useMemo(() => {
    if (!hasDiscount || !compareAtPrice) return null;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  }, [hasDiscount, compareAtPrice, price]);

  const safeName = name?.trim() || "منتج";

  const dec = () => setQuantity((q) => Math.max(1, q - 1));
  const inc = () => setQuantity((q) => Math.min(99, q + 1));

  const toggleWishlist = () => {
    const next = !isWishlisted;
    setIsWishlisted(next);
    // TODO(wishlist): connect to API/store later
    onToggleWishlist?.({ isWishlisted: next });
  };

  const addToCart = () => {
    // TODO(cart): connect to API/store later
    onAddToCart?.({ quantity });
  };

  return (
    <div
      className={cn(
        "group rounded-2xl border border-border/60 bg-card shadow-soft overflow-hidden card-hover",
        className,
      )}
    >
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={thumbnailSrc}
            alt={safeName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {hasDiscount ? (
          <div className="absolute top-3 right-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-gold">
            خصم {discountPercent ?? 0}%
          </div>
        ) : null}

        <button
          type="button"
          onClick={toggleWishlist}
          className={cn(
            "absolute top-3 left-3 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-background/80 backdrop-blur-sm transition",
            isWishlisted ? "border-destructive/40 text-destructive" : "border-border/60 text-muted-foreground hover:text-foreground",
          )}
          aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
        >
          <Heart className={cn("h-5 w-5", isWishlisted ? "fill-current" : "")} />
        </button>
      </div>

      <div className="p-4">
        <div className="min-h-[52px]">
          <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2">{safeName}</h3>
          {variants?.length ? (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              {variants.slice(0, 2).map((v) => (
                <span key={`${v.label}-${v.value}`} className="rounded-full bg-muted px-2 py-1">
                  {v.label}: {v.value}
                </span>
              ))}
              {variants.length > 2 ? <span className="rounded-full bg-muted px-2 py-1">+ المزيد</span> : null}
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="text-right">
            <div className="text-lg font-extrabold text-foreground">{formatPrice(price, currency)}</div>
            {hasDiscount && compareAtPrice ? (
              <div className="text-sm text-muted-foreground line-through">{formatPrice(compareAtPrice, currency)}</div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-xl border border-border/60 bg-background">
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={dec} aria-label="تقليل الكمية">
                <Minus className="h-4 w-4" />
              </Button>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={99}
                value={quantity}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setQuantity(Number.isFinite(n) ? Math.min(99, Math.max(1, n)) : 1);
                }}
                className="h-9 w-12 bg-transparent text-center text-sm font-semibold text-foreground outline-none"
                aria-label="الكمية"
              />
              <Button type="button" variant="ghost" size="icon" className="h-9 w-9" onClick={inc} aria-label="زيادة الكمية">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={addToCart}
          className="mt-4 w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
        >
          <ShoppingCart className="h-4 w-4 ml-2" />
          إضافة إلى السلة
        </Button>
      </div>
    </div>
  );
}

