"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

const normalizeRoles = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.map((role) => String(role));
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "" || trimmed === "{}") return [];
    return [trimmed];
  }
  return [];
};

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      const roles = normalizeRoles(data.roles);
      login(data.token, {
        id: data.user_id,
        firstname: data.firstname ?? data.name ?? "",
        email: data.email,
        roles,
        isActive: data.isActive ?? true,
      });
      router.replace("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-text/80"
        >
          Correo electrónico
        </label>
        <input
          id="email"
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
          htmlFor="password"
          className="block text-sm font-medium text-text/80"
        >
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-neutral/30 px-4 py-3 text-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          required
          autoComplete="current-password"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Ingresando..." : "Iniciar sesión"}
      </button>

      <p className="text-center text-xs text-text/60">
        ¿Aún no tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Crea una ahora
        </Link>
      </p>
    </form>
  );
};

export { LoginForm };
