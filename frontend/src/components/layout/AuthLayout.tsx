import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const AuthLayout = ({
  title,
  subtitle,
  children,
  footer,
}: AuthLayoutProps) => {
  return (
    <div className="relative flex min-h-screen flex-col lg:flex-row">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-white to-secondary/10" />

      <aside className="hidden h-full w-full flex-1 flex-col justify-between bg-primary/95 px-12 py-14 text-white shadow-2xl lg:flex">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 text-xl">
            <span className="font-semibold tracking-wide">BellezaTotal</span>
          </Link>
          <p className="mt-8 max-w-sm text-base text-white/80">
            Agenda servicios de belleza, administra especialistas y mantén el
            control de tu salón desde una sola plataforma.
          </p>
        </div>
        <div className="relative">
          <Image
            src="/logo.jpg"
            alt="BellezaTotal"
            width={220}
            height={220}
            className="mx-auto rounded-full border-4 border-white/30 shadow-lg shadow-black/30"
          />
          <p className="mt-6 text-center text-sm text-white/70">
            Facultad Barberi · Computación en Internet III
          </p>
        </div>
      </aside>

      <main className="flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <header className="mb-10 space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold text-primary">{title}</h1>
            <p className="text-base text-text/70">{subtitle}</p>
          </header>

          <section className="rounded-2xl bg-white p-8 shadow-xl shadow-primary/10 ring-1 ring-neutral/10">
            {children}
          </section>

          {footer && <div className="mt-6 text-center lg:text-left">{footer}</div>}
        </div>
      </main>
    </div>
  );
};
