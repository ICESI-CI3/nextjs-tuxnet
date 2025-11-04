import dayjs from "dayjs";
import type { Appointment } from "@/types/appointment";
import type { Service } from "@/types/service";
import type { User } from "@/types/user";

interface AppointmentCardProps {
  appointment: Appointment;
  actions?: React.ReactNode;
}

const statusStyles: Record<
  string,
  { label: string; className: string; dotClass: string }
> = {
  pending: {
    label: "Pendiente",
    className: "bg-secondary/60 text-primary",
    dotClass: "bg-primary",
  },
  confirmed: {
    label: "Confirmada",
    className: "bg-emerald-100 text-emerald-600",
    dotClass: "bg-emerald-500",
  },
  completed: {
    label: "Completada",
    className: "bg-primary/10 text-primary",
    dotClass: "bg-primary",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-red-100 text-red-600",
    dotClass: "bg-red-500",
  },
};

const getStatusStyle = (status: string) =>
  statusStyles[status] ?? statusStyles.pending;

const formatDate = (date: string) =>
  dayjs(date).format("dddd, DD MMMM YYYY - HH:mm");

const getDisplayName = (user?: User) =>
  user?.firstname ?? user?.email ?? "Sin asignar";

const getServiceLabel = (service?: Service) =>
  service?.name ?? "Servicio sin nombre";

export const AppointmentCard = ({
  appointment,
  actions,
}: AppointmentCardProps) => {
  const statusStyle = getStatusStyle(appointment.status);

  return (
    <article className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm transition hover:-translate-y-[2px] hover:shadow-lg">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text/50">
            {formatDate(appointment.scheduledAt)}
          </p>
          <h3 className="text-lg font-semibold text-primary">
            {getServiceLabel(appointment.service)}
          </h3>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusStyle.className}`}
        >
          <span className={`h-2 w-2 rounded-full ${statusStyle.dotClass}`} />
          {statusStyle.label}
        </span>
      </header>

      <dl className="mt-4 grid gap-3 text-sm text-text/70 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-text/50">
            Cliente
          </dt>
          <dd className="mt-1 font-medium text-text/80">
            {getDisplayName(appointment.client)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-text/50">
            Especialista
          </dt>
          <dd className="mt-1 font-medium text-text/80">
            {getDisplayName(appointment.specialist)}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-text/50">
            Notas
          </dt>
          <dd className="mt-1">
            {appointment.notes ?? "Sin notas adicionales"}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.2em] text-text/50">
            Servicio ID
          </dt>
          <dd className="mt-1 font-mono text-xs text-text/60">
            {appointment.serviceId}
          </dd>
        </div>
      </dl>

      {actions && (
        <footer className="mt-4 flex flex-wrap items-center gap-2">
          {actions}
        </footer>
      )}
    </article>
  );
};
