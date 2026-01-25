import AccountShell from "@/components/account/AccountShell";
import ProductCard from "@/components/shop/ProductCard";
import menuHalloumi from "@/assets/menu-halloumi.jpg";
import menuBrownie from "@/assets/menu-brownie.jpg";

const wishlist = [
  { id: "w-1", name: "قماش رسمي مقاوم للتجعد", price: 32.0, compareAtPrice: 36.0, thumbnail: menuHalloumi },
  { id: "w-2", name: "قماش ثوب رجالي عملي للاستخدام اليومي", price: 14.0, thumbnail: menuBrownie },
];

export default function Wishlist() {
  return (
    <AccountShell title="المفضلة" subtitle="منتجاتك المفضلة (Placeholder).">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((p) => (
          <ProductCard
            key={p.id}
            thumbnailSrc={p.thumbnail}
            name={p.name}
            price={p.price}
            compareAtPrice={p.compareAtPrice}
            currency="OMR"
            onAddToCart={() => {
              // TODO(cart): add to cart from wishlist.
            }}
          />
        ))}
      </div>
      <p className="mt-6 text-xs text-muted-foreground">TODO(wishlist): ربط المفضلة عبر API.</p>
    </AccountShell>
  );
}

