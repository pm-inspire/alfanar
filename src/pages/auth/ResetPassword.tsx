import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/components/auth/AuthShell";
import PasswordRecoveryWizard from "@/components/auth/PasswordRecoveryWizard";

export default function ResetPassword() {
  const navigate = useNavigate();

  return (
    <AuthShell
      title="إعادة تعيين كلمة المرور"
      subtitle="هذه واجهة placeholder يمكن ربطها لاحقاً برابط/توكن من النظام."
      footer={
        <Link to="/auth/login" className="text-accent hover:underline">
          العودة لتسجيل الدخول
        </Link>
      }
    >
      <PasswordRecoveryWizard
        initialStep={3}
        onDone={() => {
          // TODO(auth): after successful reset from token-based flow.
          navigate("/auth/login");
        }}
      />
    </AuthShell>
  );
}

