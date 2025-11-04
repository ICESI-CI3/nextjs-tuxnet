"use client";

import { useRouter } from "next/router";
import { useEffect, useMemo, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";

const publicRoutes = ["/", "/login", "/register"];
const authRedirectRoutes = ["/", "/login", "/register"];

const getDashboardForRoles = (roles: string[]): string | null => {
  if (roles.includes("admin")) return "/admin";
  if (roles.includes("client")) return "/client";
  if (roles.includes("stylist")) return "/specialist";
  if (roles.length === 0) return "/client";
  return null;
};

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, token, isReady, hydrate } = useAuthStore();
  const hasHydrated = useRef(false);

  useEffect(() => {
    if (hasHydrated.current) return;
    hydrate();
    hasHydrated.current = true;
  }, [hydrate]);

  const roles = useMemo(() => {
    if (!user?.roles) return [];
    return Array.isArray(user.roles) ? user.roles : [user.roles];
  }, [user]);

  const isPublicRoute = useMemo(
    () => publicRoutes.includes(router.pathname),
    [router.pathname],
  );

  useEffect(() => {
    if (!isReady) return;

    if (!token) {
      if (!isPublicRoute) {
        router.replace("/login");
      }
      return;
    }

    const target = getDashboardForRoles(roles);
    if (!target) return;

    // Redirigir solo desde rutas de autenticacion para evitar bloquear la landing
    if (authRedirectRoutes.includes(router.pathname)) {
      router.replace(target);
    }
  }, [isReady, token, roles, router, isPublicRoute]);

  if (!isReady) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <p className="text-primary">Cargando sesion...</p>
      </div>
    );
  }

  if (!token && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};
