import type { Service } from "@/types/service";
import type { User } from "@/types/user";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  id: string;
  serviceId: string;
  clientId: string;
  specialistId: string;
  scheduledAt: string;
  status: AppointmentStatus;
  notes?: string;
  service?: Service;
  client?: User;
  specialist?: User;
  createdAt?: string;
  updatedAt?: string;
}
