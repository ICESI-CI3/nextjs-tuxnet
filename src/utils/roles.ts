import type { Role } from "@/types/user";

export const hasRole = (roles: Role[] | string, allowed: Role[]): boolean => {
  if (typeof roles === "string") {
    return allowed.includes(roles as Role);
  }
  return roles.some((r) => allowed.includes(r as Role));
};
