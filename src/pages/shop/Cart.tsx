import { useMemo, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, TicketPercent } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import menuCroissant from "@/assets/menu-croissant.jpg";
import menuFrenchToast from "@/assets/menu-french-toast.jpg";

type CartItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  note: string;
  thumbnail: string;
};

type State = {
  items: CartItem[];
  coupon: string;
  couponMessage: { type: "success" | "error"; text: string } | null;
  discountAmount: number;
};

type Action =
  | { type: "INC"; id: string }
  | { type: "DEC"; id: string }
  | { type: "REMOVE"; id: string }
  | { type: "NOTE"; id: string; note: string }
  | { type: "SET_COUPON"; value: string }
  | { type: "APPLY_COUPON" }
  | { type: "CLEAR_COUPON_MESSAGE" };

const initialState: State = {
  items: [
    {
      id: "c-1",
      name: "قماش ثوب رجالي سويسري فاخر",
      price: 24.9,
      qty: 1,
      note: "",
      thumbnail: menuCroissant,
    },
    {
      id: "c-2",
      name: "قماش ثوب رجالي صيفي خفيف",
      price: 18.5,
      qty: 2,
      note: "يرجى التأكيد على توفر نفس اللون",
      thumbnail: menuFrenchToast,
    },
  ],
  coupon: "",
  couponMessage: null,
  discountAmount: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INC":
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, qty: Math.min(99, i.qty + 1) } : i)),
      };
    case "DEC":
      return {
        ...state,
        items: state.items.map((i) => (i.id === action.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i)),
      };
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "NOTE":
      return { ...state, items: state.items.map((i) => (i.id === action.id ? { ...i, note: action.note } : i)) };
    case "SET_COUPON":
      return { ...state, coupon: action.value, couponMessage: null };
    case "APPLY_COUPON": {
      // TODO(coupon): call apply-coupon API and compute real discount.
      const code = state.coupon.trim().toUpperCase();
      if (!code) {
        return { ...state, couponMessage: { type: "error", text: "أدخل كود الخصم أولاً" }, discountAmount: 0 };
      }
      if (code === "ALFANAR10") {
        const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
        const discount = Number((subtotal * 0.1).toFixed(2));
        return { ...state, couponMessage: { type: "success", text: "تم تطبيق كوبون الخصم بنجاح" }, discountAmount: discount };
      }
      return { ...state, couponMessage: { type: "error", text: "كود الخصم غير صالح" }, discountAmount: 0 };
    }
    case "CLEAR_COUPON_MESSAGE":
      return { ...state, couponMessage: null };
    default:
      return state;
  }
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("ar", { style: "currency", currency: "OMR" }).format(n);
}

export default function Cart() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const subtotal = useMemo(() => state.items.reduce((sum, i) => sum + i.price * i.qty, 0), [state.items]);
  const delivery = 2.0; // TODO(shipping): compute from address/delivery method
  const tax = useMemo(() => Number(((subtotal - state.discountAmount + delivery) * 0.05).toFixed(2)), [subtotal, state.discountAmount]); // placeholder 5%
  const total = useMemo(() => Math.max(0, subtotal - state.discountAmount + delivery + tax), [subtotal, state.discountAmount, tax]);

  return (
    <main className="overflow-hidden">
      <Header />

      <section className="pt-24 pb-12 bg-background">
        <div className="container-rtl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">سلة التسوق</h1>
              <p className="mt-2 text-muted-foreground">راجع المنتجات قبل استكمال الطلب.</p>
            </div>
            <Link to="/shop" className="text-sm text-accent hover:underline">
              متابعة التسوق
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.length === 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft text-center">
                  <p className="font-semibold text-foreground">سلتك فارغة</p>
                  <p className="mt-2 text-sm text-muted-foreground">ابدأ بإضافة منتجات من المتجر.</p>
                  <Button
                    className="mt-4 bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
                    onClick={() => navigate("/shop")}
                  >
                    الذهاب إلى المتجر
                  </Button>
                </div>
              ) : null}

              {state.items.map((item) => {
                const lineTotal = item.price * item.qty;
                return (
                  <div key={item.id} className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                        <img src={item.thumbnail} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="font-bold text-foreground leading-snug line-clamp-2">{item.name}</h3>
                            <p className="mt-1 text-sm text-muted-foreground">{formatMoney(item.price)} / متر</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => dispatch({ type: "REMOVE", id: item.id })}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="إزالة المنتج"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                          <div className="md:col-span-2">
                            <LabelLike>إضافة ملاحظة</LabelLike>
                            <Textarea
                              value={item.note}
                              onChange={(e) => dispatch({ type: "NOTE", id: item.id, note: e.target.value })}
                              placeholder="مثال: أحتاج نفس الدرجة بالضبط"
                              className="mt-2 resize-none bg-background"
                              rows={2}
                            />
                          </div>

                          <div>
                            <LabelLike>الكمية</LabelLike>
                            <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background px-2 py-1">
                              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => dispatch({ type: "INC", id: item.id })}>
                                <Plus className="h-4 w-4" />
                              </Button>
                              <div className="text-center">
                                <div className="text-sm font-bold text-foreground">{item.qty}</div>
                                <div className="text-xs text-muted-foreground">متر</div>
                              </div>
                              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => dispatch({ type: "DEC", id: item.id })}>
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>

                            <div className="mt-3 text-right">
                              <p className="text-xs text-muted-foreground">سعر السطر</p>
                              <p className="text-lg font-extrabold text-foreground">{formatMoney(lineTotal)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <h2 className="text-lg font-bold text-foreground">كوبون خصم</h2>
                <div className="mt-3 flex gap-2">
                  <Input
                    value={state.coupon}
                    onChange={(e) => dispatch({ type: "SET_COUPON", value: e.target.value })}
                    placeholder="مثال: ALFANAR10"
                    className="bg-background"
                  />
                  <Button
                    type="button"
                    onClick={() => dispatch({ type: "APPLY_COUPON" })}
                    className="bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
                  >
                    تطبيق
                  </Button>
                </div>
                {state.couponMessage ? (
                  <p
                    className={cn(
                      "mt-2 text-sm",
                      state.couponMessage.type === "success" ? "text-foreground" : "text-destructive",
                    )}
                  >
                    <TicketPercent className="inline h-4 w-4 ml-2" />
                    {state.couponMessage.text}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <h2 className="text-lg font-bold text-foreground">ملخص الفاتورة</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <Row label="المجموع الفرعي" value={formatMoney(subtotal)} />
                  <Row label="الخصم" value={formatMoney(state.discountAmount)} muted={!state.discountAmount} />
                  <Row label="مصاريف التوصيل" value={formatMoney(delivery)} />
                  <Row label="الضريبة (5%)" value={formatMoney(tax)} />
                  <Separator className="my-2" />
                  <Row label="الإجمالي" value={formatMoney(total)} strong />
                </div>

                <Button
                  className="mt-5 w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
                  size="lg"
                  disabled={state.items.length === 0}
                  onClick={() => {
                    // TODO(checkout): validate cart and proceed to checkout.
                    navigate("/checkout");
                  }}
                >
                  استكمال الطلب
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function LabelLike({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold text-foreground">{children}</div>;
}

function Row({
  label,
  value,
  strong,
  muted,
}: {
  label: string;
  value: string;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn("text-muted-foreground", strong && "text-foreground font-semibold")}>{label}</span>
      <span className={cn(strong ? "text-foreground font-extrabold" : "text-foreground", muted && "text-muted-foreground")}>
        {value}
      </span>
    </div>
  );
}

