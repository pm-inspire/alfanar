import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, CreditCard, Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("visa");
  const [saveAddress, setSaveAddress] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const orderId = Math.floor(Math.random() * 1000000);
      toast({
        title: "تم استلام طلبك بنجاح",
        description: `رقم الطلب #${orderId}`,
      });
      navigate(`/order/success/${orderId}`);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-primary mb-8">إتمام الطلب</h1>

      <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                عنوان التوصيل
              </CardTitle>
              <CardDescription>اختر عنوان التوصيل الخاص بك</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Map Placeholder */}
              <div className="bg-muted h-48 rounded-md flex items-center justify-center border-2 border-dashed">
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  الخريطة (Google Maps Placeholder)
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">المدينة</Label>
                  <Input id="city" placeholder="الرياض" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">الحي</Label>
                  <Input id="district" placeholder="حي الملقا" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">اسم الشارع</Label>
                  <Input id="street" placeholder="شارع الملك فهد" required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">وصف إضافي للعنوان (اختياري)</Label>
                  <Input id="notes" placeholder="بجوار..." />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Checkbox
                  id="saveAddress"
                  checked={saveAddress}
                  onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                />
                <Label htmlFor="saveAddress" className="font-normal cursor-pointer">
                  حفظ هذا العنوان في عناويني للاستخدام لاحقاً
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                طريقة الدفع
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                <Label
                  htmlFor="visa"
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    paymentMethod === "visa" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="visa" id="visa" />
                    <span>بطاقة ائتمان / مدى</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-6 w-10 bg-muted rounded" /> {/* Visa Icon Placeholder */}
                    <div className="h-6 w-10 bg-muted rounded" /> {/* MC Icon Placeholder */}
                    <div className="h-6 w-10 bg-muted rounded" /> {/* Mada Icon Placeholder */}
                  </div>
                </Label>

                <Label
                  htmlFor="applepay"
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    paymentMethod === "applepay" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="applepay" id="applepay" />
                    <span>Apple Pay</span>
                  </div>
                  <div className="h-6 w-10 bg-muted rounded" /> {/* Apple Pay Icon Placeholder */}
                </Label>

                <Label
                  htmlFor="stcpay"
                  className={`flex items-center justify-between border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                    paymentMethod === "stcpay" ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="stcpay" id="stcpay" />
                    <span>STC Pay</span>
                  </div>
                  <div className="h-6 w-10 bg-muted rounded" /> {/* STC Pay Icon Placeholder */}
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mock Items Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>قماش ياباني فاخر × 1</span>
                  <span>150 ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>قماش كوري صيفي × 2</span>
                  <span>240 ر.س</span>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>390.00 ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span>25.00 ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الضريبة (15%)</span>
                  <span>58.50 ر.س</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary">473.50 ر.س</span>
                </div>
              </div>

              <Button type="submit" className="w-full text-lg py-6 mt-4" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    جاري المعالجة...
                  </>
                ) : (
                  "إتمام الطلب"
                )}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                بإتمام الطلب، أنت توافق على الشروط والأحكام الخاصة بالمتجر
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
