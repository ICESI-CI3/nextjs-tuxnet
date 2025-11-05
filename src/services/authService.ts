import { getApiBaseUrl } from "@/services/apiConfig";

export const authService = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Error al iniciar sesion");
    }

    return res.json();
  },

  register: async (firstname: string, email: string, password: string) => {
    const res = await fetch(`${getApiBaseUrl()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, email, password }),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || "Error al registrar usuario");
    }

    return res.json();
  },
};
