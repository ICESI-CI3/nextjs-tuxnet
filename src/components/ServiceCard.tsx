import Link from "next/link";
import type { Service } from "@/types/service";

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

interface ServiceCardProps {
  service: Service;
  showAction?: boolean;
}

export const ServiceCard = ({ service, showAction = true }: ServiceCardProps) => {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-primary">
            {service.name}
          </h3>
          {service.category && (
            <span className="mt-2 inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {service.category}
            </span>
          )}
        </div>
        <span className="rounded-full bg-secondary/60 px-3 py-1 text-xs font-medium text-text/70">
          {service.durationMin} min
        </span>
      </div>

      <p className="mt-4 text-sm text-text/70">
        Actualizado el{" "}
        {new Date(service.updatedAt).toLocaleDateString("es-CO", {
          day: "numeric",
          month: "short",
        })}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xl font-semibold text-primary">
          {currencyFormatter.format(Number(service.price) || 0)}
        </p>
        {showAction && (
          <Link
            href={`/client/service/${service.id}`}
            className="rounded-full border border-primary/30 px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Reservar
          </Link>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 via-primary/60 to-primary/20 opacity-0 transition group-hover:opacity-100" />
    </article>
  );
};
