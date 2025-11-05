"use client";

import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { appointmentService } from "@/services/appointmentService";
import { serviceService } from "@/services/serviceService"; // Service fetch

export interface BookingFormProps {
  serviceId: string;
  serviceName: string;
  onSuccess?: () => void;
}

interface ServiceUser {
  id: string;
  firstname: string;
  email: string;
}

export const BookingForm = ({
  serviceId,
  serviceName,
  onSuccess,
}: BookingFormProps) => {
  const [startAt, setStartAt] = useState(
    dayjs()
      .add(1, "day")
      .hour(10)
      .minute(0)
      .second(0)
      .millisecond(0)
      .format("YYYY-MM-DDTHH:mm")
  );
  const [notes, setNotes] = useState("");
  const [users, setUsers] = useState<ServiceUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  // Fetch service users
  useEffect(() => {
    const fetchServiceUsers = async () => {
      try {
        const service = await serviceService.getById(serviceId);
        const serviceUsers: ServiceUser[] = service.users || [];
        setUsers(serviceUsers);
        if (serviceUsers.length > 0) {
          setSelectedUserId(serviceUsers[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch service users:", error);
      }
    };
    fetchServiceUsers();
  }, [serviceId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      await appointmentService.create({
        serviceId,
        startAt: dayjs(startAt).toISOString(), // send ISO 8601
        staffId: selectedUserId,
        notes: notes.trim() || undefined,
      });
      setFeedback({
        type: "success",
        text: "Tu cita fue agendada correctamente.",
      });
      setNotes("");
      if (onSuccess) onSuccess();
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "No pudimos agendar la cita. Intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      {/* Date & Time */}
      <div className="space-y-2">
        <label
          htmlFor="startAt"
          className="block text-sm font-medium text-text/80"
        >
          Selecciona la fecha y hora
        </label>
        <input
          id="startAt"
          type="datetime-local"
          value={startAt}
          onChange={(event) => setStartAt(event.target.value)}
          min={dayjs().format("YYYY-MM-DDTHH:mm")}
          required
          className="w-full rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Staff Selection */}
      {users.length > 0 && (
        <div className="space-y-2">
          <label
            htmlFor="staff"
            className="block text-sm font-medium text-text/80"
          >
            Selecciona un Estilista
          </label>
          <select
            id="staff"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            required
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstname} ({user.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Notes */}
      <div className="space-y-2">
        <label htmlFor="notes" className="block text-sm font-medium text-text/80">
          Notas adicionales
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder={`Comparte detalles para ${serviceName}`}
          rows={4}
          className="w-full rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Reservando..." : "Reservar cita"}
      </button>
    </form>
  );
};
