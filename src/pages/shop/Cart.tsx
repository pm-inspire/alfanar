import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

// Mock data
const INITIAL_CART_ITEMS = [
  {
    id: "1",
    name: "قماش ياباني فاخر - أبيض",
    price: 150,
    quantity: 1,
    image: "/placeholder.svg",
    note: "",
  },
  {
    id: "2",
    name: "قماش كوري صيفي - سكري",
    price: 120,
    quantity: 2,
    image: "/placeholder.svg",
    note: "",
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleQuantityChange = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      description: "تم إزالة المنتج من السلة",
    });
  };

  const handleNoteChange = (id: string, note: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, note } : item))
    );
  };

  const handleApplyCoupon = () => {
    if (couponCode === "ALFANAR20") {
      setDiscount(0.2); // 20% discount
      toast({
        title: "تم تطبيق الكوبون",
        description: "حصلت على خصم 20%",
      });
    } else {
      toast({
        variant: "destructive",
        title: "كوبون غير صالح",
        description: "تأكد من صحة الكود وحاول مرة أخرى",
      });
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const shipping = 25; // Fixed shipping
  const tax = (subtotal - discountAmount) * 0.15; // 15% VAT
  const total = subtotal - discountAmount + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center p-4">
        <div className="bg-muted p-6 rounded-full">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-primary">سلة التسوق فارغة</h2>
        <p className="text-muted-foreground">تصفح منتجاتنا وأضف ما يعجبك إلى السلة</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          العودة للمتجر
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-primary mb-8">سلة التسوق</h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="h-24 w-24 bg-muted rounded-md overflow-hidden shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-primary font-bold mt-1">{item.price} ر.س</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-1 hover:bg-muted transition-colors"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-1 hover:bg-muted transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="font-bold text-lg">
                        {item.price * item.quantity} ر.س
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Textarea
                    placeholder="إضافة ملاحظة للمنتج (اختياري)"
                    value={item.note}
                    onChange={(e) => handleNoteChange(item.id, e.target.value)}
                    className="h-20 resize-none text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>ملخص الطلب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="كود الخصم"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button variant="outline" onClick={handleApplyCoupon}>
                  تطبيق
                </Button>
              </div>
              
              <Separator />
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{subtotal.toFixed(2)} ر.س</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>الخصم</span>
                    <span>-{discountAmount.toFixed(2)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span>{shipping.toFixed(2)} ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الضريبة (15%)</span>
                  <span>{tax.toFixed(2)} ر.س</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>الإجمالي</span>
                  <span className="text-primary">{total.toFixed(2)} ر.س</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full text-lg py-6" 
                onClick={() => navigate("/checkout")}
              >
                استكمال الطلب
                <ArrowRight className="mr-2 h-5 w-5" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;
