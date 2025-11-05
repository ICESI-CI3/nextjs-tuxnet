"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentCard } from "@/components/AppointmentCard";
import {
  appointmentService,
  UpdateAppointmentPayload,
} from "@/services/appointmentService";
import { useAuthStore } from "@/store/useAuthStore";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

const navLinks = [
  { href: "/specialist", label: "Agenda" },
  { href: "/specialist/appointment", label: "Citas" },
  { href: "/specialist/profile", label: "Perfil" },
];

const filters: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "completed", label: "Completadas" },
  { value: "cancelled", label: "Canceladas" },
];

export default function SpecialistAppointmentsPage() {
  const user = useAuthStore((state) => state.user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentService.getAll();
        setAppointments(data);
        setFeedback(null);
      } catch (error) {
        setFeedback({
          type: "error",
          text:
            error instanceof Error
              ? error.message
              : "No pudimos cargar las citas asignadas.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    void fetchAppointments();
  }, []);

  const specialistAppointments = useMemo(() => {
    if (!user?.id) return [];
    return appointments.filter(
      (appointment) => appointment.specialistId === user.id,
    );
  }, [appointments, user]);

  const filteredAppointments = useMemo(() => {
    if (filter === "all") return specialistAppointments;
    return specialistAppointments.filter(
      (appointment) => appointment.status === filter,
    );
  }, [specialistAppointments, filter]);

  const updateAppointment = async (
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
        text: "La cita se actualizo correctamente.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "No pudimos actualizar la cita.",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Buenas practicas
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Confirma con tus clientes 12 horas antes de la cita.</li>
          <li>Registra notas despues de cada servicio.</li>
          <li>Comunica ausencias o cancelaciones con rapidez.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Recursos</h3>
        <p className="mt-2 text-sm text-text/65">
          Descarga plantillas de recomendaciones para tus clientes y guias de
          cuidado despues del servicio.
        </p>
        <button className="mt-4 w-full rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white">
          Descargar guia
        </button>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Citas asignadas"
      description="Consulta, filtra y actualiza el estado de tus citas programadas."
      navLinks={navLinks}
      sidebar={sidebar}
      actions={
        <Link
          href="/specialist"
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Volver a agenda
        </Link>
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
                key={`specialist-appointments-skeleton-${index}`}
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
                    {appointment.status !== "completed" && (
                      <button
                        onClick={() =>
                          updateAppointment(appointment, { status: "completed" })
                        }
                        disabled={isUpdating === appointment.id}
                        className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Marcar atendida
                      </button>
                    )}
                    {appointment.status !== "cancelled" && (
                      <button
                        onClick={() =>
                          updateAppointment(appointment, { status: "cancelled" })
                        }
                        disabled={isUpdating === appointment.id}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
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
              No tienes citas en esta categoria. Mantente disponible para nuevas reservas.
            </div>
          )}
      </section>
    </DashboardLayout>
  );
}
