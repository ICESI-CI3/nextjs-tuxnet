"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { serviceService } from "@/services/serviceService";
import type { Service } from "@/types/service";

const navLinks = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/appointments", label: "Citas" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/profile", label: "Perfil" },
];

export default function AdminServiceDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      setIsLoading(true);
      setFeedback(null);
      try {
        const data = await serviceService.getById(id);
        setService(data);
      } catch (error) {
        setFeedback({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "No fue posible cargar el servicio",
        });
      } finally {
        setIsLoading(false);
      }
    };

    void fetchService();
  }, [id]);

  const handleUpdate = async (
    values: Parameters<typeof serviceService.update>[1],
  ) => {
    if (!id) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const updated = await serviceService.update(id, values);
      setService(updated);
      setFeedback({ type: "success", text: "Servicio actualizado correctamente." });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Error al actualizar el servicio",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebar = service ? (
    <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-primary">Historial rapido</h2>
      <p className="mt-2 text-sm text-text/70">
        Creado el{" "}
        {new Date(service.createdAt ?? service.updatedAt ?? "").toLocaleString(
          "es-CO",
          { day: "numeric", month: "short", year: "numeric" },
        )}
      </p>
      <p className="text-sm text-text/70">
        Ultima actualizacion:{" "}
        {new Date(service.updatedAt ?? "").toLocaleString("es-CO", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  ) : (
    <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-text/70">
        Selecciona un servicio para visualizar sus detalles.
      </p>
    </div>
  );

  return (
    <DashboardLayout
      title={service ? `Editar: ${service.name}` : "Editar servicio"}
      description="Actualiza la informacion del servicio seleccionado y controla su disponibilidad."
      navLinks={navLinks}
      sidebar={sidebar}
      actions={
        <button
          onClick={() => router.push("/admin/services")}
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Volver a servicios
        </button>
      }
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

      {isLoading ? (
        <div className="h-64 animate-pulse rounded-2xl border border-neutral/10 bg-white/60" />
      ) : service ? (
        <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
          <ServiceForm
            initialValues={service}
            onSubmit={handleUpdate}
            isSubmitting={isSubmitting}
            submitLabel="Actualizar servicio"
          />
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-sm text-text/60">
          No encontramos el servicio solicitado. Regresa al listado para
          seleccionar otro registro.
        </div>
      )}
    </DashboardLayout>
  );
}
