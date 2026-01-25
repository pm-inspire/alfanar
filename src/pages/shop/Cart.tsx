import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Tag,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  note?: string;
  fabricType?: string;
  color?: string;
}

// بيانات وهمية للسلة
const initialCartItems: CartItem[] = [
  {
    id: '1',
    name: 'قماش ثوب صيفي فاخر - أبيض ناصع',
    image: '/placeholder.svg',
    price: 350,
    quantity: 2,
    fabricType: 'قطن مصري',
    color: 'أبيض',
  },
  {
    id: '2',
    name: 'قماش شتوي بريطاني - رمادي داكن',
    image: '/placeholder.svg',
    price: 480,
    quantity: 1,
    fabricType: 'صوف إنجليزي',
    color: 'رمادي',
  },
  {
    id: '3',
    name: 'قماش ثوب مخلوط - بيج ذهبي',
    image: '/placeholder.svg',
    price: 420,
    quantity: 1,
    fabricType: 'قطن وبوليستر',
    color: 'بيج',
  },
];

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [couponCode, setCouponCode] = useState('');
  const [couponStatus, setCouponStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [couponMessage, setCouponMessage] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [itemNotes, setItemNotes] = useState<Record<string, string>>({});

  // حسابات الفاتورة
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal > 1000 ? 0 : 50; // شحن مجاني للطلبات فوق 1000 ريال
  const taxRate = 0.15; // 15% ضريبة القيمة المضافة
  const discountAmount = (subtotal * appliedDiscount) / 100;
  const taxAmount = (subtotal - discountAmount) * taxRate;
  const total = subtotal - discountAmount + shippingCost + taxAmount;

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + delta;
          if (newQuantity >= 1 && newQuantity <= 99) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setItemNotes(prev => ({ ...prev, [itemId]: note }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponStatus('error');
      setCouponMessage('الرجاء إدخال كود الخصم');
      return;
    }

    setIsApplyingCoupon(true);
    setCouponStatus('idle');
    setCouponMessage('');

    try {
      // TODO: استدعاء API للتحقق من كود الخصم
      // const response = await api.validateCoupon({ code: couponCode });
      console.log('Applying coupon:', couponCode);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // محاكاة استجابة API
      if (couponCode.toUpperCase() === 'ALFANAR10') {
        setAppliedDiscount(10);
        setCouponStatus('success');
        setCouponMessage('تم تطبيق خصم 10% بنجاح!');
      } else if (couponCode.toUpperCase() === 'ALFANAR20') {
        setAppliedDiscount(20);
        setCouponStatus('success');
        setCouponMessage('تم تطبيق خصم 20% بنجاح!');
      } else {
        setCouponStatus('error');
        setCouponMessage('كود الخصم غير صالح');
      }
    } catch (error) {
      setCouponStatus('error');
      setCouponMessage('حدث خطأ أثناء التحقق من الكود');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    // TODO: حفظ الملاحظات مع المنتجات
    const cartWithNotes = cartItems.map(item => ({
      ...item,
      note: itemNotes[item.id] || '',
    }));
    console.log('Proceeding to checkout:', cartWithNotes);
    navigate('/checkout');
  };

  // عرض السلة الفارغة
  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
          <div className="container-rtl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto text-center py-16"
            >
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                سلة التسوق فارغة
              </h1>
              <p className="text-muted-foreground mb-8">
                لم تقم بإضافة أي منتجات إلى السلة بعد
              </p>
              <Link to="/">
                <Button variant="gold" size="lg">
                  تصفح المنتجات
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">سلة التسوق</h1>
            <p className="text-muted-foreground">
              {cartItems.length} منتج في السلة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card rounded-xl border border-border p-4 md:p-6 shadow-soft"
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-28 h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h3 className="font-bold text-foreground text-lg">
                              {item.name}
                            </h3>
                            {(item.fabricType || item.color) && (
                              <div className="flex flex-wrap gap-2 mt-2">
                                {item.fabricType && (
                                  <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                                    {item.fabricType}
                                  </span>
                                )}
                                {item.color && (
                                  <span className="text-sm text-muted-foreground bg-secondary px-2 py-1 rounded">
                                    {item.color}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            aria-label="إزالة من السلة"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        {/* Quantity & Price */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">الكمية:</span>
                            <div className="flex items-center border border-border rounded-lg overflow-hidden">
                              <button
                                onClick={() => handleQuantityChange(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-10 text-center font-semibold text-foreground">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item.id, 1)}
                                className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Line Total */}
                          <div className="text-left">
                            <span className="text-lg font-bold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            {item.quantity > 1 && (
                              <p className="text-sm text-muted-foreground">
                                {formatPrice(item.price)} × {item.quantity}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Note Input */}
                        <div className="space-y-2">
                          <Label htmlFor={`note-${item.id}`} className="text-sm text-muted-foreground">
                            إضافة ملاحظة (اختياري)
                          </Label>
                          <Textarea
                            id={`note-${item.id}`}
                            placeholder="مثال: أريد القماش بطول 3 أمتار"
                            value={itemNotes[item.id] || ''}
                            onChange={(e) => handleNoteChange(item.id, e.target.value)}
                            className="min-h-[60px] text-sm resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Continue Shopping Link */}
              <div className="pt-4">
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  متابعة التسوق
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft sticky top-24"
              >
                <h2 className="text-xl font-bold text-foreground mb-6">
                  ملخص الطلب
                </h2>

                {/* Coupon Code */}
                <div className="mb-6 space-y-3">
                  <Label htmlFor="coupon" className="text-foreground font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    كود الخصم
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="coupon"
                      type="text"
                      placeholder="أدخل كود الخصم"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                      disabled={appliedDiscount > 0}
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || appliedDiscount > 0}
                    >
                      {isApplyingCoupon ? (
                        <span className="h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        'تطبيق'
                      )}
                    </Button>
                  </div>
                  {couponMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 text-sm ${
                        couponStatus === 'success' ? 'text-green-600' : 'text-destructive'
                      }`}
                    >
                      {couponStatus === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                      {couponMessage}
                    </motion.div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-border pt-4">
                  <div className="flex justify-between text-foreground">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم ({appliedDiscount}%)</span>
                      <span>- {formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-foreground">
                    <span>مصاريف التوصيل</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">مجاني</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-foreground">
                    <span>ضريبة القيمة المضافة (15%)</span>
                    <span>{formatPrice(taxAmount)}</span>
                  </div>

                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">الإجمالي</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Notice */}
                {subtotal < 1000 && (
                  <div className="mt-4 p-3 bg-accent/10 rounded-lg">
                    <p className="text-sm text-foreground flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-accent" />
                      أضف {formatPrice(1000 - subtotal)} للحصول على شحن مجاني
                    </p>
                  </div>
                )}

                {/* Checkout Button */}
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full mt-6"
                  onClick={handleCheckout}
                >
                  <ShoppingBag className="h-5 w-5 ml-2" />
                  استكمال الطلب
                </Button>

                {/* Secure Checkout Notice */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  🔒 الدفع آمن ومشفر
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Cart;
