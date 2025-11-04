"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    // Si no hay token, redirigir al login
    if (!token) {
      router.replace("/");
      return;
    }

    // Redirección automática según el rol
    if (user?.roles) {
      const roles = Array.isArray(user.roles) ? user.roles : [user.roles];
      if (roles.includes("admin")) router.replace("/admin");
      else if (roles.includes("client")) router.replace("/client");
      else if (roles.includes("stylist")) router.replace("/especialista");
    }
  }, [user, token, router]);

  return <>{children}</>;
};
