import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AccountSidebar from '@/components/account/AccountSidebar';

interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
}

// بيانات وهمية للمفضلة
const mockWishlist: WishlistItem[] = [
  {
    id: '1',
    name: 'قماش ثوب صيفي فاخر - أبيض ناصع',
    image: '/placeholder.svg',
    price: 350,
    originalPrice: 400,
    inStock: true,
  },
  {
    id: '2',
    name: 'قماش شتوي بريطاني - رمادي داكن',
    image: '/placeholder.svg',
    price: 480,
    inStock: true,
  },
  {
    id: '3',
    name: 'قماش حرير إيطالي - أزرق ملكي',
    image: '/placeholder.svg',
    price: 650,
    inStock: false,
  },
];

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlist);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

  const handleRemoveItem = (itemId: string) => {
    // TODO: استدعاء API لإزالة من المفضلة
    // await api.removeFromWishlist(itemId);
    console.log('Removing from wishlist:', itemId);
    setWishlist(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddToCart = (itemId: string) => {
    // TODO: استدعاء API لإضافة إلى السلة
    // await api.addToCart({ productId: itemId, quantity: 1 });
    console.log('Adding to cart:', itemId);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <AccountSidebar activeItem="wishlist" />

            {/* Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft"
              >
                <h1 className="text-2xl font-bold text-foreground mb-6">
                  المفضلة
                </h1>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-foreground mb-2">
                      قائمة المفضلة فارغة
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      لم تقم بإضافة أي منتجات إلى المفضلة
                    </p>
                    <Link to="/">
                      <Button variant="gold">تصفح المنتجات</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <AnimatePresence>
                      {wishlist.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="border border-border rounded-xl overflow-hidden bg-background"
                        >
                          {/* Image */}
                          <div className="relative aspect-square bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            {!item.inStock && (
                              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                                <span className="bg-muted text-muted-foreground px-3 py-1 rounded text-sm">
                                  نفذت الكمية
                                </span>
                              </div>
                            )}
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="absolute top-2 left-2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                              aria-label="إزالة من المفضلة"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          {/* Content */}
                          <div className="p-4 space-y-3">
                            <h3 className="font-bold text-foreground line-clamp-2">
                              {item.name}
                            </h3>
                            
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-primary">
                                {formatPrice(item.price)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatPrice(item.originalPrice)}
                                </span>
                              )}
                            </div>

                            <Button
                              variant="gold"
                              size="sm"
                              className="w-full"
                              onClick={() => handleAddToCart(item.id)}
                              disabled={!item.inStock}
                            >
                              <ShoppingCart className="h-4 w-4 ml-2" />
                              {item.inStock ? 'إضافة للسلة' : 'غير متوفر'}
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Wishlist;
