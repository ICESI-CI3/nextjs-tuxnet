import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: (token) => {
    localStorage.setItem("token", token);
    const decoded: any = jwtDecode(token);
    const roles = Array.isArray(decoded.roles)
      ? decoded.roles
      : [decoded.roles];
    set({ token, user: { ...decoded, roles } });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));
