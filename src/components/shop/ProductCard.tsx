import { useState } from "react";
import { Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  category?: string;
}

const ProductCard = ({ id, name, price, discountPrice, image, category }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { toast } = useToast();

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    toast({
      title: "تمت الإضافة للسلة",
      description: `تم إضافة ${quantity} × ${name} إلى سلة التسوق`,
    });
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast({
      title: !isWishlisted ? "تمت الإضافة للمفضلة" : "تم الحذف من المفضلة",
      description: !isWishlisted ? "تم حفظ المنتج في قائمة أمنياتك" : "تم إزالة المنتج من قائمة أمنياتك",
    });
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-primary/10">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {discountPrice && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            خصم {Math.round(((price - discountPrice) / price) * 100)}%
          </div>
        )}
        <button
          onClick={toggleWishlist}
          className={`absolute top-2 left-2 p-2 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${
            isWishlisted ? "text-red-500" : "text-muted-foreground hover:text-red-500"
          }`}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      <CardContent className="p-4">
        {category && (
          <p className="text-xs text-muted-foreground mb-1">{category}</p>
        )}
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-primary">{name}</h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-lg">
            {discountPrice ? discountPrice : price} ر.س
          </span>
          {discountPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {price} ر.س
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
        <div className="flex items-center justify-between w-full gap-2">
          <div className="flex items-center border rounded-md">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="p-2 hover:bg-muted transition-colors"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantityChange(1)}
              className="p-2 hover:bg-muted transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button 
            onClick={handleAddToCart} 
            className="flex-1 gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            إضافة
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
