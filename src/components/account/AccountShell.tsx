import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function AccountShell({ title, subtitle, children }: Props) {
  return (
    <main className="overflow-hidden">
      <Header />

      <section className="pt-24 pb-12 bg-background">
        <div className="container-rtl">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-foreground">{title}</h1>
            {subtitle ? <p className="mt-2 text-muted-foreground">{subtitle}</p> : null}
          </div>
          {children}
        </div>
      </section>

      <Footer />
    </main>
  );
}

