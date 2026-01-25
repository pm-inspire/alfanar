import { useMemo, useReducer } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { isValidMobile, normalizePhone } from "@/lib/phone";

type Step = 1 | 2 | 3;

type Props = {
  initialStep?: Step;
  onDone?: () => void;
};

type State = {
  step: Step;
  phone: string;
  otp: string;
  newPassword: string;
  confirmNewPassword: string;
  fieldErrors: Record<string, string | undefined>;
  banner: { type: "success" | "error"; text: string } | null;
  isSubmitting: boolean;
};

type Action =
  | { type: "SET_STEP"; step: Step }
  | { type: "SET_FIELD"; field: keyof Omit<State, "fieldErrors" | "banner" | "isSubmitting" | "step">; value: string }
  | { type: "SET_ERROR"; field: string; message?: string }
  | { type: "SET_BANNER"; banner?: State["banner"] }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "RESET_ERRORS" };

function makeInitialState(step: Step): State {
  return {
    step,
    phone: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
    fieldErrors: {},
    banner: null,
    isSubmitting: false,
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, fieldErrors: {}, banner: null };
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        fieldErrors: { ...state.fieldErrors, [String(action.field)]: undefined },
        banner: null,
      };
    case "SET_ERROR":
      return { ...state, fieldErrors: { ...state.fieldErrors, [action.field]: action.message } };
    case "SET_BANNER":
      return { ...state, banner: action.banner ?? null };
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
        <span className="font-semibold text-foreground">استعادة كلمة المرور</span>
        <span className="text-muted-foreground">خطوة {step}/3</span>
      </div>
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-gold transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export default function PasswordRecoveryWizard({ initialStep = 1, onDone }: Props) {
  const [state, dispatch] = useReducer(reducer, makeInitialState(initialStep));

  const canContinueStep1 = useMemo(() => isValidMobile(state.phone) && !state.isSubmitting, [state.phone, state.isSubmitting]);
  const canContinueStep2 = useMemo(() => state.otp.replace(/\D/g, "").length >= 4 && !state.isSubmitting, [state.otp, state.isSubmitting]);

  const validateStep1 = () => {
    dispatch({ type: "RESET_ERRORS" });
    const phone = normalizePhone(state.phone);
    if (!phone) {
      dispatch({ type: "SET_ERROR", field: "phone", message: "رقم الجوال مطلوب" });
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "أدخل رقم الجوال للمتابعة" } });
      return false;
    }
    if (!isValidMobile(phone)) {
      dispatch({ type: "SET_ERROR", field: "phone", message: "أدخل رقم جوال صحيح" });
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "رقم الجوال غير صحيح" } });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    dispatch({ type: "RESET_ERRORS" });
    if (state.otp.replace(/\D/g, "").length < 4) {
      dispatch({ type: "SET_ERROR", field: "otp", message: "أدخل كود التحقق" });
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "كود التحقق مطلوب" } });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    dispatch({ type: "RESET_ERRORS" });
    let ok = true;
    if (!state.newPassword.trim()) {
      dispatch({ type: "SET_ERROR", field: "newPassword", message: "كلمة المرور الجديدة مطلوبة" });
      ok = false;
    } else if (state.newPassword.trim().length < 6) {
      dispatch({ type: "SET_ERROR", field: "newPassword", message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      ok = false;
    }
    if (!state.confirmNewPassword.trim()) {
      dispatch({ type: "SET_ERROR", field: "confirmNewPassword", message: "تأكيد كلمة المرور مطلوب" });
      ok = false;
    } else if (state.newPassword.trim() !== state.confirmNewPassword.trim()) {
      dispatch({ type: "SET_ERROR", field: "confirmNewPassword", message: "كلمتا المرور غير متطابقتين" });
      ok = false;
    }
    if (!ok) dispatch({ type: "SET_BANNER", banner: { type: "error", text: "تحقق من الحقول المطلوبة ثم أعد المحاولة" } });
    return ok;
  };

  const sendOtp = async () => {
    if (!validateStep1()) return;
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call forgot-password/send-otp API endpoint.
      await new Promise((r) => setTimeout(r, 700));
      dispatch({ type: "SET_BANNER", banner: { type: "success", text: "تم إرسال كود التحقق إلى رقم الجوال" } });
      dispatch({ type: "SET_STEP", step: 2 });
    } catch {
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "تعذر إرسال الكود حالياً" } });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const confirmOtp = async () => {
    if (!validateStep2()) return;
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call forgot-password/verify-otp API endpoint.
      await new Promise((r) => setTimeout(r, 700));
      dispatch({ type: "SET_BANNER", banner: { type: "success", text: "تم تأكيد الكود" } });
      dispatch({ type: "SET_STEP", step: 3 });
    } catch {
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "الكود غير صحيح" } });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const resendOtp = async () => {
    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call forgot-password/resend-otp API endpoint.
      await new Promise((r) => setTimeout(r, 600));
      dispatch({ type: "SET_BANNER", banner: { type: "success", text: "تمت إعادة إرسال الكود" } });
    } catch {
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "تعذر إعادة الإرسال حالياً" } });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  const saveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;

    dispatch({ type: "SET_SUBMITTING", value: true });
    try {
      // TODO(auth): call reset-password API endpoint with new password.
      await new Promise((r) => setTimeout(r, 800));
      dispatch({ type: "SET_BANNER", banner: { type: "success", text: "تم حفظ كلمة المرور بنجاح" } });
      onDone?.();
    } catch {
      dispatch({ type: "SET_BANNER", banner: { type: "error", text: "تعذر حفظ كلمة المرور حالياً" } });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  return (
    <div className="space-y-5">
      <StepHeader step={state.step} />

      {state.banner ? (
        <div
          className={[
            "rounded-lg border px-4 py-3 text-sm",
            state.banner.type === "success" ? "border-accent/30 bg-accent/10 text-foreground" : "border-destructive/30 bg-destructive/10 text-destructive",
          ].join(" ")}
        >
          {state.banner.text}
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

          <Button
            type="button"
            variant="outline"
            disabled={state.isSubmitting}
            onClick={resendOtp}
            className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground"
          >
            <RotateCcw className="h-4 w-4 ml-2" />
            إعادة إرسال الكود
          </Button>
        </div>
      ) : null}

      {state.step === 3 ? (
        <form onSubmit={saveNewPassword} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="••••••••"
              value={state.newPassword}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "newPassword", value: e.target.value })}
              className={state.fieldErrors.newPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state.fieldErrors.newPassword ? (
              <p className="text-sm text-destructive">{state.fieldErrors.newPassword}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmNewPassword">تأكيد كلمة المرور الجديدة</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              placeholder="••••••••"
              value={state.confirmNewPassword}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "confirmNewPassword", value: e.target.value })}
              className={state.fieldErrors.confirmNewPassword ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {state.fieldErrors.confirmNewPassword ? (
              <p className="text-sm text-destructive">{state.fieldErrors.confirmNewPassword}</p>
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
                جاري الحفظ...
              </>
            ) : (
              "حفظ كلمة المرور"
            )}
          </Button>
        </form>
      ) : null}
    </div>
  );
}

