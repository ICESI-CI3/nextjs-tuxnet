"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AdminServiceTable } from "@/components/AdminServiceTable";
import { serviceService } from "@/services/serviceService";
import type { Service } from "@/types/service";

const navLinks = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/appointments", label: "Citas" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/profile", label: "Perfil" },
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  const loadServices = async () => {
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    try {
      const data = await serviceService.getAll();
      setServices(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar los servicios",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (typeof window !== "undefined") {
      const confirmed = window.confirm(
        "Esta accion eliminara el servicio de forma permanente. Deseas continuar?",
      );
      if (!confirmed) return;
    }

    setIsDeleting(id);
    setError(null);
    setFeedback(null);

    try {
      await serviceService.remove(id);
      setServices((prev) => prev.filter((service) => service.id !== id));
      setFeedback({
        type: "success",
        text: "Servicio eliminado correctamente.",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al eliminar el servicio",
      );
    } finally {
      setIsDeleting(null);
    }
  };

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Buenas practicas
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Ajusta precios por temporada para maximizar la ocupacion.</li>
          <li>Actualiza la duracion segun el flujo real de cada especialista.</li>
          <li>Desactiva servicios que no esten disponibles temporalmente.</li>
        </ul>
      </div>
      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Soporte BellezaTotal</h3>
        <p className="mt-2 text-sm text-text/65">
          El equipo puede ayudarte a crear paquetes o combos especiales para
          fidelizar clientes.
        </p>
        <Link
          href="mailto:soporte@bellezatotal.com"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Contactar soporte
        </Link>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Servicios del salon"
      description="Administra el catalogo de servicios, sus precios y disponibilidad."
      navLinks={navLinks}
      actions={
        <Link
          href="/admin/services/new"
          className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-md shadow-primary/30 transition hover:bg-primary/90"
        >
          Nuevo servicio
        </Link>
      }
      sidebar={sidebar}
    >
      {feedback && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {feedback.text}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`admin-services-skeleton-${index}`}
              className="h-24 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
            />
          ))}
        </div>
      ) : (
        <AdminServiceTable
          services={services}
          onDelete={handleDelete}
          isDeleting={Boolean(isDeleting)}
        />
      )}
    </DashboardLayout>
  );
}
