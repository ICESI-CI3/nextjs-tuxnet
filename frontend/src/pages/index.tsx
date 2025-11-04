import { LoginForm } from "@/components/forms/LoginForm";
import { RegisterForm } from "@/components/forms/RegisterForm";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center relative overflow-hidden">
      {/*  Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-primary opacity-10 rounded-b-[50%]" />

      {/*  Logo y título */}
      <div className="text-center mb-10 z-10">
        <Image
          src="/logo.jpg"
          alt="Logo BellezaTotal"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-primary">BellezaTotal 💅</h1>
        <p className="text-gray-600">
          Tu espacio de bienestar, belleza y cuidado personal.
        </p>
      </div>

      {/*  Contenedor de formularios (lado a lado en pantallas grandes) */}
      <div className="z-10 bg-white shadow-2xl rounded-2xl p-10 flex flex-col md:flex-row gap-16 items-start justify-center max-w-5xl w-full mx-auto">
        {/*  Iniciar sesión */}
        <div className="flex flex-col items-center md:items-end w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-primary mb-4">Inicia Sesión</h2>
          <LoginForm />
        </div>

        {/*  Línea divisoria vertical (solo visible en desktop) */}
        <div className="hidden md:block h-72 w-[1px] bg-neutral/60" />

        {/*  Registro */}
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2">
          <h2 className="text-2xl font-bold text-primary mb-4">Regístrate</h2>
          <RegisterForm />
        </div>
      </div>

      {/*  Footer */}
      <footer className="mt-10 text-sm text-gray-500 z-10">
        © {new Date().getFullYear()} BellezaTotal — Todos los derechos reservados
      </footer>
    </div>
  );
}
