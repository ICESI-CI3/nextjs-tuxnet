import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface NavLink {
  label: string;
  href: string;
  badge?: string;
}

interface DashboardLayoutProps {
  title: string;
  description?: string;
  navLinks: NavLink[];
  actions?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardLayout = ({
  title,
  description,
  navLinks,
  actions,
  sidebar,
  children,
}: DashboardLayoutProps) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const activePath = useMemo(() => router.pathname, [router.pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-white to-secondary/40">
      <div className="border-b border-white/60 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              BT
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-primary">
                BellezaTotal
              </span>
              <span className="text-xs text-text/60">Panel de control</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 rounded-full border border-primary/10 bg-white px-2 py-1 shadow-sm shadow-primary/10 sm:flex">
            {navLinks.map((link) => {
              const isActive =
                activePath === link.href ||
                activePath.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm transition ${
                    isActive
                      ? "bg-primary text-white shadow-primary/20"
                      : "text-text/65 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  {link.label}
                  {link.badge && (
                    <span className="ml-2 inline-flex items-center rounded-full bg-white/20 px-2 text-[11px] font-medium">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-primary">
                  {user.firstname ?? user.email}
                </p>
                <p className="text-xs uppercase tracking-[0.2em] text-text/50">
                  {Array.isArray(user.roles) ? user.roles[0] : user.roles}
                </p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <nav className="mx-auto flex w-full max-w-6xl gap-2 px-6 pb-4 sm:hidden">
          {navLinks.map((link) => {
            const isActive =
              activePath === link.href ||
              activePath.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex-1 rounded-full px-4 py-2 text-center text-xs font-medium transition ${
                  isActive
                    ? "bg-primary text-white shadow-primary/20"
                    : "border border-primary/20 text-primary hover:bg-primary/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:px-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-primary">{title}</h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-text/70">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-3">{actions}</div>}
        </header>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">{children}</div>
          <aside className="space-y-4">
            {sidebar ?? (
              <>
                <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
                  <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                    Recordatorios
                  </h2>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
                    <li>Revisa la agenda del día y confirma nuevas reservas.</li>
                    <li>Actualiza la disponibilidad de tus especialistas.</li>
                    <li>Registra notas importantes tras cada cita.</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold text-primary">Soporte</h3>
                  <p className="mt-2 text-sm text-text/65">
                    ¿Necesitas ayuda? Escríbenos a{" "}
                    <a
                      href="mailto:soporte@bellezatotal.com"
                      className="font-medium text-primary underline-offset-2 hover:underline"
                    >
                      soporte@bellezatotal.com
                    </a>
                  </p>
                </div>
              </>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
};
