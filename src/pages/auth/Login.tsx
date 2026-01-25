import { useMemo, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthShell from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isValidMobile, normalizePhone } from "@/lib/phone";
import { setDemoUser } from "@/lib/demoAuth";

type State = {
  phone: string;
  password: string;
  showPassword: boolean;
  fieldErrors: Partial<Record<"phone" | "password", string>>;
  formError: string | null;
  isSubmitting: boolean;
};

type Action =
  | { type: "SET_FIELD"; field: "phone" | "password"; value: string }
  | { type: "TOGGLE_PASSWORD" }
  | { type: "SET_FIELD_ERROR"; field: "phone" | "password"; message?: string }
  | { type: "SET_FORM_ERROR"; message?: string }
  | { type: "SET_SUBMITTING"; value: boolean }
  | { type: "RESET_ERRORS" };

const initialState: State = {
  phone: "",
  password: "",
  showPassword: false,
  fieldErrors: {},
  formError: null,
  isSubmitting: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        [action.field]: action.value,
        fieldErrors: { ...state.fieldErrors, [action.field]: undefined },
        formError: null,
      };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "SET_FIELD_ERROR":
      return { ...state, fieldErrors: { ...state.fieldErrors, [action.field]: action.message } };
    case "SET_FORM_ERROR":
      return { ...state, formError: action.message ?? null };
    case "SET_SUBMITTING":
      return { ...state, isSubmitting: action.value };
    case "RESET_ERRORS":
      return { ...state, fieldErrors: {}, formError: null };
    default:
      return state;
  }
}

export default function Login() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const canSubmit = useMemo(() => {
    return state.phone.trim().length > 0 && state.password.trim().length > 0 && !state.isSubmitting;
  }, [state.phone, state.password, state.isSubmitting]);

  const validate = () => {
    dispatch({ type: "RESET_ERRORS" });

    const phone = normalizePhone(state.phone);
    if (!phone) dispatch({ type: "SET_FIELD_ERROR", field: "phone", message: "رقم الجوال مطلوب" });
    else if (!isValidMobile(phone))
      dispatch({ type: "SET_FIELD_ERROR", field: "phone", message: "أدخل رقم جوال صحيح (مثال: +968 9XXXXXXX)" });

    if (!state.password.trim())
      dispatch({ type: "SET_FIELD_ERROR", field: "password", message: "كلمة المرور مطلوبة" });
    else if (state.password.trim().length < 6)
      dispatch({ type: "SET_FIELD_ERROR", field: "password", message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });

    const ok = isValidMobile(phone) && state.password.trim().length >= 6;
    if (!ok) dispatch({ type: "SET_FORM_ERROR", message: "تحقق من الحقول المطلوبة ثم أعد المحاولة" });
    return ok;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch({ type: "SET_SUBMITTING", value: true });
    dispatch({ type: "SET_FORM_ERROR" });

    try {
      // TODO(auth): call login API endpoint (phone + password), then store real session/token.
      await new Promise((r) => setTimeout(r, 800));

      setDemoUser({ firstName: "أحمد", phone: normalizePhone(state.phone) });
      navigate("/shop");
    } catch {
      dispatch({ type: "SET_FORM_ERROR", message: "تعذر تسجيل الدخول حالياً، حاول مرة أخرى." });
    } finally {
      dispatch({ type: "SET_SUBMITTING", value: false });
    }
  };

  return (
    <AuthShell title="تسجيل الدخول" subtitle="أهلاً بك مجدداً — سجّل دخولك لمتابعة التسوق.">
      <form onSubmit={onSubmit} className="space-y-5">
        {state.formError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.formError}
          </div>
        ) : null}

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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">كلمة المرور</Label>
            <Link to="/auth/forgot-password" className="text-sm text-accent hover:underline">
              نسيت كلمة المرور؟
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={state.showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={state.password}
              onChange={(e) => dispatch({ type: "SET_FIELD", field: "password", value: e.target.value })}
              className={state.fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            <button
              type="button"
              onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={state.showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
            >
              {state.showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {state.fieldErrors.password ? (
            <p className="text-sm text-destructive">{state.fieldErrors.password}</p>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-gradient-gold text-accent-foreground font-bold hover:opacity-90 shadow-gold"
          size="lg"
        >
          {state.isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              جاري تسجيل الدخول...
            </>
          ) : (
            "تسجيل الدخول"
          )}
        </Button>

        <div className="text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link to="/auth/register" className="text-accent hover:underline">
            تسجيل جديد
          </Link>
        </div>
      </form>
    </AuthShell>
  );
}

