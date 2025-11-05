"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
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

const priorityStatuses: AppointmentStatus[] = ["pending", "confirmed"];

export default function SpecialistDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
              : "No pudimos cargar tu agenda.",
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

  const upcoming = specialistAppointments.filter((appointment) =>
    priorityStatuses.includes(appointment.status),
  );

  const completed = specialistAppointments.filter(
    (appointment) => appointment.status === "completed",
  );

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

  const markAttended = (appointment: Appointment) =>
    updateAppointment(appointment, { status: "completed" });

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Preparacion del dia
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Confirma horarios con tus clientes antes de comenzar.</li>
          <li>Revisa notas para personalizar cada experiencia.</li>
          <li>
            Marca las citas completadas para mantener actualizado el tablero.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">
          Consejos BellezaTotal
        </h3>
        <p className="mt-2 text-sm text-text/65">
          Agrega recomendaciones posteriores a cada cita para fidelizar a tus
          clientes y mejorar su seguimiento.
        </p>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Agenda de especialista"
      description="Visualiza tus proximas citas, confirma asistencia y gestiona notas personalizadas."
      navLinks={navLinks}
      actions={
        <Link
          href="/specialist/appointment"
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Ver citas completas
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

      <section className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`specialist-stat-skeleton-${index}`}
              className="h-32 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
            />
          ))
        ) : (
          <>
            <StatCard
              title="Citas hoy"
              value={upcoming.length}
              subtitle="Pendientes de atender"
              accent="primary"
              icon={<span>AT</span>}
            />
            <StatCard
              title="Completadas"
              value={completed.length}
              subtitle="Total esta semana"
              accent="secondary"
              icon={<span>OK</span>}
            />
            <StatCard
              title="Clientes activos"
              value={specialistAppointments.length}
              subtitle="Asignados a tu agenda"
              accent="neutral"
              icon={<span>CL</span>}
            />
          </>
        )}
      </section>

      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Citas prioritarias
            </h2>
            <p className="text-sm text-text/65">
              Revisa los detalles de clientes y confirma asistencia cuanto antes.
            </p>
          </div>
          <Link
            href="/specialist/appointment"
            className="rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Gestionar citas
          </Link>
        </header>

        <div className="mt-4 grid gap-4">
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`specialist-upcoming-skeleton-${index}`}
                  className="h-32 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
                />
              ))
            : upcoming.length > 0
            ? upcoming.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actions={
                    <button
                      onClick={() => markAttended(appointment)}
                      disabled={isUpdating === appointment.id}
                      className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Marcar atendida
                    </button>
                  }
                />
              ))
            : (
              <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-center text-text/60">
                No tienes citas pendientes. Mantente disponible para nuevos clientes.
              </div>
            )}
        </div>
      </section>
    </DashboardLayout>
  );
}
