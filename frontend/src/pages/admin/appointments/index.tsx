"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
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

const filters: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "completed", label: "Completadas" },
  { value: "cancelled", label: "Canceladas" },
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  const loadAppointments = async () => {
    setIsLoading(true);
    setFeedback(null);
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Error al cargar las citas",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((appointment) => appointment.status === filter);
  }, [appointments, filter]);

  const updateStatus = async (
    appointment: Appointment,
    payload: UpdateAppointmentPayload,
  ) => {
    setIsUpdating(appointment.id);
    setFeedback(null);
    try {
      const updated = await appointmentService.update(appointment.id, payload);
      setAppointments((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setFeedback({
        type: "success",
        text: "Cita actualizada correctamente.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "No pudimos actualizar la cita",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Politicas de agenda
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Confirma las citas pendientes al menos 24 horas antes.</li>
          <li>
            Marca como completadas apenas el especialista cierre el servicio.
          </li>
          <li>Registra cancelaciones para liberar la agenda a tiempo.</li>
        </ul>
      </div>
      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Reportes rapidos</h3>
        <p className="mt-2 text-sm text-text/65">
          Proximamente podras exportar reportes de ocupacion y productividad
          semanal directamente desde este panel.
        </p>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Administracion de citas"
      description="Supervisa y actualiza el estado de las reservas de BellezaTotal."
      navLinks={navLinks}
      actions={
        <Link
          href="/admin/services"
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Gestionar servicios
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

      <section className="rounded-2xl border border-neutral/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                filter === item.value
                  ? "bg-primary text-white shadow-primary/20"
                  : "border border-primary/20 text-primary hover:bg-primary/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      <section className="grid gap-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`admin-appointments-skeleton-${index}`}
                className="h-36 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
              />
            ))
          : filteredAppointments.length > 0
          ? filteredAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                actions={
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/appointments/${appointment.id}`}
                      className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-white"
                    >
                      Ver detalle
                    </Link>
                    {appointment.status !== "completed" && (
                      <button
                        onClick={() =>
                          updateStatus(appointment, { status: "completed" })
                        }
                        disabled={isUpdating === appointment.id}
                        className="rounded-full border border-emerald-300 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-600 transition hover:bg-emerald-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Marcar completada
                      </button>
                    )}
                    {appointment.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          updateStatus(appointment, { status: "cancelled" })
                        }
                        disabled={isUpdating === appointment.id}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                }
              />
            ))
          : (
            <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-center text-text/60">
              No hay citas en este estado actualmente. Ajusta los filtros o
              verifica la disponibilidad de servicios.
            </div>
            )}
      </section>
    </DashboardLayout>
  );
}
