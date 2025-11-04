"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppointmentCard } from "@/components/AppointmentCard";
import { appointmentService } from "@/services/appointmentService";
import type { Appointment, AppointmentStatus } from "@/types/appointment";

const navLinks = [
  { href: "/client", label: "Servicios" },
  { href: "/client/appointment", label: "Mis reservas" },
  { href: "/client/profile", label: "Mi perfil" },
];

const filters: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "pending", label: "Pendientes" },
  { value: "confirmed", label: "Confirmadas" },
  { value: "completed", label: "Completadas" },
];

export default function ClientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]["value"]>("all");
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await appointmentService.getAll();
        setAppointments(data);
        setError(null);
      } catch (error) {
        console.error("Error cargando citas:", error);
        setError(
          error instanceof Error
            ? error.message
            : "No pudimos cargar tus reservas.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchData();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (filter === "all") return appointments;
    return appointments.filter((appointment) => appointment.status === filter);
  }, [appointments, filter]);

  const updateAppointment = async (
    appointment: Appointment,
    status: AppointmentStatus,
  ) => {
    setIsUpdating(appointment.id);
    setFeedback(null);
    try {
      const updated = await appointmentService.update(appointment.id, {
        status,
      });
      setAppointments((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item)),
      );
      setFeedback({
        type: "success",
        text: "Tu reserva se actualizo correctamente.",
      });
    } catch (err) {
      setFeedback({
        type: "error",
        text:
          err instanceof Error
            ? err.message
            : "No pudimos actualizar la reserva.",
      });
    } finally {
      setIsUpdating(null);
    }
  };

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Consejos
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>
            Confirma tu cita con 24 horas de anticipación para asegurar tu cupo.
          </li>
          <li>
            Comparte notas con el especialista para personalizar tu experiencia.
          </li>
          <li>
            Cancela con tiempo para liberar la agenda de nuestros estilistas.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">¿Necesitas reagendar?</h3>
        <p className="mt-2 text-sm text-text/65">
          Escribe al equipo de soporte o comunícate directamente con tu
          especialista de confianza.
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
      title="Mis reservas"
      description="Gestiona, confirma o reprograma tus próximas citas para mantener tu agenda en orden."
      navLinks={navLinks}
      actions={
        <Link
          href="/client"
          className="rounded-full border border-primary/30 px-5 py-3 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Explorar servicios
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
                key={`appointment-skeleton-${index}`}
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
                    {["pending", "confirmed"].includes(appointment.status) && (
                      <button
                        onClick={() => updateAppointment(appointment, "cancelled")}
                        disabled={isUpdating === appointment.id}
                        className="rounded-full border border-red-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Cancelar
                      </button>
                    )}
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => updateAppointment(appointment, "confirmed")}
                        disabled={isUpdating === appointment.id}
                        className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Confirmar
                      </button>
                    )}
                  </div>
                }
              />
            ))
          : (
            <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-center text-text/60">
              No tienes reservas en este estado todavía. Explora nuestros{" "}
              <Link
                href="/client"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                servicios disponibles
              </Link>{" "}
              para agendar tu próxima experiencia.
            </div>
            )}
      </section>
    </DashboardLayout>
  );
}
