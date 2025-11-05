import { http, HttpResponse } from "msw";
import { mockUsers } from "@/mocks/data";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://nestjs-tuxnet-lrey4b2j6-santiagosantacruz57s-projects.vercel.app";

const endpoints = (path: string) => {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return [`${API_URL}${normalized}`, normalized] as const;
};

const USERS_ENDPOINTS = endpoints("/users");

export const userHandlers = [
  ...USERS_ENDPOINTS.map((url) =>
    http.get(url, () => HttpResponse.json(mockUsers)),
  ),
];
