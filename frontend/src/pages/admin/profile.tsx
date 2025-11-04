"use client";

import { useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";

const navLinks = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/appointments", label: "Citas" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/profile", label: "Perfil" },
];

const responsibilities = [
  "Supervisar agenda general del salón.",
  "Asignar roles y permisos al equipo.",
  "Monitorear indicadores de ocupación.",
  "Gestionar promociones y comunicaciones.",
];

export default function AdminProfilePage() {
  const user = useAuthStore((state) => state.user);

  const initials = useMemo(() => {
    const base = user?.firstname ?? user?.email ?? "";
    return base
      .split(" ")
      .map((piece) => piece.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Responsabilidades
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          {responsibilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Documentación</h3>
        <p className="mt-2 text-sm text-text/65">
          Encuentra guías y protocolos para estandarizar procesos internos del
          salón BellezaTotal.
        </p>
        <Link
          href="#"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Ver manual operativo
        </Link>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Perfil administrativo"
      description="Información del responsable del salón, incluyendo roles activos y accesos especiales."
      navLinks={navLinks}
      sidebar={sidebar}
    >
      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {initials || "AD"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary">
                {user?.firstname ?? user?.email ?? "Administrador BellezaTotal"}
              </h2>
              <p className="text-sm text-text/70">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white">
              Actualizar datos
            </button>
            <button className="rounded-full border border-neutral/20 px-4 py-2 text-sm font-medium text-text/70 transition hover:border-primary/40 hover:text-primary">
              Configurar seguridad
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral/10 bg-secondary/40 p-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Roles activos
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Array.isArray(user?.roles) ? user?.roles : [user?.roles ?? "admin"])
                .filter(Boolean)
                .map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary"
                  >
                    {role}
                  </span>
                ))}
            </div>
          </div>
          <div className="rounded-2xl border border-neutral/10 bg-secondary/40 p-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Contacto directo
            </h3>
            <p className="mt-2 text-sm text-text/70">
              Teléfono: +57 318 555 4455
              <br />
              Horario: Lunes a sábado · 9:00 a.m - 6:00 p.m.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral/10 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-primary">Notas internas</h3>
          <p className="mt-2 text-sm text-text/65">
            Documenta acuerdos, estrategias de temporada y KPIs clave para
            mantener a tu equipo alineado.
          </p>
          <button className="mt-4 rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white">
            Agregar nota
          </button>
        </div>
      </section>
    </DashboardLayout>
  );
}
