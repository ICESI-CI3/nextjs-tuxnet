"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
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
  admin: "Administradores",
  client: "Clientes",
  stylist: "Especialistas",
};

export default function AdminUsersByRolePage() {
  const router = useRouter();
  const { type } = router.query as { type?: string };
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (error) {
        console.error("Error cargando usuarios", error);
      } finally {
        setIsLoading(false);
      }
    };
    void fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    if (!type) return [];
    return users.filter((user) => {
      const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
      return roles.includes(type);
    });
  }, [users, type]);

  const sidebar = (
    <>
      <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Rol seleccionado
        </h2>
        <p className="mt-3 text-sm text-text/70">
          {type ? roleLabels[type] ?? type : "Selecciona un rol para continuar."}
        </p>
      </div>

      <div className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-primary">Volver</h3>
        <p className="mt-2 text-sm text-text/65">
          Regresa al listado completo para gestionar el resto del equipo.
        </p>
        <Link
          href="/admin/users"
          className="mt-4 inline-flex items-center justify-center rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
        >
          Ver todos los usuarios
        </Link>
      </div>
    </>
  );

  return (
    <DashboardLayout
      title={roleLabels[type ?? ""] ?? "Usuarios"}
      description="Visualiza y administra a los integrantes clasificados por rol."
      navLinks={navLinks}
      sidebar={sidebar}
    >
      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">
              {filteredUsers.length} {roleLabels[type ?? ""] ?? "usuarios"}
            </h2>
            <p className="text-sm text-text/65">
              Gestiona información de contacto y estado de acceso.
            </p>
          </div>
          <Link
            href="/admin/users"
            className="rounded-full border border-primary/30 px-4 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Volver al listado general
          </Link>
        </header>

        <div className="mt-5 grid gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`user-role-skeleton-${index}`}
                className="h-24 animate-pulse rounded-2xl border border-neutral/10 bg-white/60"
              />
            ))
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <article
                key={user.id}
                className="flex flex-col justify-between rounded-2xl border border-neutral/10 bg-secondary/40 p-4 transition hover:-translate-y-[1px] hover:shadow-lg sm:flex-row sm:items-center"
              >
                <div>
                  <p className="text-sm font-semibold text-primary">
                    {user.firstname ?? "Sin nombre"}
                  </p>
                  <p className="text-sm text-text/65">{user.email}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 sm:mt-0 sm:items-center">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] ${
                      user.isActive
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {user.isActive ? "Activo" : "Inactivo"}
                  </span>
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="rounded-full border border-primary/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-primary transition hover:bg-primary hover:text-white"
                  >
                    Ver detalle
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/30 bg-white p-6 text-center text-sm text-text/60">
              No encontramos usuarios para el rol seleccionado. Regresa al
              listado general para revisar otros perfiles.
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
}
