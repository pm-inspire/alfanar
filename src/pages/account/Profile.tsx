import AccountShell from "@/components/account/AccountShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Profile() {
  return (
    <AccountShell title="البيانات الشخصية" subtitle="حدّث بياناتك بسهولة (واجهة فقط).">
      <div className="max-w-2xl rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input id="fullName" placeholder="مثال: أحمد محمد" className="bg-background" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الجوال</Label>
            <Input id="phone" type="tel" placeholder="+968 9XXXXXXX" className="bg-background" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="bg-background" />
          </div>
        </div>

        <Button className="mt-6 bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold">
          حفظ التغييرات
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">TODO(account): ربط حفظ البيانات عبر API لاحقاً.</p>
      </div>
    </AccountShell>
  );
}

