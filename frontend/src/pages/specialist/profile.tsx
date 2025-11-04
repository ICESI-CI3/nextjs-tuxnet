"use client";

import { useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuthStore } from "@/store/useAuthStore";

const navLinks = [
  { href: "/specialist", label: "Agenda" },
  { href: "/specialist/appointment", label: "Citas" },
  { href: "/specialist/profile", label: "Perfil" },
];

const specialties = [
  "Coloracion avanzada",
  "Tratamientos capilares",
  "Peinados para eventos especiales",
];

const achievements = [
  "Top 10 especialistas BellezaTotal 2024",
  "Capacitacion en tendencias 2025",
  "Promedio de satisfaccion 4.8/5",
];

export default function SpecialistProfilePage() {
  const user = useAuthStore((state) => state.user);

  const initials = useMemo(() => {
    const text = user?.firstname ?? user?.email ?? "";
    return text
      .split(" ")
      .map((segment) => segment.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Especialidades
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          {specialties.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Reconocimientos</h3>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-text/70">
          {achievements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Perfil de especialista"
      description="Consulta tu informacion profesional, metricas y logros dentro del salon BellezaTotal."
      navLinks={navLinks}
      sidebar={sidebar}
    >
      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {initials || "ST"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-primary">
                {user?.firstname ?? "Especialista BellezaTotal"}
              </h2>
              <p className="text-sm text-text/70">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white">
              Actualizar disponibilidad
            </button>
            <button className="rounded-full border border-neutral/20 px-4 py-2 text-sm font-medium text-text/70 transition hover:border-primary/40 hover:text-primary">
              Compartir portafolio
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral/10 bg-secondary/40 p-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Experiencia
            </h3>
            <p className="mt-2 text-sm text-text/70">
              6 anos en peluqueria profesional con enfasis en colorimetria y
              tratamientos reparadores.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral/10 bg-secondary/40 p-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Horario preferido
            </h3>
            <p className="mt-2 text-sm text-text/70">
              Martes a sabado - 9:00 a.m a 5:00 p.m
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-neutral/10 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-primary">Notas internas</h3>
          <p className="mt-2 text-sm text-text/65">
            Registra aprendizajes, tendencias y preferencias de tus clientes
            para ofrecer experiencias memorables en cada visita.
          </p>
          <button className="mt-4 rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white">
            Agregar nota destacada
          </button>
        </div>
      </section>
    </DashboardLayout>
  );
}
