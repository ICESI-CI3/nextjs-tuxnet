"use client";

import Link from "next/link";
import { useState } from "react";
import { authService } from "@/services/authService";

export const RegisterForm = () => {
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      await authService.register(firstname, email, password);
      setSuccess("Registro exitoso. Ahora puedes iniciar sesión.");
      setFirstname("");
      setEmail("");
      setPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar usuario");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="firstname"
          className="block text-sm font-medium text-text/80"
        >
          Nombre completo
        </label>
        <input
          id="firstname"
          type="text"
          placeholder="Tu nombre"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          className="w-full rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
          autoComplete="name"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-text/80"
        >
          Correo electrónico
        </label>
        <input
          id="register-email"
          type="email"
          placeholder="tu-correo@ejemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-text/80"
        >
          Contraseña
        </label>
        <input
          id="register-password"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
          autoComplete="new-password"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-md bg-green-100 px-3 py-2 text-sm text-green-700">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Registrando..." : "Crear cuenta"}
      </button>

      <p className="text-center text-xs text-text/60">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
};
