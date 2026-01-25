import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  description?: string;
  fabricType?: string;
  color?: string;
  inStock?: boolean;
  onAddToCart?: (id: string, quantity: number) => void;
  onToggleWishlist?: (id: string, isWishlisted: boolean) => void;
  isWishlisted?: boolean;
  className?: string;
}

const ProductCard = ({
  id,
  name,
  image,
  price,
  originalPrice,
  description,
  fabricType,
  color,
  inStock = true,
  onAddToCart,
  onToggleWishlist,
  isWishlisted = false,
  className,
}: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [localIsWishlisted, setLocalIsWishlisted] = useState(isWishlisted);

  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 99) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!inStock) return;

    setIsAddingToCart(true);
    try {
      // TODO: استدعاء API لإضافة المنتج إلى السلة
      // await api.addToCart({ productId: id, quantity });
      console.log('Adding to cart:', { id, quantity });
      
      if (onAddToCart) {
        onAddToCart(id, quantity);
      }
      
      // محاكاة استجابة API
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = () => {
    const newValue = !localIsWishlisted;
    setLocalIsWishlisted(newValue);
    
    // TODO: استدعاء API لإضافة/إزالة من المفضلة
    // await api.toggleWishlist({ productId: id });
    console.log('Toggle wishlist:', { id, isWishlisted: newValue });
    
    if (onToggleWishlist) {
      onToggleWishlist(id, newValue);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'bg-card rounded-xl border border-border overflow-hidden shadow-soft hover:shadow-card transition-all duration-300',
        !inStock && 'opacity-75',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 right-3 bg-destructive text-destructive-foreground px-2 py-1 rounded-md text-sm font-bold">
            خصم {discountPercentage}%
          </div>
        )}
        
        {/* Out of Stock Badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="bg-muted text-muted-foreground px-4 py-2 rounded-lg font-semibold">
              نفذت الكمية
            </span>
          </div>
        )}
        
        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={cn(
            'absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300',
            localIsWishlisted
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background/80 text-foreground hover:bg-background'
          )}
          aria-label={localIsWishlisted ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
        >
          <Heart
            className={cn(
              'h-5 w-5 transition-transform duration-300',
              localIsWishlisted && 'fill-current scale-110'
            )}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Product Name */}
        <h3 className="font-bold text-foreground text-lg line-clamp-2 min-h-[3.5rem]">
          {name}
        </h3>
        
        {/* Description */}
        {description && (
          <p className="text-muted-foreground text-sm line-clamp-2">
            {description}
          </p>
        )}
        
        {/* Variants (Fabric Type / Color) */}
        {(fabricType || color) && (
          <div className="flex flex-wrap gap-2 text-sm">
            {fabricType && (
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                {fabricType}
              </span>
            )}
            {color && (
              <span className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                {color}
              </span>
            )}
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-primary">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>
        
        {/* Quantity Selector */}
        {inStock && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">الكمية:</span>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="تقليل الكمية"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold text-foreground">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 99}
                className="w-9 h-9 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="زيادة الكمية"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        
        {/* Add to Cart Button */}
        <Button
          variant="gold"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
          disabled={!inStock || isAddingToCart}
        >
          {isAddingToCart ? (
            <span className="flex items-center gap-2">
              <span className="h-5 w-5 border-2 border-coffee-dark/30 border-t-coffee-dark rounded-full animate-spin" />
              جاري الإضافة...
            </span>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 ml-2" />
              {inStock ? 'إضافة إلى السلة' : 'نفذت الكمية'}
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
