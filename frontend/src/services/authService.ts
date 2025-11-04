export const authService = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al iniciar sesión");
    }

    return await res.json(); // Debería devolver { token }
  },

  register: async (firstname: string, email: string, password: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstname, email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Error al registrar usuario");
    }

    return await res.json(); // Debería devolver el usuario creado o token
  },
};
