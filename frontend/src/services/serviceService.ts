import { Service } from "@/types/service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://nestjs-tuxnet-lrey4b2j6-santiagosantacruz57s-projects.vercel.app";

export const serviceService = {
  async getAll(): Promise<Service[]> {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/services`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (!res.ok) throw new Error("Error al obtener los servicios");
    return res.json();
  },
};
