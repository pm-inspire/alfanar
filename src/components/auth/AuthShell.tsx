import { ReactNode } from "react";
import { Link } from "react-router-dom";
import alfanarLogo from "@/assets/alfanar-logo.svg";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-gradient-cream">
      <div className="container-rtl flex min-h-screen items-center justify-center py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={alfanarLogo} alt="الفَنار" className="h-12 w-auto" />
            </Link>
            <h1 className="mt-4 text-2xl font-extrabold text-foreground">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
            {children}
          </div>

          {footer ? <div className="mt-4 text-center text-sm text-muted-foreground">{footer}</div> : null}
        </div>
      </div>
    </main>
  );
}

