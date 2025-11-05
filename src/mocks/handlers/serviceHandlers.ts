import { http, HttpResponse } from "msw";
import { mockServices } from "@/mocks/data";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://nestjs-tuxnet-lrey4b2j6-santiagosantacruz57s-projects.vercel.app";

const endpoints = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return [`${API_URL}${normalized}`, normalized] as const;
};

const SERVICES_ENDPOINTS = endpoints("/services");
const SERVICE_DETAIL_ENDPOINTS = endpoints("/services/:id");

const findServiceIndex = (id: string) =>
  mockServices.findIndex((service) => service.id === id);

export const serviceHandlers = [
  ...SERVICES_ENDPOINTS.map((url) =>
    http.get(url, () => HttpResponse.json(mockServices)),
  ),

  ...SERVICE_DETAIL_ENDPOINTS.map((url) =>
    http.get(url, ({ params }) => {
      const id = params.id as string;
      const service = mockServices.find((srv) => srv.id === id);

      if (!service) {
        return HttpResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
      }

      return HttpResponse.json(service);
    }),
  ),

  ...SERVICES_ENDPOINTS.map((url) =>
    http.post(url, async ({ request }) => {
      const body = await request.json<{
        name?: string;
        category?: string;
        durationMin?: number;
        price?: number;
      status?: string;
    }>();

    if (!body.name || !body.durationMin || !body.price) {
      return HttpResponse.json(
        { message: "Nombre, duracion y precio son obligatorios" },
        { status: 400 },
      );
    }

    const newService = {
      id: `srv-${mockServices.length + 1}`,
      name: body.name,
      category: body.category ?? "General",
      durationMin: body.durationMin,
      price: body.price,
      status: body.status ?? "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockServices.push(newService);
    return HttpResponse.json(newService, { status: 201 });
    }),
  ),

  ...SERVICE_DETAIL_ENDPOINTS.map((url) =>
    http.put(url, async ({ params, request }) => {
      const id = params.id as string;
      const index = findServiceIndex(id);

      if (index === -1) {
        return HttpResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
    }

    const body = await request.json<{
      name?: string;
      category?: string;
      durationMin?: number;
      price?: number;
      status?: string;
    }>();

    const current = mockServices[index];
    const updated = {
      ...current,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    mockServices[index] = updated;
    return HttpResponse.json(updated);
    }),
  ),

  ...SERVICE_DETAIL_ENDPOINTS.map((url) =>
    http.delete(url, ({ params }) => {
      const id = params.id as string;
      const index = findServiceIndex(id);

      if (index === -1) {
        return HttpResponse.json({ message: "Servicio no encontrado" }, { status: 404 });
      }

      const [removed] = mockServices.splice(index, 1);
      return HttpResponse.json(removed);
    }),
  ),
];
