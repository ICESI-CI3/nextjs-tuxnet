import { useState } from "react";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await authService.login(email, password);
      login(data.token);
      alert("Inicio de sesión exitoso");
    } catch (error: any) {
      alert(error.message || "Error al iniciar sesión");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-white p-6 rounded shadow-md w-72"
    >
      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
      >
        Iniciar sesión
      </button>
    </form>
  );
};
