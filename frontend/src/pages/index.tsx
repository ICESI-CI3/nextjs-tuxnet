import { LoginForm } from "@/components/forms/LoginForm";
import { RegisterForm } from "@/components/forms/RegisterForm";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center relative overflow-hidden">
      {/* Banner decorativo */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-primary opacity-10 rounded-b-[50%]" />

      {/* Contenedor principal */}
      <div className="z-10 bg-white shadow-2xl rounded-2xl p-10 flex flex-col md:flex-row gap-12 md:gap-24 items-center justify-center">
        {/* Lado izquierdo (branding o imagen) */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start">
          <Image
            src="/logo.png"
            alt="Logo BellezaTotal"
            width={120}
            height={120}
            className="mb-4"
          />
          <h1 className="text-4xl font-bold text-primary mb-2">
            BellezaTotal 💅
          </h1>
          <p className="text-text max-w-xs">
            Tu espacio de bienestar, belleza y cuidado personal. Regístrate o
            inicia sesión para reservar tus servicios favoritos.
          </p>
        </div>

        {/* Formularios */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-primary mb-3">
              Inicia Sesión
            </h2>
            <LoginForm />
          </div>
          <div className="flex flex-col items-center">
            <h2 className="text-lg font-semibold text-primary mb-3">
              Regístrate
            </h2>
            <RegisterForm />
          </div>
        </div>
      </div>

      {/* Detalle inferior */}
      <footer className="mt-10 text-sm text-gray-500 z-10">
        © {new Date().getFullYear()} BellezaTotal — Todos los derechos reservados
      </footer>
    </div>
  );
}
