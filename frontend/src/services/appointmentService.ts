import type { Appointment } from "@/types/appointment";
import { getApiBaseUrl, getAuthHeaders } from "@/services/apiConfig";

export interface CreateAppointmentPayload {
  serviceId: string;
  scheduledAt: string;
  notes?: string;
}

export interface UpdateAppointmentPayload {
  scheduledAt?: string;
  notes?: string;
  specialistId?: string;
  status?: string;
}

export const appointmentService = {
  async getAll(): Promise<Appointment[]> {
    const res = await fetch(`${getApiBaseUrl()}/appointments`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      throw new Error("Error al obtener las citas");
    }

    return res.json();
  },

  async getById(id: string): Promise<Appointment> {
    const res = await fetch(`${getApiBaseUrl()}/appointments/${id}`, {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Cita no encontrada");
    }
    console.log(res.json())
    return res.json();
  },

  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    console.log("Sending request payload:", payload);
    const res = await fetch(`${getApiBaseUrl()}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al crear la cita");
    }

    return res.json();
  },

  async update(
    id: string,
    payload: UpdateAppointmentPayload,
  ): Promise<Appointment> {
    const res = await fetch(`${getApiBaseUrl()}/appointments/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al actualizar la cita");
    }

    return res.json();
  },

  async markAsAttended(id: string): Promise<Appointment> {
    const res = await fetch(`${getApiBaseUrl()}/appointments/${id}/attend`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al marcar como atendida");
    }

    return res.json();
  },
};
