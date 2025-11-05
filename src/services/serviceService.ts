import type { Service } from "@/types/service";
import { getApiBaseUrl, getAuthHeaders } from "@/services/apiConfig";

export interface ServicePayload {
  name: string;
  category?: string;
  durationMin: number;
  price: number;
  status?: string;
}

export const serviceService = {
  async getAll(): Promise<Service[]> {
    const res = await fetch(`${getApiBaseUrl()}/services`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) throw new Error("Error al obtener los servicios");
    return res.json();
  },

  async getById(id: string): Promise<Service> {
    const res = await fetch(`${getApiBaseUrl()}/services/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Servicio no encontrado");
    }

    return res.json();
  },

  async create(payload: ServicePayload): Promise<Service> {
     console.log("Sending request payload:", payload);
     
    const res = await fetch(`${getApiBaseUrl()}/services`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al crear servicio");
    }

    return res.json();
  },

  async update(id: string, payload: Partial<ServicePayload>): Promise<Service> {
    const res = await fetch(`${getApiBaseUrl()}/services/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al actualizar servicio");
    }

    return res.json();
  },

  async remove(id: string): Promise<Service> {
    const res = await fetch(`${getApiBaseUrl()}/services/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al eliminar servicio");
    }

    return res.json();
  },
};
