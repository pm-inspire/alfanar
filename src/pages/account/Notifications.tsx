import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

const Notifications = () => {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-primary mb-8">الإشعارات</h1>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className={i === 1 ? "bg-primary/5" : ""}>
            <CardContent className="p-4 flex gap-4 items-start">
              <div className="bg-muted p-2 rounded-full mt-1">
                <Bell className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold">تم تأكيد طلبك #{i}23456</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  تم استلام طلبك وجاري تجهيزه للشحن. شكراً لتسوقك معنا.
                </p>
                <span className="text-xs text-muted-foreground mt-2 block">منذ {i} ساعة</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
