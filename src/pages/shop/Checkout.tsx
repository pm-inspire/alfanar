import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  CreditCard,
  Wallet,
  Save,
  AlertCircle,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface AddressForm {
  streetName: string;
  city: string;
  saveAddress: boolean;
}

interface FormErrors {
  streetName?: string;
  city?: string;
  paymentMethod?: string;
  general?: string;
}

// بيانات وهمية للسلة
const cartSummary = {
  items: [
    { name: 'قماش ثوب صيفي فاخر - أبيض ناصع', quantity: 2, price: 700 },
    { name: 'قماش شتوي بريطاني - رمادي داكن', quantity: 1, price: 480 },
    { name: 'قماش ثوب مخلوط - بيج ذهبي', quantity: 1, price: 420 },
  ],
  subtotal: 1600,
  discount: 160,
  shipping: 0,
  tax: 216,
  total: 1656,
};

const paymentMethods = [
  { id: 'visa', name: 'فيزا', icon: '💳' },
  { id: 'mastercard', name: 'ماستر كارد', icon: '💳' },
  { id: 'mada', name: 'مدى', icon: '🏦' },
  { id: 'applepay', name: 'Apple Pay', icon: '🍎' },
  { id: 'stcpay', name: 'STC Pay', icon: '📱' },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState<AddressForm>({
    streetName: '',
    city: '',
    saveAddress: false,
  });
  const [selectedPayment, setSelectedPayment] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
    }).format(value);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!address.streetName.trim()) {
      newErrors.streetName = 'اسم الشارع مطلوب';
    }

    if (!address.city.trim()) {
      newErrors.city = 'المدينة مطلوبة';
    }

    if (!selectedPayment) {
      newErrors.paymentMethod = 'الرجاء اختيار طريقة الدفع';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // TODO: استدعاء API لإنشاء الطلب
      // const response = await api.createOrder({
      //   address: {
      //     street: address.streetName,
      //     city: address.city,
      //     saveAddress: address.saveAddress,
      //   },
      //   paymentMethod: selectedPayment,
      //   items: cartSummary.items,
      // });
      console.log('Creating order:', {
        address,
        paymentMethod: selectedPayment,
        total: cartSummary.total,
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // TODO: الانتقال لصفحة نجاح الطلب مع رقم الطلب الحقيقي
      const orderId = `ORD-${Date.now()}`;
      navigate(`/order/success/${orderId}`);

    } catch (error) {
      setErrors({ general: 'حدث خطأ أثناء إنشاء الطلب، الرجاء المحاولة لاحقاً' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAddress = (field: keyof AddressForm, value: string | boolean) => {
    setAddress(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

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
            <Link
              to="/cart"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
            >
              <ChevronLeft className="h-4 w-4" />
              العودة للسلة
            </Link>
            <h1 className="text-3xl font-bold text-foreground">إتمام الطلب</h1>
          </motion.div>

          {/* Error Alert */}
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-destructive">{errors.general}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Address Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft"
              >
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  عنوان التوصيل
                </h2>

                {/* Map Placeholder */}
                <div className="mb-6">
                  <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center text-muted-foreground">
                      <MapPin className="h-10 w-10 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">
                        {/* TODO: دمج خريطة Google Maps هنا */}
                        سيتم إضافة خريطة Google Maps هنا
                      </p>
                      <p className="text-xs mt-1">
                        يمكنك تحديد موقعك بالضغط على الخريطة
                      </p>
                    </div>
                  </div>
                </div>

                {/* Address Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="streetName" className="text-foreground">
                      اسم الشارع / العنوان التفصيلي *
                    </Label>
                    <Input
                      id="streetName"
                      type="text"
                      placeholder="مثال: شارع الأمير محمد بن فهد، مبنى رقم 5"
                      value={address.streetName}
                      onChange={(e) => updateAddress('streetName', e.target.value)}
                      className={errors.streetName ? 'border-destructive' : ''}
                    />
                    {errors.streetName && (
                      <p className="text-destructive text-sm">{errors.streetName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">
                      المدينة *
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="مثال: الجبيل الصناعية"
                      value={address.city}
                      onChange={(e) => updateAddress('city', e.target.value)}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && (
                      <p className="text-destructive text-sm">{errors.city}</p>
                    )}
                  </div>

                  {/* Save Address Checkbox */}
                  <div className="flex items-center gap-3 pt-2">
                    <Checkbox
                      id="saveAddress"
                      checked={address.saveAddress}
                      onCheckedChange={(checked) => updateAddress('saveAddress', checked as boolean)}
                    />
                    <label
                      htmlFor="saveAddress"
                      className="text-sm text-muted-foreground cursor-pointer flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      حفظ هذا العنوان في عناويني للاستخدام لاحقاً
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Payment Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft"
              >
                <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  طريقة الدفع
                </h2>

                <RadioGroup
                  value={selectedPayment}
                  onValueChange={(value) => {
                    setSelectedPayment(value);
                    if (errors.paymentMethod) {
                      setErrors(prev => ({ ...prev, paymentMethod: undefined }));
                    }
                  }}
                  className="space-y-3"
                >
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-all cursor-pointer ${
                        selectedPayment === method.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => {
                        setSelectedPayment(method.id);
                        if (errors.paymentMethod) {
                          setErrors(prev => ({ ...prev, paymentMethod: undefined }));
                        }
                      }}
                    >
                      <RadioGroupItem value={method.id} id={method.id} />
                      <span className="text-2xl">{method.icon}</span>
                      <label
                        htmlFor={method.id}
                        className="font-medium text-foreground cursor-pointer flex-1"
                      >
                        {method.name}
                      </label>
                      {method.id === 'mada' && (
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                          موصى به
                        </span>
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {errors.paymentMethod && (
                  <p className="text-destructive text-sm mt-3">{errors.paymentMethod}</p>
                )}

                {/* Payment Note */}
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    سيتم خصم المبلغ فور تأكيد الطلب
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card rounded-xl border border-border p-6 shadow-soft sticky top-24"
              >
                <h2 className="text-xl font-bold text-foreground mb-6">
                  ملخص الطلب
                </h2>

                {/* Cart Items Summary */}
                <div className="space-y-3 border-b border-border pb-4 mb-4">
                  {cartSummary.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start text-sm">
                      <div className="flex-1">
                        <p className="text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground text-xs">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <span className="text-foreground font-medium mr-2">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between text-foreground">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(cartSummary.subtotal)}</span>
                  </div>

                  {cartSummary.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>الخصم</span>
                      <span>- {formatPrice(cartSummary.discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-foreground">
                    <span>مصاريف التوصيل</span>
                    <span>
                      {cartSummary.shipping === 0 ? (
                        <span className="text-green-600">مجاني</span>
                      ) : (
                        formatPrice(cartSummary.shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-foreground">
                    <span>ضريبة القيمة المضافة (15%)</span>
                    <span>{formatPrice(cartSummary.tax)}</span>
                  </div>

                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-foreground">الإجمالي</span>
                      <span className="text-xl font-bold text-primary">
                        {formatPrice(cartSummary.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  variant="gold"
                  size="lg"
                  className="w-full mt-6"
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-5 w-5 border-2 border-coffee-dark/30 border-t-coffee-dark rounded-full animate-spin" />
                      جاري إنشاء الطلب...
                    </span>
                  ) : (
                    'إتمام الطلب'
                  )}
                </Button>

                {/* Secure Checkout Notice */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  🔒 جميع معاملاتك آمنة ومشفرة
                </p>

                {/* Terms Notice */}
                <p className="text-center text-xs text-muted-foreground mt-2">
                  بالضغط على "إتمام الطلب" فإنك توافق على{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    الشروط والأحكام
                  </Link>{' '}
                  و{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline">
                    سياسة الخصوصية
                  </Link>
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

export default Checkout;
