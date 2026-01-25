import AccountShell from "@/components/account/AccountShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const addresses = [
  { id: "a-1", street: "شارع السلطان قابوس", city: "مسقط", isDefault: true },
  { id: "a-2", street: "شارع الخوير", city: "مسقط", isDefault: false },
];

export default function Addresses() {
  return (
    <AccountShell title="عناويني" subtitle="إدارة العناوين المحفوظة (Placeholder).">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold text-foreground">إضافة عنوان جديد</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">اسم الشارع</Label>
              <Input id="street" placeholder="مثال: شارع السلطان قابوس" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">المدينة</Label>
              <Input id="city" placeholder="مثال: مسقط" className="bg-background" />
            </div>
            <Button className="bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold">
              حفظ العنوان
            </Button>
            <p className="text-xs text-muted-foreground">TODO(addresses): ربط إضافة/تعديل/حذف العناوين عبر API.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <h2 className="text-lg font-bold text-foreground">العناوين المحفوظة</h2>
          <div className="mt-4 space-y-4">
            {addresses.map((a) => (
              <div key={a.id} className="rounded-xl border border-border/60 bg-background p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-bold text-foreground">
                      {a.street} — {a.city}
                    </div>
                    {a.isDefault ? <div className="mt-1 text-xs text-accent">العنوان الافتراضي</div> : null}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      تعديل
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                      حذف
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            <Separator />
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              تعيين الافتراضي (TODO)
            </Button>
          </div>
        </div>
      </div>
    </AccountShell>
  );
}

