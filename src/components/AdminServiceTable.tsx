import Link from "next/link";
import type { Service } from "@/types/service";

interface AdminServiceTableProps {
  services: Service[];
  onDelete?: (id: string) => Promise<void> | void;
  isDeleting?: boolean;
}

const currencyFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export const AdminServiceTable = ({
  services,
  onDelete,
  isDeleting = false,
}: AdminServiceTableProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral/10 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-neutral/20 text-sm">
        <thead className="bg-secondary/40 text-xs uppercase tracking-[0.2em] text-primary/80">
          <tr>
            <th className="px-6 py-3 text-left">Servicio</th>
            <th className="px-6 py-3 text-left">Categoria</th>
            <th className="px-6 py-3 text-left">Duracion</th>
            <th className="px-6 py-3 text-left">Precio</th>
            <th className="px-6 py-3 text-left">Estado</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral/10 text-text/70">
          {services.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-sm text-text/60"
              >
                No hay servicios creados por el momento.
              </td>
            </tr>
          ) : (
            services.map((service) => (
              <tr key={service.id} className="hover:bg-secondary/20">
                <td className="px-6 py-4 text-sm font-semibold text-primary">
                  {service.name}
                </td>
                <td className="px-6 py-4 text-sm">
                  {service.category ?? "General"}
                </td>
                <td className="px-6 py-4 text-sm">{service.durationMin} min</td>
                <td className="px-6 py-4 text-sm">
                  {currencyFormatter.format(Number(service.price) || 0)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                      service.status === "active"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {service.status ?? "activo"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="rounded-full border border-primary/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-white"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => onDelete?.(service.id)}
                      disabled={!onDelete || isDeleting}
                      className="rounded-full border border-red-200 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
