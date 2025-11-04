"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { appointmentService } from "@/services/appointmentService";
import { serviceService } from "@/services/serviceService";
import { userService } from "@/services/userService";
import { AppointmentCard } from "@/components/AppointmentCard";
import { ServiceCard } from "@/components/ServiceCard";
import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/service";
import type { User } from "@/types/user";

const navLinks = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/appointments", label: "Citas" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/profile", label: "Perfil" },
];

export default function AdminDashboardPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesData, appointmentsData, usersData] = await Promise.all([
          serviceService.getAll(),
          appointmentService.getAll(),
          userService.getAll(),
        ]);

        setServices(servicesData);
        setAppointments(appointmentsData);
        setUsers(usersData);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Error cargando información del tablero",
        );
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const totalClients = users.filter((user) =>
    (Array.isArray(user.roles) ? user.roles : [user.roles]).includes("client"),
  ).length;

  const totalSpecialists = users.filter((user) =>
    (Array.isArray(user.roles) ? user.roles : [user.roles]).includes(
      "stylist",
    ),
  ).length;

  const totalRevenue = services.reduce(
    (acc, service) => acc + Number(service.price ?? 0),
    0,
  );

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Acciones rápidas
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Publica una promoción especial para clientes frecuentes.</li>
          <li>Verifica la agenda de especialistas para balancear horarios.</li>
          <li>Revisa las reservas pendientes de confirmación.</li>
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Equipo BellezaTotal</h3>
        <p className="mt-2 text-sm text-text/65">
          Coordina entrenamientos, evalúa desempeño y asegura que los estilos
          sigan la identidad de la marca.
        </p>
        <Link
          href="/admin/users"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Gestionar usuarios
        </Link>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Panel administrativo"
      description="Supervisa la operación del salón: servicios, especialistas y reservas activas."
      navLinks={navLinks}
      actions={
        <Link
          href="/admin/services"
          className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-md shadow-primary/30 transition hover:bg-primary/90"
        >
          Crear servicio
        </Link>
      }
      sidebar={sidebar}
    >
      <section className="grid gap-4 md:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`stat-skeleton-${index}`}
              className="h-32 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
            />
          ))
        ) : (
          <>
            <StatCard
              title="Servicios activos"
              value={services.length}
              subtitle="Catálogo disponible para clientes"
              accent="primary"
              icon={<span>💆‍♀️</span>}
            />
            <StatCard
              title="Reservas registradas"
              value={appointments.length}
              subtitle="Incluye pendientes y confirmadas"
              accent="secondary"
              icon={<span>🗓️</span>}
            />
            <StatCard
              title="Ingresos estimados"
              value={`$${totalRevenue.toLocaleString("es-CO")}`}
              subtitle="Basado en precios de catálogo"
              accent="neutral"
              icon={<span>💰</span>}
            />
          </>
        )}
      </section>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Reservas recientes
            </h2>
            <p className="text-sm text-text/65">
              Supervisión rápida de las citas más cercanas.
            </p>
          </div>
          <Link
            href="/admin/appointments"
            className="rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Ver agenda completa
          </Link>
        </header>

        <div className="mt-4 grid gap-4">
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`appointment-admin-skeleton-${index}`}
                  className="h-32 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
                />
              ))
            : appointments.slice(0, 3).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  actions={
                    <Link
                      href={`/admin/appointments/${appointment.id}`}
                      className="rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
                    >
                      Ver detalle
                    </Link>
                  }
                />
              ))}
        </div>
      </section>

      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Especialistas y clientes
            </h2>
            <p className="text-sm text-text/65">
              Roles activos en el sistema de BellezaTotal.
            </p>
          </div>
        </header>
        <dl className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-neutral/10 bg-secondary/40 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Especialistas
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-primary">
              {totalSpecialists}
            </dd>
            <dd className="text-sm text-text/70">
              Profesionales dedicados a servicios premium.
            </dd>
          </div>
          <div className="rounded-2xl border border-neutral/10 bg-secondary/40 p-4">
            <dt className="text-xs uppercase tracking-[0.2em] text-primary/80">
              Clientes registrados
            </dt>
            <dd className="mt-2 text-2xl font-semibold text-primary">
              {totalClients}
            </dd>
            <dd className="text-sm text-text/70">
              Usuarios activos en la plataforma.
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              Servicios destacados
            </h2>
            <p className="text-sm text-text/65">
              Controla la oferta actual y ajusta precios según la demanda.
            </p>
          </div>
        </header>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={`services-admin-skeleton-${index}`}
                  className="h-40 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
                />
              ))
            : services.slice(0, 4).map((service) => (
                <ServiceCard key={`admin-service-${service.id}`} service={service} />
              ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
