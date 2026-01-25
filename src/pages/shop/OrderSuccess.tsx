import { Link, useParams } from "react-router-dom";
import { CheckCircle2, PackageSearch } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <main className="overflow-hidden">
      <Header />

      <section className="pt-24 pb-12 bg-background">
        <div className="container-rtl">
          <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card p-8 shadow-soft text-center">
            <div className="mx-auto mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
              <CheckCircle2 className="h-9 w-9 text-accent" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground">تم إرسال طلبك بنجاح</h1>
            <p className="mt-2 text-muted-foreground">شكراً لك — سنقوم بمعالجة طلبك والتواصل معك في أقرب وقت.</p>

            <div className="mt-6 rounded-xl bg-background p-4 text-right">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">رقم الطلب</span>
                <span className="text-sm font-bold text-foreground">{orderId ?? "—"}</span>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">حالة الطلب</span>
                <span className="text-sm font-bold text-foreground">قيد المعالجة</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button
                asChild
                className="bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
              >
                <Link to="/account/orders">
                  <PackageSearch className="h-4 w-4 ml-2" />
                  عرض تفاصيل الطلب
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                <Link to="/shop">العودة للمتجر</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

