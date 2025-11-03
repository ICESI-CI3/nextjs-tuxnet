import { ReactNode, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { hasRole } from "@/utils/roles";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
}

export const RoleGuard = ({ children, allowedRoles }: RoleGuardProps) => {
  const { user, restoreSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    restoreSession();
    if (!user || !hasRole(user.roles, allowedRoles)) {
      router.push("/unauthorized");
    }
  }, [user]);

  if (!user) return null;

  return <>{children}</>;
};
