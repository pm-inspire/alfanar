import { useMemo, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, RotateCcw } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { isValidMobile, normalizePhone } from "@/lib/phone";
import { setDemoUser } from "@/lib/demoAuth";

type Step = 1 | 2 | 3;

type EditableField = "phone" | "otp" | "fullName" | "email" | "password" | "confirmPassword" | "acceptTerms";

type EditableFieldValue = {
  phone: string;
  otp: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}[EditableField];

type State = {
  step: Step;
  phone: string;
  otp: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  fieldErrors: Record<string, string | undefined>;
  formMessage: { type: "success" | "error"; text: string } | null;
  isSubmitting: boolean;
};

type Action =
  | { type: "SET_STEP"; step: Step }
  | { type: "SET_FIELD"; field: EditableField; value: EditableFieldValue }
  | { type: "SET_ERROR"; field: string; message?: string }
  | { type: "SET_MESSAGE"; message?: State["formMessage"] }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "RESET_ERRORS" };

const initialState: State = {
  step: 1,
  phone: "",
  otp: "",
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
  fieldErrors: {},
  formMessage: null,
  isSubmitting: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, fieldErrors: {}, formMessage: null };
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        fieldErrors: { ...state.fieldErrors, [String(action.field)]: undefined },
        formMessage: null,
      } as State;
    case "SET_ERROR":
      return { ...state, fieldErrors: { ...state.fieldErrors, [action.field]: action.message } };
    case "SET_MESSAGE":
      return { ...state, formMessage: action.message ?? null };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value };
    case "RESET_ERRORS":
      return { ...state, fieldErrors: {} };
    default:
      return state;
  }
}

function StepHeader({ step }: { step: Step }) {
  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">خطوة {step}/3</span>
        <span className="text-muted-foreground">
          {step === 1 ? "رقم الجوال" : step === 2 ? "كود التحقق" : "استكمال البيانات"}
        </span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-gold transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function Register() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const canContinueStep1 = useMemo(() => isValidMobile(state.phone) && !state.isSubmitting, [state.phone, state.isSubmitting]);
  const canContinueStep2 = useMemo(() => state.otp.replace(/\D/g, "").length >= 4 && !state.isSubmitting, [state.otp, state.isSubmitting]);

  const validateStep1 = () => {
    dispatch({ type: "RESET_ERRORS" });
    const phone = normalizePhone(state.phone);
    if (!phone) {
      dispatch({ type: "SET_ERROR", field: "phone", message: "رقم الجوال مطلوب" });
      dispatch({ type: "SET_MESSAGE", message: { type: "error", text: "أدخل رقم الجوال للمتابعة" } });
      return false;
    }
    if (!isValidMobile(phone)) {
      dispatch({ type: "SET_ERROR", field: "phone", message: "أدخل رقم جوال صحيح" });
      dispatch({ type: "SET_MESSAGE", message: { type: "error", text: "رقم الجوال غير صحيح" } });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    dispatch({ type: "RESET_ERRORS" });
    const digits = state.otp.replace(/\D/g, "");
    if (digits.length < 4) {
      dispatch({ type: "SET_ERROR", field: "otp", message: "أدخل كود التحقق" });
      dispatch({ type: "SET_MESSAGE", message: { type: "error", text: "كود التحقق مطلوب" } });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    dispatch({ type: "RESET_ERRORS" });

    let ok = true;
    if (!state.fullName.trim()) {
      dispatch({ type: "SET_ERROR", field: "fullName", message: "الاسم الكامل مطلوب" });
      ok = false;
    }
    if (!state.email.trim()) {
      dispatch({ type: "SET_ERROR", field: "email", message: "البريد الإلكتروني مطلوب" });
      ok = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email.trim())) {
      dispatch({ type: "SET_ERROR", field: "email", message: "البريد الإلكتروني غير صحيح" });
      ok = false;
    }
    if (!state.password.trim()) {
      dispatch({ type: "SET_ERROR", field: "password", message: "كلمة المرور مطلوبة" });
      ok = false;
    } else if (state.password.trim().length < 6) {
      dispatch({ type: "SET_ERROR", field: "password", message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      ok = false;
    }
    if (!state.confirmPassword.trim()) {
      dispatch({ type: "SET_ERROR", field: "confirmPassword", message: "تأكيد كلمة المرور مطلوب" });
      ok = false;
    } else if (state.password.trim() !== state.confirmPassword.trim()) {
      dispatch({ type: "SET_ERROR", field: "confirmPassword", message: "كلمتا المرور غير متطابقتين" });
      ok = false;
    }
    if (!state.acceptTerms) {
      dispatch({
        type: "SET_ERROR",
        field: "acceptTerms",
        message: "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية",
      });
      ok = false;
    }

    if (!ok) dispatch({ type: "SET_MESSAGE", message: { type: "error", text: "تحقق من الحقول المطلوبة ثم أعد المحاولة" } });
    return ok;
  };

  const sendOtp = async () => {
    if (!validateStep1()) return;
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call register/send-otp API endpoint.
      await new Promise((r) => setTimeout(r, 700));
      dispatch({ type: "SET_MESSAGE", message: { type: "success", text: "تم إرسال كود التحقق إلى رقم الجوال" } });
      dispatch({ type: "SET_STEP", step: 2 });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const confirmOtp = async () => {
    if (!validateStep2()) return;
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call verify-otp API endpoint.
      await new Promise((r) => setTimeout(r, 700));
      dispatch({ type: "SET_MESSAGE", message: { type: "success", text: "تم تأكيد الكود بنجاح" } });
      dispatch({ type: "SET_STEP", step: 3 });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const resendOtp = async () => {
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call resend-otp API endpoint.
      await new Promise((r) => setTimeout(r, 600));
      dispatch({ type: "SET_MESSAGE", message: { type: "success", text: "تمت إعادة إرسال الكود" } });
    } catch {
      dispatch({ type: "SET_MESSAGE", message: { type: "error", text: "تعذر إعادة الإرسال حالياً" } });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call register/complete-profile API endpoint, then store real session/token.
      await new Promise((r) => setTimeout(r, 900));
      const firstName = state.fullName.trim().split(/\s+/)[0] || "مستخدم";
      setDemoUser({ firstName, fullName: state.fullName.trim(), phone: normalizePhone(state.phone) });
      navigate("/shop");
    } catch {
      dispatch({ type: "SET_MESSAGE", message: { type: "error", text: "تعذر إنشاء الحساب حالياً، حاول مرة أخرى." } });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  return (
    <AuthShell
      title="تسجيل جديد"
      subtitle="أنشئ حساباً جديداً بخطوات بسيطة لإتمام الطلبات بسهولة."
      footer={
        <>
          لديك حساب بالفعل؟{" "}
          <Link to="/auth/login" className="text-accent hover:underline">
            تسجيل الدخول
          </Link>
        </>
      }
    >
      <StepHeader step={state.step} />

      {state.formMessage ? (
        <div
          className={[
            "mb-4 rounded-lg border px-4 py-3 text-sm",
            state.formMessage.type === "success"
              ? "border-accent/30 bg-accent/10 text-foreground"
              : "border-destructive/30 bg-destructive/10 text-destructive",
          ].join(" ")}
        >
          {state.formMessage.text}
        </div>
      ) : null}

      {state.step === 1 ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="phone">رقم الجوال</Label>
            <Input
              id="phone"
              type="tel"
              inputMode="tel"
              placeholder="+968 9XXXXXXX"
              value={state.phone}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "phone", value: e.target.value })}
              className={state.fieldErrors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state.fieldErrors.phone ? <p className="text-sm text-destructive">{state.fieldErrors.phone}</p> : null}
          </div>

          <Button
            type="button"
            disabled={!canContinueStep1}
            onClick={sendOtp}
            className="w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
            size="lg"
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              "إرسال كود التحقق"
            )}
          </Button>
        </div>
      ) : null}

      {state.step === 2 ? (
        <div className="space-y-5">
          <div className="space-y-2">
            <Label>كود التحقق</Label>
            <div className="flex justify-center">
              <InputOTP
                value={state.otp}
                onChange={(value) => dispatch({ type: "SET_FIELD", field: "otp", value })}
                maxLength={6}
                inputMode="numeric"
              >
                <InputOTPGroup dir="ltr" className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {state.fieldErrors.otp ? <p className="text-sm text-destructive">{state.fieldErrors.otp}</p> : null}
            <p className="text-xs text-muted-foreground text-center">أدخل الكود المرسل إلى رقم جوالك.</p>
          </div>

          <Button
            type="button"
            disabled={!canContinueStep2}
            onClick={confirmOtp}
            className="w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
            size="lg"
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جارٍ التأكيد...
              </>
            ) : (
              "تأكيد الكود"
            )}
          </Button>

          <div className="flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={state.isSubmitting}
              onClick={resendOtp}
              className="flex-1 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
            >
              <RotateCcw className="h-4 w-4 ml-2" />
              إعادة إرسال الكود
            </Button>
            <Button
              type="button"
              variant="ghost"
              disabled={state.isSubmitting}
              onClick={() => dispatch({ type: "SET_STEP", step: 1 })}
              className="flex-1 text-muted-foreground hover:text-foreground"
            >
              تعديل رقم الجوال
            </Button>
          </div>
        </div>
      ) : null}

      {state.step === 3 ? (
        <form onSubmit={submitRegister} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input
              id="fullName"
              placeholder="مثال: أحمد محمد"
              value={state.fullName}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "fullName", value: e.target.value })}
              className={state.fieldErrors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state.fieldErrors.fullName ? <p className="text-sm text-destructive">{state.fieldErrors.fullName}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={state.email}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "email", value: e.target.value })}
              className={state.fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state.fieldErrors.email ? <p className="text-sm text-destructive">{state.fieldErrors.email}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={state.password}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })}
              className={state.fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state.fieldErrors.password ? <p className="text-sm text-destructive">{state.fieldErrors.password}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={state.confirmPassword}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "confirmPassword", value: e.target.value })}
              className={state.fieldErrors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state.fieldErrors.confirmPassword ? (
              <p className="text-sm text-destructive">{state.fieldErrors.confirmPassword}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="acceptTerms"
                checked={state.acceptTerms}
                onCheckedChange={(checked) =>
                  dispatch({ type: "SET_FIELD", field: "acceptTerms", value: Boolean(checked) })
                }
              />
              <Label htmlFor="acceptTerms" className="text-sm leading-relaxed text-muted-foreground">
                بالضغط على تسجيل فإنك توافق على{" "}
                <Link to="#" className="text-accent hover:underline">
                  سياسة الخصوصية
                </Link>{" "}
                و{" "}
                <Link to="#" className="text-accent hover:underline">
                  الشروط والأحكام
                </Link>
                .
              </Label>
            </div>
            {state.fieldErrors.acceptTerms ? (
              <p className="text-sm text-destructive">{state.fieldErrors.acceptTerms}</p>
            ) : null}
          </div>

          <Button
            type="submit"
            disabled={state.isSubmitting}
            className="w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
            size="lg"
          >
            {state.isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                جاري إنشاء الحساب...
              </>
            ) : (
              "تسجيل"
            )}
          </Button>
        </form>
      ) : null}
    </AuthShell>
  );
}

