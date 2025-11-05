import type { Appointment } from "@/types/appointment";
import { getApiBaseUrl, getAuthHeaders } from "@/services/apiConfig";

export interface CreateAppointmentPayload {
  serviceId: string;
  startAt: string;
  staffId: string;
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
    const headers = getAuthHeaders();

    const res = await fetch(`${getApiBaseUrl()}/appointments`, {
      headers,
    });

    if (!res.ok) throw new Error("Error al obtener las citas");
    return res.json();
  },

  async getById(id: string): Promise<Appointment> {
    const headers = getAuthHeaders();

    const res = await fetch(`${getApiBaseUrl()}/appointments/${id}`, {
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Cita no encontrada");
    }

    return res.json();
  },

  async create(payload: CreateAppointmentPayload): Promise<Appointment> {
    const headers = getAuthHeaders();

    const res = await fetch(`${getApiBaseUrl()}/appointments`, {
      method: "POST",
      headers,
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
    payload: UpdateAppointmentPayload
  ): Promise<Appointment> {
    const headers = getAuthHeaders();

    const res = await fetch(`${getApiBaseUrl()}/appointments/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al actualizar la cita");
    }

    return res.json();
  },

  async markAsAttended(id: string): Promise<Appointment> {
    const headers = getAuthHeaders();

    const res = await fetch(`${getApiBaseUrl()}/appointments/${id}/attend`, {
      method: "POST",
      headers,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message ?? "Error al marcar como atendida");
    }

    return res.json();
  },
};
