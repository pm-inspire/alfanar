import ProductCard from "@/components/shop/ProductCard";

const Wishlist = () => {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-primary mb-8">المفضلة</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard
          id="1"
          name="قماش ياباني فاخر - أبيض"
          price={150}
          image="/placeholder.svg"
          category="أقمشة شتوية"
        />
        <ProductCard
          id="2"
          name="قماش كوري صيفي - سكري"
          price={120}
          discountPrice={100}
          image="/placeholder.svg"
          category="أقمشة صيفية"
        />
      </div>
    </div>
  );
};

export default Wishlist;
