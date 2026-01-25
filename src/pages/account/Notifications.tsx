import AccountShell from "@/components/account/AccountShell";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: "n-1", title: "تم استلام طلبك", body: "طلبك قيد المعالجة وسيتم تحديثك بالحالة قريباً.", time: "منذ ساعتين" },
  { id: "n-2", title: "عرض جديد", body: "خصم 10% على بعض الأقمشة المختارة (Placeholder).", time: "أمس" },
];

export default function Notifications() {
  return (
    <AccountShell title="الإشعارات" subtitle="اطّلع على آخر التحديثات والتنبيهات.">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="rounded-xl border border-border/60 bg-background p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-bold text-foreground">{n.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{n.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
            تعليم كمقروء (TODO)
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
            مسح الكل (TODO)
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">TODO(notifications): ربط الإشعارات عبر API.</p>
      </div>
    </AccountShell>
  );
}

