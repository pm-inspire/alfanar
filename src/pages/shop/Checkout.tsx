import { useMemo, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, MapPin, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type PaymentMethod = "visa" | "mastercard" | "mada" | "applepay" | "stcpay";

type State = {
  street: string;
  city: string;
  saveAddress: boolean;
  paymentMethod: PaymentMethod | "";
  errors: Partial<Record<"street" | "city" | "paymentMethod", string>>;
  banner: { type: "success" | "error"; text: string } | null;
  isSubmitting: boolean;
};

type Action =
  | { type: "SET_FIELD"; field: "street" | "city"; value: string }
  | { type: "SET_SAVE"; value: boolean }
  | { type: "SET_PAYMENT"; value: PaymentMethod }
  | { type: "SET_ERROR"; field: "street" | "city" | "paymentMethod"; message?: string }
  | { type: "SET_BANNER"; banner?: State["banner"] }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "RESET_ERRORS" };

const initialState: State = {
  street: "",
  city: "",
  saveAddress: false,
  paymentMethod: "",
  errors: {},
  banner: null,
  isSubmitting: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value, errors: { ...state.errors, [action.field]: undefined }, banner: null };
    case "SET_SAVE":
      return { ...state, saveAddress: action.value, banner: null };
    case "SET_PAYMENT":
      return { ...state, paymentMethod: action.value, errors: { ...state.errors, paymentMethod: undefined }, banner: null };
    case "SET_ERROR":
      return { ...state, errors: { ...state.errors, [action.field]: action.message } };
    case "SET_BANNER":
      return { ...state, banner: action.banner ?? null };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value };
    case "RESET_ERRORS":
      return { ...state, errors: {} };
    default:
      return state;
  }
}

function formatMoney(n: number) {
  return new Intl.NumberFormat("ar", { style: "currency", currency: "OMR" }).format(n);
}

export default function Checkout() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  // Placeholder summary (until cart store/API is wired)
  const subtotal = 61.9;
  const discount = 6.19;
  const delivery = 2.0;
  const tax = useMemo(() => Number(((subtotal - discount + delivery) * 0.05).toFixed(2)), []);
  const total = Math.max(0, subtotal - discount + delivery + tax);

  const validate = () => {
    dispatch({ type: "RESET_ERRORS" });
    let ok = true;

    if (!state.street.trim()) {
      dispatch({ type: "SET_ERROR", field: "street", message: "اسم الشارع مطلوب" });
      ok = false;
    }
    if (!state.city.trim()) {
      dispatch({ type: "SET_ERROR", field: "city", message: "المدينة مطلوبة" });
      ok = false;
    }
    if (!state.paymentMethod) {
      dispatch({ type: "SET_ERROR", field: "paymentMethod", message: "اختر طريقة الدفع" });
      ok = false;
    }

    if (!ok) dispatch({ type: "SET_BANNER", banner: { type: "error", text: "تحقق من البيانات المطلوبة ثم أعد المحاولة" } });
    return ok;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(order): call place-order API with address + payment method + cart snapshot.
      await new Promise((r) => setTimeout(r, 900));

      // TODO(order): use real orderId from API response.
      const orderId = String(Math.floor(100000 + Math.random() * 900000));
      dispatch({ type: "SET_BANNER", banner: { type: "success", text: "تم إرسال طلبك بنجاح" } });
      navigate(`/order/success/${orderId}`);
    } catch {
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "تعذر إتمام الطلب حالياً، حاول مرة أخرى." } });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  return (
    <main className="overflow-hidden">
      <Header />

      <section className="pt-24 pb-12 bg-background">
        <div className="container-rtl">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">إنهاء الطلب</h1>
              <p className="mt-2 text-muted-foreground">أكمل بيانات العنوان واختر طريقة الدفع.</p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {state.banner ? (
                <div
                  className={cn(
                    "rounded-lg border px-4 py-3 text-sm",
                    state.banner.type === "success" ? "border-accent/30 bg-accent/10 text-foreground" : "border-destructive/30 bg-destructive/10 text-destructive",
                  )}
                >
                  {state.banner.text}
                </div>
              ) : null}

              {/* Address */}
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">العنوان</h2>
                </div>

                <div className="mt-4 rounded-2xl border border-dashed border-border bg-muted/40 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      Placeholder: خريطة Google Maps (div جاهز لدمج iframe / SDK لاحقاً)
                    </p>
                    <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                      تحديد على الخريطة
                    </Button>
                  </div>
                  <div className="mt-3 h-48 w-full rounded-xl bg-muted" />
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">اسم الشارع</Label>
                    <Input
                      id="street"
                      value={state.street}
                      onChange={(e) => dispatch({ type: "SET_FIELD", field: "street", value: e.target.value })}
                      placeholder="مثال: شارع السلطان قابوس"
                      className={state.errors.street ? "border-destructive focus-visible:ring-destructive" : "bg-background"}
                    />
                    {state.errors.street ? <p className="text-sm text-destructive">{state.errors.street}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">المدينة</Label>
                    <Input
                      id="city"
                      value={state.city}
                      onChange={(e) => dispatch({ type: "SET_FIELD", field: "city", value: e.target.value })}
                      placeholder="مثال: مسقط"
                      className={state.errors.city ? "border-destructive focus-visible:ring-destructive" : "bg-background"}
                    />
                    {state.errors.city ? <p className="text-sm text-destructive">{state.errors.city}</p> : null}
                  </div>
                </div>

                <div className="mt-4 flex items-start gap-3">
                  <Checkbox
                    id="saveAddress"
                    checked={state.saveAddress}
                    onCheckedChange={(checked) => dispatch({ type: "SET_SAVE", value: Boolean(checked) })}
                  />
                  <Label htmlFor="saveAddress" className="text-sm leading-relaxed text-muted-foreground">
                    حفظ هذا العنوان في عناويني
                  </Label>
                </div>
              </div>

              {/* Payment */}
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  <h2 className="text-lg font-bold text-foreground">طريقة الدفع</h2>
                </div>

                <div className="mt-4">
                  <RadioGroup
                    value={state.paymentMethod}
                    onValueChange={(value) => dispatch({ type: "SET_PAYMENT", value: value as PaymentMethod })}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <PaymentOption value="visa" label="فيزا" icon={<CreditCard className="h-4 w-4 text-muted-foreground" />} />
                    <PaymentOption
                      value="mastercard"
                      label="ماستر كارد"
                      icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
                    />
                    <PaymentOption value="mada" label="مدى" icon={<Wallet className="h-4 w-4 text-muted-foreground" />} />
                    <PaymentOption value="applepay" label="Apple Pay" icon={<Wallet className="h-4 w-4 text-muted-foreground" />} />
                    <PaymentOption value="stcpay" label="STC Pay" icon={<Wallet className="h-4 w-4 text-muted-foreground" />} />
                  </RadioGroup>
                  {state.errors.paymentMethod ? (
                    <p className="mt-2 text-sm text-destructive">{state.errors.paymentMethod}</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Summary */}
            <aside className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-card p-4 shadow-soft">
                <h2 className="text-lg font-bold text-foreground">ملخص الفاتورة</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <Row label="المجموع الفرعي" value={formatMoney(subtotal)} />
                  <Row label="الخصم" value={formatMoney(discount)} />
                  <Row label="مصاريف التوصيل" value={formatMoney(delivery)} />
                  <Row label="الضريبة (5%)" value={formatMoney(tax)} />
                  <Separator className="my-2" />
                  <Row label="الإجمالي" value={formatMoney(total)} strong />
                </div>

                <Button
                  className="mt-5 w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
                  size="lg"
                  disabled={state.isSubmitting}
                  onClick={placeOrder}
                >
                  {state.isSubmitting ? "جاري إتمام الطلب..." : "إتمام الطلب"}
                </Button>

                <p className="mt-3 text-xs text-muted-foreground">
                  ملاحظة: هذه واجهة فقط (بدون دفع فعلي). سيتم ربط الدفع عبر API/بوابة دفع لاحقاً.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function PaymentOption({ value, label, icon }: { value: string; label: string; icon: React.ReactNode }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 hover:border-accent transition">
      <div className="flex items-center gap-3">
        <RadioGroupItem value={value} />
        <div className="text-sm font-semibold text-foreground">{label}</div>
      </div>
      {icon}
    </label>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className={cn("text-muted-foreground", strong && "text-foreground font-semibold")}>{label}</span>
      <span className={cn(strong ? "text-foreground font-extrabold" : "text-foreground")}>{value}</span>
    </div>
  );
}

