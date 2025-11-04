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
      alert("Registro exitoso 🎉");
    } catch (error: any) {
      alert(error.message || "Error al registrar usuario");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-neutral rounded-lg shadow-md p-6 w-72 flex flex-col gap-3"
    >
      <input
        type="text"
        placeholder="Nombre completo"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        className="border p-2 rounded focus:border-primary focus:ring-1 focus:ring-primary"
        required
      />
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
        Registrarse
      </button>
    </form>
  );
};
