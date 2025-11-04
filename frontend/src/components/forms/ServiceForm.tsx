"use client";

import { useState } from "react";
import type { Service } from "@/types/service";
import type { ServicePayload } from "@/services/serviceService";

interface ServiceFormProps {
  initialValues?: Partial<Service>;
  onSubmit: (values: ServicePayload) => Promise<void> | void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

const defaultValues = {
  name: "",
  category: "",
  durationMin: 60,
  price: 0,
  status: "active",
};

export const ServiceForm = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = "Guardar servicio",
}: ServiceFormProps) => {
  const [values, setValues] = useState({
    ...defaultValues,
    ...initialValues,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValues((prev) => ({
      ...prev,
      [name]:
        name === "durationMin" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!values.name || !values.durationMin || !values.price) {
      setError("Nombre, duracion y precio son campos obligatorios.");
      return;
    }

    try {
      await onSubmit({
        name: values.name,
        category: values.category,
        durationMin: Number(values.durationMin),
        price: Number(values.price),
        status: values.status ?? "active",
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al guardar el servicio");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-text/80">
          Nombre del servicio
          <input
            name="name"
            type="text"
            placeholder="Corte premium"
            value={values.name}
            onChange={handleChange}
            className="rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-text/80">
          Categoria
          <input
            name="category"
            type="text"
            placeholder="Cortes"
            value={values.category ?? ""}
            onChange={handleChange}
            className="rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-text/80">
          Duracion (min)
          <input
            name="durationMin"
            type="number"
            min={15}
            step={5}
            value={values.durationMin}
            onChange={handleChange}
            className="rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-text/80">
          Precio (COP)
          <input
            name="price"
            type="number"
            min={0}
            step={5000}
            value={values.price}
            onChange={handleChange}
            className="rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-2 text-sm font-medium text-text/80">
        Estado
        <select
          name="status"
          value={values.status ?? "active"}
          onChange={handleChange}
          className="rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>
      </label>

      {error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
      </div>
    </form>
  );
};
