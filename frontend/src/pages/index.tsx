import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";

export default function HomePage() {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">
        Bienvenido a BellezaTotal 💅
      </h1>

      {user ? (
        <>
          <p className="text-gray-700 mb-4">
            Hola <span className="font-semibold">{user.firstname}</span>, tu rol es{" "}
            <span className="font-semibold">{user.roles.join(", ")}</span>.
          </p>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
          >
            Ir al Dashboard
          </Link>
        </>
      ) : (
        <>
          <p className="text-gray-600 mb-4">Por favor inicia sesión para continuar.</p>
          <Link
            href="/login"
            className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
          >
            Iniciar Sesión
          </Link>
        </>
      )}
    </div>
  );
}
