import type { User } from "@/types/user";
import { getApiBaseUrl, getAuthHeaders } from "@/services/apiConfig";

export const userService = {
  async getAll(): Promise<User[]> {
    const res = await fetch(`${getApiBaseUrl()}/users`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al obtener los usuarios");
    }

    return res.json();
  },
};
