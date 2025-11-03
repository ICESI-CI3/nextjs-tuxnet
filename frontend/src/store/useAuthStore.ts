import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

interface User {
  id: string;
  firstname: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

interface DecodedToken {
  sub: string;
  email: string;
  firstname: string;
  roles: string[];
  isActive: boolean;
  exp: number;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  restoreSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  login: (token) => {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      const user: User = {
        id: decoded.sub,
        firstname: decoded.firstname,
        email: decoded.email,
        roles: decoded.roles || [],
        isActive: decoded.isActive,
      };

      localStorage.setItem("token", token);
      set({ token, user, isAuthenticated: true });
    } catch (error) {
      console.error("Error decoding JWT:", error);
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null, isAuthenticated: false });
  },

  restoreSession: () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        // Verificamos expiración
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          set({ token: null, user: null, isAuthenticated: false });
          return;
        }

        const user: User = {
          id: decoded.sub,
          firstname: decoded.firstname,
          email: decoded.email,
          roles: decoded.roles || [],
          isActive: decoded.isActive,
        };

        set({ token, user, isAuthenticated: true });
      } catch (error) {
        console.error("Error decoding JWT:", error);
      }
    }
  },
}));
