import { Link } from "react-router-dom";
import AccountShell from "@/components/account/AccountShell";
import { Button } from "@/components/ui/button";

const orders = [
  { id: "104233", date: "25 يناير 2026", status: "قيد المعالجة", total: "OMR 32.50" },
  { id: "103997", date: "12 يناير 2026", status: "تم الشحن", total: "OMR 58.90" },
];

export default function Orders() {
  return (
    <AccountShell title="طلباتي" subtitle="قائمة الطلبات السابقة (Placeholder).">
      <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border/60 bg-background p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">رقم الطلب</div>
                  <div className="text-lg font-extrabold text-foreground">{o.id}</div>
                </div>
                <div className="text-left">
                  <div className="text-sm text-muted-foreground">الإجمالي</div>
                  <div className="text-lg font-extrabold text-foreground">{o.total}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">التاريخ: {o.date}</span>
                <span className="font-semibold text-foreground">الحالة: {o.status}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                  <Link to={`/order/success/${o.id}`}>عرض التفاصيل (Placeholder)</Link>
                </Button>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                  إعادة الطلب (TODO)
                </Button>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">TODO(orders): ربط جلب الطلبات وتفاصيلها عبر API.</p>
      </div>
    </AccountShell>
  );
}

