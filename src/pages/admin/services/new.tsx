"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ServiceForm } from "@/components/forms/ServiceForm";
import { serviceService } from "@/services/serviceService";

const navLinks = [
  { href: "/admin", label: "Tablero" },
  { href: "/admin/appointments", label: "Citas" },
  { href: "/admin/services", label: "Servicios" },
  { href: "/admin/users", label: "Usuarios" },
  { href: "/admin/profile", label: "Perfil" },
];

type Feedback = { type: "success" | "error"; text: string } | null;

export default function AdminServiceCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const handleSubmit = async (values: Parameters<typeof serviceService.create>[0]) => {
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const created = await serviceService.create(values);
      setFeedback({ type: "success", text: "Servicio creado correctamente." });
      setTimeout(() => {
        router.push(`/admin/services/${created.id}`);
      }, 600);
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error ? error.message : "Error al crear el servicio",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sidebar = (
    <div className="rounded-2xl border border-primary/10 bg-white p-5 shadow-sm shadow-primary/10">
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        Sugerencias
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-text/70">
        <li>Define categorias claras para facilitar los filtros del cliente.</li>
        <li>
          Ajusta la duracion real del servicio para optimizar la agenda de especialistas.
        </li>
        <li>
          Usa el estado inactivo para ocultar servicios sin borrarlos definitivamente.
        </li>
      </ul>
    </div>
  );

  return (
    <DashboardLayout
      title="Nuevo servicio"
      description="Completa la informacion para agregar un nuevo servicio al catalogo."
      navLinks={navLinks}
      sidebar={sidebar}
    >
      {feedback && (
        <div
          className={`rounded-2xl border p-4 text-sm ${
            feedback.type === "success"
              ? "border-primary/20 bg-primary/10 text-primary"
              : "border-red-200 bg-red-50 text-red-600"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <section className="rounded-2xl border border-neutral/10 bg-white p-6 shadow-sm">
        <ServiceForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </section>
    </DashboardLayout>
  );
}
