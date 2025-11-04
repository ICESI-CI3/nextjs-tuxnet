import { useState } from "react";
import { authService } from "@/services/authService";

export const RegisterForm = () => {
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.register(firstname, email, password);
      alert("Usuario registrado correctamente");
    } catch (error: any) {
      alert(error.message || "Error al registrar usuario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-white p-6 rounded shadow-md w-72"
    >
      <input
        type="text"
        placeholder="Nombre"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        className="border p-2 rounded"
        required
      />
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
        Registrarse
      </button>
    </form>
  );
};
