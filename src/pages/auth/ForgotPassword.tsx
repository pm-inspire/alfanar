import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/components/auth/AuthShell";
import PasswordRecoveryWizard from "@/components/auth/PasswordRecoveryWizard";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <AuthShell
      title="استعادة كلمة المرور"
      subtitle="أدخل رقم جوالك لاستلام كود التحقق ثم قم بتعيين كلمة مرور جديدة."
      footer={
        <Link to="/auth/login" className="text-accent hover:underline">
          العودة لتسجيل الدخول
        </Link>
      }
    >
      <PasswordRecoveryWizard
        initialStep={1}
        onDone={() => {
          // TODO(auth): optionally navigate to login after successful reset.
          navigate("/auth/login");
        }}
      />

      <div className="mt-4">
        <Button
          type="button"
          variant="ghost"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => navigate("/auth/reset-password")}
        >
          لدي رابط إعادة تعيين؟ (واجهة Reset Password)
        </Button>
      </div>
    </AuthShell>
  );
}

