import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ShoppingBag, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const OrderSuccess = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-background p-4" dir="rtl">
      <Card className="w-full max-w-lg text-center shadow-lg border-primary/10">
        <CardHeader className="flex flex-col items-center gap-4 pb-2">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-primary">تم إرسال طلبك بنجاح!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            شكراً لتسوقك معنا. تم استلام طلبك وجاري معالجته حالياً.
            ستصلك رسالة نصية بتفاصيل الطلب.
          </p>
          
          <div className="bg-muted/50 rounded-lg p-6 space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-muted-foreground/20">
              <span className="text-muted-foreground">رقم الطلب</span>
              <span className="font-bold font-mono text-lg">#{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">حالة الطلب</span>
              <span className="font-medium text-primary bg-primary/10 px-3 py-1 rounded-full text-sm">
                قيد المعالجة
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link to={`/account/orders`}>
              <FileText className="ml-2 h-4 w-4" />
              عرض تفاصيل الطلب
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link to="/">
              <ShoppingBag className="ml-2 h-4 w-4" />
              العودة للمتجر
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default OrderSuccess;
