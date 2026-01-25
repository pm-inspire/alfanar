import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Package, 
  ShoppingBag, 
  FileText,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const OrderSuccess = () => {
  const { orderId } = useParams<{ orderId: string }>();

  // TODO: جلب تفاصيل الطلب من API
  // const { data: orderDetails } = useQuery(['order', orderId], () => api.getOrder(orderId));
  
  const orderDetails = {
    id: orderId,
    status: 'قيد المعالجة',
    estimatedDelivery: '3-5 أيام عمل',
    total: 1656,
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-cream pt-24 pb-16">
        <div className="container-rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            {/* Success Card */}
            <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-card text-center">
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.2 
                }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="h-12 w-12 text-green-600" />
              </motion.div>

              {/* Success Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-foreground mb-3">
                  تم إرسال طلبك بنجاح! 🎉
                </h1>
                <p className="text-muted-foreground text-lg mb-8">
                  شكراً لك على ثقتك بالفنار. سنقوم بمعالجة طلبك في أقرب وقت.
                </p>
              </motion.div>

              {/* Order Details Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-secondary/50 rounded-xl p-6 mb-8 text-right"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Order Number */}
                  <div className="p-4 bg-card rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">رقم الطلب</span>
                    </div>
                    <p className="font-bold text-foreground text-lg" dir="ltr">
                      {orderDetails.id}
                    </p>
                  </div>

                  {/* Order Status */}
                  <div className="p-4 bg-card rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">حالة الطلب</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <p className="font-bold text-foreground">{orderDetails.status}</p>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="p-4 bg-card rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">التوصيل المتوقع</span>
                    </div>
                    <p className="font-bold text-foreground">{orderDetails.estimatedDelivery}</p>
                  </div>

                  {/* Order Total */}
                  <div className="p-4 bg-card rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                      <span className="text-sm text-muted-foreground">إجمالي الطلب</span>
                    </div>
                    <p className="font-bold text-primary text-lg">
                      {formatPrice(orderDetails.total)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* What's Next Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-8 text-right"
              >
                <h2 className="text-lg font-bold text-foreground mb-4">
                  ماذا بعد؟
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <p className="text-muted-foreground">
                      سنقوم بتأكيد طلبك عبر رسالة نصية على رقم جوالك
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <p className="text-muted-foreground">
                      سيتم تجهيز طلبك وإرساله خلال المدة المحددة
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <p className="text-muted-foreground">
                      سيتواصل معك مندوب التوصيل قبل الوصول
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link to={`/account/orders/${orderId}`}>
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <FileText className="h-5 w-5 ml-2" />
                    عرض تفاصيل الطلب
                  </Button>
                </Link>
                <Link to="/">
                  <Button variant="gold" size="lg" className="w-full sm:w-auto">
                    <ShoppingBag className="h-5 w-5 ml-2" />
                    العودة للمتجر
                  </Button>
                </Link>
              </motion.div>

              {/* Support Contact */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 pt-6 border-t border-border"
              >
                <p className="text-sm text-muted-foreground">
                  لديك استفسار؟{' '}
                  <Link to="/contact" className="text-primary hover:underline">
                    تواصل معنا
                  </Link>
                  {' '}أو اتصل على{' '}
                  <a href="tel:+966500000000" className="text-primary hover:underline" dir="ltr">
                    +966 XX XXX XXXX
                  </a>
                </p>
              </motion.div>
            </div>

            {/* Confetti Effect - CSS Animation */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ 
                    y: -20, 
                    x: Math.random() * window.innerWidth,
                    rotate: 0,
                    opacity: 1 
                  }}
                  animate={{ 
                    y: window.innerHeight + 20,
                    rotate: 360,
                    opacity: 0
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    delay: Math.random() * 0.5,
                    ease: 'linear'
                  }}
                  className="absolute w-3 h-3 rounded"
                  style={{
                    backgroundColor: ['#D4AF37', '#79272F', '#FFD700', '#228B22'][Math.floor(Math.random() * 4)],
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderSuccess;
