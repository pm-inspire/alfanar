import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import menuCroissant from "@/assets/menu-croissant.jpg";
import menuBrownie from "@/assets/menu-brownie.jpg";
import menuFrenchToast from "@/assets/menu-french-toast.jpg";
import menuHalloumi from "@/assets/menu-halloumi.jpg";

const products = [
  {
    id: "p-1",
    name: "قماش ثوب رجالي سويسري فاخر",
    price: 24.9,
    compareAtPrice: 29.9,
    thumbnail: menuCroissant,
    variants: [
      { label: "اللون", value: "أبيض" },
      { label: "النوع", value: "قطن" },
    ],
  },
  {
    id: "p-2",
    name: "قماش ثوب رجالي صيفي خفيف",
    price: 18.5,
    thumbnail: menuFrenchToast,
    variants: [{ label: "اللون", value: "سكري" }],
  },
  {
    id: "p-3",
    name: "قماش رسمي مقاوم للتجعد",
    price: 32.0,
    compareAtPrice: 36.0,
    thumbnail: menuHalloumi,
    variants: [
      { label: "اللون", value: "أبيض" },
      { label: "النوع", value: "خليط" },
    ],
  },
  {
    id: "p-4",
    name: "قماش ثوب رجالي عملي للاستخدام اليومي",
    price: 14.0,
    thumbnail: menuBrownie,
    variants: [{ label: "اللون", value: "أبيض ناصع" }],
  },
];

export default function Shop() {
  const { toast } = useToast();

  return (
    <main className="overflow-hidden">
      <Header />

      <section className="pt-24 pb-10 bg-background">
        <div className="container-rtl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="text-right">
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">المتجر</h1>
              <p className="mt-2 text-muted-foreground">
                تصفح أقمشة رجالية مختارة بعناية — واجهة جاهزة للربط مع المنتجات لاحقاً.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Input placeholder="ابحث عن منتج..." className="bg-card" />
              <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                فلترة (Placeholder)
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {["أحدث المنتجات", "الأكثر مبيعاً", "قطن", "خليط", "عروض"].map((chip) => (
              <button
                key={chip}
                type="button"
                className="rounded-full border border-border/60 bg-card px-4 py-2 text-sm text-foreground hover:border-accent hover:bg-accent/10 transition"
              >
                {chip}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                thumbnailSrc={p.thumbnail}
                name={p.name}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                currency="OMR"
                variants={p.variants}
                onAddToCart={() => {
                  // TODO(cart): connect to cart store / API.
                  toast({ title: "تمت الإضافة إلى السلة", description: "يمكنك تعديل الكمية من صفحة السلة." });
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

