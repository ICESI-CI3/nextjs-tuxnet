"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ServiceCard } from "@/components/ServiceCard";
import { BookingForm } from "@/components/forms/BookingForm";
import { serviceService } from "@/services/serviceService";
import type { Service } from "@/types/service";

const navLinks = [
  { href: "/client", label: "Servicios" },
  { href: "/client/appointment", label: "Mis reservas" },
  { href: "/client/profile", label: "Mi perfil" },
];

export default function ClientServiceDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await serviceService.getById(id);
        setService(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No pudimos cargar la informacion del servicio.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchService();
  }, [id]);

  return (
    <DashboardLayout
      title={service ? service.name : "Detalle del servicio"}
      description="Consulta la informacion y agenda tu proxima cita."
      navLinks={navLinks}
      actions={
        <Link
          href="/client"
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Volver a servicios
        </Link>
      }
      sidebar={
        service && (
          <div className="space-y-3 rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
            <p className="text-sm text-text/70">
              Categoria:{" "}
              <span className="font-medium text-primary">
                {service.category ?? "General"}
              </span>
            </p>
            <p className="text-sm text-text/70">
              Duracion:{" "}
              <span className="font-medium text-primary">
                {service.durationMin} minutos
              </span>
            </p>
            <p className="text-sm text-text/70">
              Ultima actualizacion:{" "}
              <span className="font-medium text-primary">
                {new Date(service.updatedAt ?? "").toLocaleString("es-CO", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
        )
      }
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="h-48 animate-pulse rounded-2xl border border-neutral/10 bg-white/60" />
      ) : service ? (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <ServiceCard service={service} showAction={false} />
          </div>
          <div className="lg:col-span-3 rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary">
              Reserva este servicio
            </h2>
            <p className="mt-1 text-sm text-text/70">
              Selecciona fecha y hora para asegurar tu espacio con nuestros especialistas.
            </p>
            <div className="mt-5">
              <BookingForm
                serviceId={service.id}
                serviceName={service.name}
                onSuccess={() => router.push("/client/appointment")}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-center text-text/60">
          No encontramos el servicio solicitado. Revisa el catalogo para seleccionar otra opcion.
        </div>
      )}
    </DashboardLayout>
  );
}
