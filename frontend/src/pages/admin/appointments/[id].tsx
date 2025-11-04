"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentCard } from "@/components/AppointmentCard";
import {
  appointmentService,
  UpdateAppointmentPayload,
} from "@/services/appointmentService";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

const navLinks = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/appointments", label: "Citas" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/profile", label: "Perfil" },
];

const statuses: AppointmentStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export default function AdminAppointmentDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  const loadAppointment = async (selectedId: string) => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const data = await appointmentService.getById(selectedId);
      setAppointment(data);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "No pudimos cargar la cita seleccionada",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    void loadAppointment(id);
  }, [id]);

  const handleUpdate = async (payload: UpdateAppointmentPayload) => {
    if (!appointment) return;
    setIsUpdating(true);
    setFeedback(null);
    try {
      const updated = await appointmentService.update(appointment.id, payload);
      setAppointment(updated);
      setFeedback({
        type: "success",
        text: "La cita se actualizo correctamente.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Error al actualizar la cita",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    handleUpdate({ status: event.target.value });
  };

  const sidebar = appointment ? (
    <div className="space-y-3 rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-primary">Resumen</h2>
      <p className="text-sm text-text/70">
        Cliente:{" "}
        <span className="font-medium text-primary">
          {appointment.client?.firstname ?? appointment.client?.email ?? "N/A"}
        </span>
      </p>
      <p className="text-sm text-text/70">
        Especialista:{" "}
        <span className="font-medium text-primary">
          {appointment.specialist?.firstname ??
            appointment.specialist?.email ??
            "N/A"}
        </span>
      </p>
      <p className="text-sm text-text/70">
        Servicio:{" "}
        <span className="font-medium text-primary">
          {appointment.service?.name ?? "Sin servicio"}
        </span>
      </p>
      <p className="text-sm text-text/60">
        ID interno:{" "}
        <span className="font-mono text-xs">
          {appointment.id} · {appointment.serviceId}
        </span>
      </p>
    </div>
  ) : (
    <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
      <p className="text-sm text-text/65">
        Selecciona una cita del listado para consultar su detalle.
      </p>
    </div>
  );

  return (
    <DashboardLayout
      title={appointment ? "Detalle de la cita" : "Cargando cita"}
      description="Consulta y actualiza la informacion específica de la reserva."
      navLinks={navLinks}
      sidebar={sidebar}
      actions={
        <button
          onClick={() => router.push("/admin/appointments")}
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Volver a citas
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
        <div className="h-48 animate-pulse rounded-2xl border border-neutral/10 bg-white/60" />
      ) : appointment ? (
        <div className="space-y-6">
          <AppointmentCard appointment={appointment} />

          <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-primary mb-4">
              Administrar estado
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-text/80">
                Estado de la cita
                <select
                  value={appointment.status}
                  onChange={handleStatusChange}
                  disabled={isUpdating}
                  className="rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={() => handleUpdate({ notes: "" })}
                disabled={isUpdating}
                className="mt-6 rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Limpiar notas
              </button>
            </div>
          </section>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-center text-text/60">
          No encontramos la cita solicitada. Regresa al listado principal.
        </div>
      )}
    </DashboardLayout>
  );
}
