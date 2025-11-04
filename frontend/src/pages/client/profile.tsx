"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";

const navLinks = [
  { href: "/client", label: "Servicios" },
  { href: "/client/appointment", label: "Mis reservas" },
  { href: "/client/profile", label: "Mi perfil" },
];

const infoItems = [
  {
    label: "Membresía",
    value: "Cliente BellezaTotal",
  },
  {
    label: "Teléfono",
    value: "+57 300 000 0000",
  },
  {
    label: "Preferencias",
    value: "Coloración, spa facial, manicure spa",
  },
];

export default function ClientProfilePage() {
  const user = useAuthStore((state) => state.user);

  const initials = useMemo(() => {
    const source = user?.firstname ?? user?.email ?? "";
    return source
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Recomendaciones
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Actualiza tus datos de contacto para recibir notificaciones.</li>
          <li>Comparte tus preferencias para personalizar recomendaciones.</li>
          <li>
            Configura recordatorios automáticos según tu frecuencia ideal.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Historial</h3>
        <p className="mt-2 text-sm text-text/65">
          Próximamente podrás descargar tu historial de servicios con notas y
          recomendaciones del equipo BellezaTotal.
        </p>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Mi perfil"
      description="Gestiona tus datos de contacto, preferencias y roles asociados a tu cuenta BellezaTotal."
      navLinks={navLinks}
      sidebar={sidebar}
    >
      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {initials || "BT"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary">
                {user?.firstname ?? user?.email ?? "Cliente BellezaTotal"}
              </h2>
              <p className="text-sm text-text/70">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white">
              Editar perfil
            </button>
            <button className="rounded-full border border-neutral/20 px-4 py-2 text-sm font-medium text-text/70 transition hover:border-primary/40 hover:text-primary">
              Configurar preferencias
            </button>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-neutral/10 bg-secondary/40 p-4"
            >
              <dt className="text-xs uppercase tracking-[0.2em] text-primary/80">
                {item.label}
              </dt>
              <dd className="mt-2 text-sm text-text/75">{item.value}</dd>
            </div>
          ))}

          <div className="rounded-2xl border border-neutral/10 bg-white p-4 shadow-sm sm:col-span-2">
            <dt className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Roles asociados
            </dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {(Array.isArray(user?.roles) ? user?.roles : [user?.roles ?? "client"])
                .filter(Boolean)
                .map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary"
                  >
                    {role}
                  </span>
                ))}
            </dd>
          </div>
        </dl>
      </section>
    </DashboardLayout>
  );
}
