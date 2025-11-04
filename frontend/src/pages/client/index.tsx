"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { serviceService } from "@/services/serviceService";
import { ServiceCard } from "@/components/ServiceCard";
import type { Service } from "@/types/service";

const navLinks = [
  { href: "/client", label: "Servicios" },
  { href: "/client/appointment", label: "Mis reservas" },
  { href: "/client/profile", label: "Mi perfil" },
];

export default function ClientHome() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data);
        setError(null);
      } catch (error) {
        console.error("Error cargando servicios:", error);
        setError(
          error instanceof Error
            ? error.message
            : "No pudimos cargar los servicios disponibles.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  const featured = useMemo(() => services.slice(0, 3), [services]);

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Próxima cita
        </h2>
        <p className="mt-3 text-sm text-text/70">
          Programa tu próxima experiencia con nuestros estilistas. Consulta tu
          agenda para mantener tus rutinas al día.
        </p>
        <Link
          href="/client/appointment"
          className="mt-4 inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-medium text-white transition hover:bg-primary/90"
        >
          Gestionar reservas
        </Link>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Beneficios</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Historial de servicios y especialistas preferidos.</li>
          <li>Recordatorios automáticos antes de tus citas.</li>
          <li>Ofertas personalizadas según tus gustos.</li>
        </ul>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Descubre nuestros servicios"
      description="Elige entre los servicios destacados de BellezaTotal y reserva en el horario que mejor se adapte a tu agenda."
      navLinks={navLinks}
      actions={
        <Link
          href="/client/appointment"
          className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-md shadow-primary/30 transition hover:bg-primary/90"
        >
          Reservar ahora
        </Link>
      }
      sidebar={sidebar}
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-40 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
              />
            ))
          : services.length > 0
          ? services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))
          : (
            <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-center text-text/60">
              No encontramos servicios disponibles por el momento. Vuelve más
              tarde o contáctanos para recibir asesoría personalizada.
            </div>
            )}
      </section>

      {featured.length > 0 && (
        <section className="mt-6 rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-primary">
            Recomendados para ti
          </h2>
          <p className="mt-1 text-sm text-text/70">
            Basado en los servicios más reservados por nuestra comunidad.
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={`featured-${service.id}`} service={service} />
            ))}
          </div>
        </section>
      )}
    </DashboardLayout>
  );
}
