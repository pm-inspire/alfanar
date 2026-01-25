import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Orders = () => {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-primary mb-8">طلباتي</h1>
      <div className="space-y-4">
        {[1, 2, 3].map((order) => (
          <Card key={order}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">طلب #{order}23456</CardTitle>
              <Badge variant={order === 1 ? "default" : "secondary"}>
                {order === 1 ? "قيد المعالجة" : "تم التوصيل"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  <p>تاريخ الطلب: {new Date().toLocaleDateString('ar-SA')}</p>
                  <p>عدد المنتجات: {order + 1}</p>
                  <p className="font-bold text-foreground mt-1">الإجمالي: {order * 150} ر.س</p>
                </div>
                <Button variant="outline" size="sm">عرض التفاصيل</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
