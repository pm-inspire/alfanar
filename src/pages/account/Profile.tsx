import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold text-primary mb-8">الملف الشخصي</h1>
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>البيانات الشخصية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>الاسم الأول</Label>
              <Input defaultValue="محمد" />
            </div>
            <div className="space-y-2">
              <Label>اسم العائلة</Label>
              <Input defaultValue="عبدالله" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input defaultValue="user@example.com" type="email" />
          </div>
          <div className="space-y-2">
            <Label>رقم الجوال</Label>
            <Input defaultValue="0500000000" type="tel" className="text-right" dir="ltr" />
          </div>
          <Button className="mt-4">حفظ التغييرات</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
