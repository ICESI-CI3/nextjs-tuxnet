"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { userService } from "@/services/userService";
import type { User } from "@/types/user";

const navLinks = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/appointments", label: "Citas" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/profile", label: "Perfil" },
];

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  client: "Cliente",
  stylist: "Especialista",
};

const getRoleLabel = (role: string) => roleLabels[role] ?? role;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
        setError(null);
      } catch (error) {
        console.error("Error cargando usuarios", error);
        setError(
          error instanceof Error
            ? error.message
            : "No pudimos cargar los usuarios.",
        );
      } finally {
        setIsLoading(false);
      }
    };
    void fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (filter === "all") return users;
    return users.filter((user) => {
      const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
      return roles.includes(filter);
    });
  }, [users, filter]);

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Políticas de acceso
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
          <li>Solo administradores pueden modificar roles.</li>
          <li>
            Los especialistas gestionan su agenda sin acceso a configuración
            global.
          </li>
          <li>
            Clientes visualizan historial y programan nuevas citas únicamente.
          </li>
        </ul>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Invitar usuario</h3>
        <p className="mt-2 text-sm text-text/65">
          Envía invitaciones personalizadas para ampliar el equipo de BellezaTotal.
        </p>
        <button className="mt-4 w-full rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white">
          Generar enlace de invitación
        </button>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title="Gestión de usuarios"
      description="Administra los perfiles, roles y estados de acceso del ecosistema BellezaTotal."
      navLinks={navLinks}
      actions={
        <Link
          href="/admin/users/new"
          className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-white shadow-md shadow-primary/30 transition hover:bg-primary/90"
        >
          Nuevo usuario
        </Link>
      }
      sidebar={sidebar}
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-neutral/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {["all", "admin", "stylist", "client"].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                filter === role
                  ? "bg-primary text-white shadow-primary/20"
                  : "border border-primary/20 text-primary hover:bg-primary/10"
              }`}
            >
              {role === "all" ? "Todos" : getRoleLabel(role)}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-neutral/10 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-neutral/20 text-sm">
          <thead className="bg-secondary/40 text-xs uppercase tracking-[0.2em] text-primary/80">
            <tr>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Correo</th>
              <th className="px-6 py-3 text-left">Roles</th>
              <th className="px-6 py-3 text-left">Estado</th>
              <th className="px-6 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral/10 text-text/70">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <tr key={`user-skeleton-${index}`} className="animate-pulse">
                  {Array.from({ length: 5 }).map((__, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4">
                      <div className="h-4 rounded bg-neutral/20" />
                    </td>
                  ))}
                </tr>
              ))
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => {
                const roles = Array.isArray(user.roles)
                  ? user.roles
                  : [user.roles];
                return (
                  <tr key={user.id} className="hover:bg-secondary/20">
                    <td className="px-6 py-4 text-sm font-medium text-primary">
                      {user.firstname ?? "Sin nombre"}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {roles.filter(Boolean).map((role) => (
                          <span
                            key={`${user.id}-${role}`}
                            className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary"
                          >
                            {getRoleLabel(role)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${
                          user.isActive
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {user.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="rounded-full border border-primary/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-white"
                        >
                          Detalle
                        </Link>
                        <button className="rounded-full border border-neutral/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-text/60 transition hover:border-primary/40 hover:text-primary">
                          Editar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-8 text-center text-sm text-text/60"
                >
                  No hay usuarios en esta categoría todavía. Invita a nuevos
                  perfiles para ampliar tu equipo BellezaTotal.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </DashboardLayout>
  );
}
