import { http, HttpResponse } from "msw";
import {
  mockAppointments,
  mockServices,
  mockUsers,
  MockAppointment,
} from "@/mocks/data";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://nestjs-tuxnet-lrey4b2j6-santiagosantacruz57s-projects.vercel.app";

const endpoints = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return [`${API_URL}${normalized}`, normalized] as const;
};

const APPOINTMENTS_ENDPOINTS = endpoints("/appointments");
const APPOINTMENT_DETAIL_ENDPOINTS = endpoints("/appointments/:id");
const APPOINTMENT_ATTEND_ENDPOINTS = endpoints("/appointments/:id/attend");

const buildAppointmentResponse = (appointment: MockAppointment) => {
  const service = mockServices.find((srv) => srv.id === appointment.serviceId);
  const client = mockUsers.find((usr) => usr.id === appointment.clientId);
  const specialist = mockUsers.find(
    (usr) => usr.id === appointment.specialistId,
  );

  return {
    ...appointment,
    service,
    client,
    specialist,
  };
};

const findAppointmentIndex = (id: string) =>
  mockAppointments.findIndex((appointment) => appointment.id === id);

export const appointmentHandlers = [
  ...APPOINTMENTS_ENDPOINTS.map((url) =>
    http.get(url, () =>
      HttpResponse.json(mockAppointments.map(buildAppointmentResponse)),
    ),
  ),

  ...APPOINTMENT_DETAIL_ENDPOINTS.map((url) =>
    http.get(url, ({ params }) => {
      const id = params.id as string;
      const appointment = mockAppointments.find((app) => app.id === id);

      if (!appointment) {
        return HttpResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 },
      );
      }

      return HttpResponse.json(buildAppointmentResponse(appointment));
    }),
  ),

  ...APPOINTMENTS_ENDPOINTS.map((url) =>
    http.post(url, async ({ request }) => {
      const body = await request.json<{
        serviceId?: string;
        scheduledAt?: string;
        notes?: string;
      }>();

    if (!body.serviceId || !body.scheduledAt) {
      return HttpResponse.json(
        { message: "serviceId y scheduledAt son obligatorios" },
        { status: 400 },
      );
    }

    const newAppointment: MockAppointment = {
      id: `app-${mockAppointments.length + 1}`,
      serviceId: body.serviceId,
      clientId: "mock-client-1",
      specialistId: "mock-stylist-1",
      scheduledAt: body.scheduledAt,
      status: "pending",
      notes: body.notes,
    };

    mockAppointments.push(newAppointment);

    return HttpResponse.json(
      buildAppointmentResponse(newAppointment),
      { status: 201 },
    );
    }),
  ),

  ...APPOINTMENT_DETAIL_ENDPOINTS.map((url) =>
    http.patch(url, async ({ params, request }) => {
      const id = params.id as string;
      const index = findAppointmentIndex(id);

      if (index === -1) {
        return HttpResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 },
      );
    }

    const body = await request.json<Partial<MockAppointment>>();
    const current = mockAppointments[index];

    const updated: MockAppointment = {
      ...current,
      ...body,
    };

    mockAppointments[index] = updated;

    return HttpResponse.json(buildAppointmentResponse(updated));
    }),
  ),

  ...APPOINTMENT_ATTEND_ENDPOINTS.map((url) =>
    http.post(url, ({ params }) => {
      const id = params.id as string;
      const index = findAppointmentIndex(id);

      if (index === -1) {
        return HttpResponse.json(
        { message: "Cita no encontrada" },
        { status: 404 },
      );
    }

    mockAppointments[index].status = "completed";

    return HttpResponse.json(buildAppointmentResponse(mockAppointments[index]));
    }),
  ),
];
