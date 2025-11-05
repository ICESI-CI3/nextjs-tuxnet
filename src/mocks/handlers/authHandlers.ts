import { http, HttpResponse } from "msw";
import { mockAuthResponses, mockUsers } from "@/mocks/data";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://nestjs-tuxnet-lrey4b2j6-santiagosantacruz57s-projects.vercel.app";

const endpoints = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return [`${API_URL}${normalized}`, normalized] as const;
};

const LOGIN_ENDPOINTS = endpoints("/auth/login");
const REGISTER_ENDPOINTS = endpoints("/auth/register");

const resolveUserByEmail = (email: string) =>
  mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());

const loginHandler = async ({ request }: { request: Request }) => {
    const body = (await request.json()) as {
    email?: string;
    password?: string;
  };

    if (!body.email || !body.password) {
      return HttpResponse.json(
        { message: "Email y contraseña requeridos" },
        { status: 400 },
      );
    }

    const user = resolveUserByEmail(body.email);
    if (!user) {
      return HttpResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    const role = Array.isArray(user.roles) ? user.roles[0] : user.roles;
    const authResponse =
      mockAuthResponses[
        (role as keyof typeof mockAuthResponses) ?? "client"
      ] ?? mockAuthResponses.client;

    return HttpResponse.json({
      user_id: authResponse.user.id,
      email: authResponse.user.email,
      roles: authResponse.user.roles,
      isActive: authResponse.user.isActive,
      token: authResponse.token,
    });
  };

const registerHandler = async ({ request }: { request: Request }) => {
    const body = (await request.json()) as {
    firstname?: string;
    email?: string;
    password?: string;
  };

    if (!body.firstname || !body.email || !body.password) {
      return HttpResponse.json(
        { message: "Todos los campos son obligatorios" },
        { status: 400 },
      );
    }

    const exists = resolveUserByEmail(body.email);
    if (exists) {
      return HttpResponse.json(
        { message: "El correo ya está registrado" },
        { status: 409 },
      );
    }

    const newUser = {
      id: `mock-user-${mockUsers.length + 1}`,
      firstname: body.firstname,
      email: body.email,
      roles: ["client"],
      isActive: true,
    };
    mockUsers.push(newUser);

    return HttpResponse.json(newUser, { status: 201 });
  };

export const authHandlers = [
  ...LOGIN_ENDPOINTS.map((url) => http.post(url, loginHandler)),
  ...REGISTER_ENDPOINTS.map((url) => http.post(url, registerHandler)),
];
