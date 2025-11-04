import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import * as jwt_decode from "jwt-decode";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      login(data.token);
      // Redirigir según el rol
      const decoded: any = (jwt_decode as any)(data.token);
      const roles = Array.isArray(decoded.roles) ? decoded.roles : [decoded.roles];

      if (roles.includes("admin")) router.push("/admin");
      else if (roles.includes("client")) router.push("/client");
      else if (roles.includes("stylist")) router.push("/especialista");
    } catch (error: any) {
      alert(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-neutral rounded-lg shadow-md p-6 w-72 flex flex-col gap-3"
    >
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded focus:border-primary focus:ring-1 focus:ring-primary"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded focus:border-primary focus:ring-1 focus:ring-primary"
        required
      />
      <button
        type="submit"
        className="bg-primary text-white py-2 rounded hover:bg-accent transition"
      >
        Iniciar sesión
      </button>
    </form>
  );
};

export { LoginForm };
