import type { Service } from "@/types/service";
import type { Role, User } from "@/types/user";

export interface MockAppointment {
  id: string;
  serviceId: string;
  clientId: string;
  specialistId: string;
  scheduledAt: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
}

interface MockAuthResponse {
  token: string;
  user: User;
}

const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";

const buildToken = (payloadBase64: string) =>
  `${jwtHeader}.${payloadBase64}.mock-signature`;

const buildUser = (payload: {
  user_id: string;
  firstname: string;
  email: string;
  roles: Role[];
  isActive?: boolean;
}): User => ({
  id: payload.user_id,
  firstname: payload.firstname,
  email: payload.email,
  roles: payload.roles,
  isActive: payload.isActive ?? true,
});

export const mockAuthResponses: Record<
  "admin" | "client" | "stylist",
  MockAuthResponse
> = {
  admin: {
    token: buildToken(
      "eyJ1c2VyX2lkIjoibW9jay1hZG1pbi0xIiwiZmlyc3RuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiYWRtaW4iXSwiaXNBY3RpdmUiOnRydWUsImlhdCI6MTczMDAwMDAwMCwiZXhwIjoxODkzNDU2MDAwfQ",
    ),
    user: buildUser({
      user_id: "mock-admin-1",
      firstname: "Admin",
      email: "admin@example.com",
      roles: ["admin"],
    }),
  },
  client: {
    token: buildToken(
      "eyJ1c2VyX2lkIjoibW9jay1jbGllbnQtMSIsImZpcnN0bmFtZSI6IkNhcmxhIiwiZW1haWwiOiJjYXJsYUBleGFtcGxlLmNvbSIsInJvbGVzIjpbImNsaWVudCJdLCJpc0FjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzMwMDAwMDAwLCJleHAiOjE4OTM0NTYwMDB9",
    ),
    user: buildUser({
      user_id: "mock-client-1",
      firstname: "Carla",
      email: "carla@example.com",
      roles: ["client"],
    }),
  },
  stylist: {
    token: buildToken(
      "eyJ1c2VyX2lkIjoibW9jay1zdHlsaXN0LTEiLCJmaXJzdG5hbWUiOiJFc3RlYmFuIiwiZW1haWwiOiJlc3RlYmFuQGV4YW1wbGUuY29tIiwicm9sZXMiOlsic3R5bGlzdCJdLCJpc0FjdGl2ZSI6dHJ1ZSwiaWF0IjoxNzMwMDAwMDAwLCJleHAiOjE4OTM0NTYwMDB9",
    ),
    user: buildUser({
      user_id: "mock-stylist-1",
      firstname: "Esteban",
      email: "esteban@example.com",
      roles: ["stylist"],
    }),
  },
};

export const mockServices: Service[] = [
  {
    id: "srv-1",
    name: "Corte de Cabello Premium",
    category: "Cortes",
    durationMin: 45,
    price: 180000,
    status: "active",
    createdAt: "2024-10-01T10:00:00Z",
    updatedAt: "2024-10-01T10:00:00Z",
  },
  {
    id: "srv-2",
    name: "Coloración & Hidratación",
    category: "Color",
    durationMin: 90,
    price: 320000,
    status: "active",
    createdAt: "2024-10-05T11:00:00Z",
    updatedAt: "2024-10-05T11:00:00Z",
  },
  {
    id: "srv-3",
    name: "Manicure Spa",
    category: "Manos y Pies",
    durationMin: 60,
    price: 95000,
    status: "active",
    createdAt: "2024-10-08T09:00:00Z",
    updatedAt: "2024-10-08T09:00:00Z",
  },
];

export const mockAppointments: MockAppointment[] = [
  {
    id: "app-1",
    serviceId: "srv-1",
    clientId: "mock-client-1",
    specialistId: "mock-stylist-1",
    scheduledAt: "2024-11-05T14:00:00Z",
    status: "confirmed",
    notes: "Cliente solicita estilo clásico.",
  },
  {
    id: "app-2",
    serviceId: "srv-2",
    clientId: "mock-client-1",
    specialistId: "mock-stylist-1",
    scheduledAt: "2024-11-10T16:30:00Z",
    status: "pending",
  },
];

export const mockUsers: User[] = [
  buildUser({
    user_id: "mock-admin-1",
    firstname: "Admin",
    email: "admin@example.com",
    roles: ["admin"],
  }),
  buildUser({
    user_id: "mock-client-1",
    firstname: "Carla",
    email: "carla@example.com",
    roles: ["client"],
  }),
  buildUser({
    user_id: "mock-stylist-1",
    firstname: "Esteban",
    email: "esteban@example.com",
    roles: ["stylist"],
  }),
];
