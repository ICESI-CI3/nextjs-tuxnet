import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import type { User } from "@/types/user";

const TOKEN_KEY = "token";
const USER_KEY = "sessionUser";

const normalizeRoles = (value: any): User["roles"] => {
  if (Array.isArray(value)) {
    return value.map((role) => String(role));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === "{}") return [];
    return [trimmed];
  }

  return [];
};

const decodeToken = (token: string): Partial<User> | null => {
  try {
    const payload: Record<string, any> = jwtDecode(token);

    return {
      id:
        payload.user_id ??
        payload.id ??
        payload.sub ??
        payload.uuid ??
        "",
      firstname: payload.firstname ?? payload.name ?? "",
      email: payload.email ?? "",
      roles: normalizeRoles(payload.roles),
      isActive: payload.isActive ?? true,
    };
  } catch (error) {
    console.error("Failed to decode auth token", error);
    return null;
  }
};

const persistSession = (token: string | null, user: User | null) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
};

const readStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as User;
  } catch (error) {
    console.warn("Failed to parse stored user", error);
    return null;
  }
};

const mergeUserData = (
  decoded: Partial<User> | null,
  extra?: Partial<User>,
  fallback?: User | null,
): User | null => {
  const base = decoded ?? extra ?? fallback;
  if (!base) return null;
  return {
    id: base.id ?? "",
    firstname: base.firstname ?? "",
    email: base.email ?? "",
    roles: normalizeRoles(base.roles),
    isActive: base.isActive ?? true,
  };
};

interface AuthState {
  user: User | null;
  token: string | null;
  isReady: boolean;
  login: (token: string, userData?: Partial<User>) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isReady: false,

  login: (token, userData) => {
    const decoded = decodeToken(token);
    const combinedUser = mergeUserData(decoded, userData);

    if (!combinedUser) {
      persistSession(null, null);
      set({ user: null, token: null, isReady: true });
      return;
    }

    persistSession(token, combinedUser);
    set({ token, user: combinedUser, isReady: true });
  },

  logout: () => {
    persistSession(null, null);
    set({ user: null, token: null, isReady: true });
  },

  hydrate: () => {
    if (get().isReady || typeof window === "undefined") return;

    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = readStoredUser();

    if (!storedToken) {
      persistSession(null, null);
      set({ isReady: true });
      return;
    }

    const decoded = decodeToken(storedToken);
    const combinedUser = mergeUserData(decoded, undefined, storedUser);

    if (!combinedUser) {
      persistSession(null, null);
      set({ user: null, token: null, isReady: true });
      return;
    }

    persistSession(storedToken, combinedUser);
    set({ token: storedToken, user: combinedUser, isReady: true });
  },
}));
