import { useForm } from "react-hook-form";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login, restoreSession, user } = useAuthStore();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await authService.login(data.email, data.password);
      login(res.access_token);
      router.push("/dashboard");
    } catch (err) {
      alert("Credenciales inválidas o error en el servidor");
    }
  };

  useEffect(() => {
    restoreSession();
    if (user) router.push("/dashboard");
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h1 className="text-xl font-bold mb-4 text-center text-pink-600">
          BellezaTotal - Iniciar Sesión
        </h1>

        <input
          {...register("email")}
          type="email"
          placeholder="Correo electrónico"
          className="border w-full p-2 mb-3 rounded"
        />
        <input
          {...register("password")}
          type="password"
          placeholder="Contraseña"
          className="border w-full p-2 mb-4 rounded"
        />

        <button
          type="submit"
          className="bg-pink-500 text-white w-full p-2 rounded hover:bg-pink-600 transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
