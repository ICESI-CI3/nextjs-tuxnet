import { render, screen, fireEvent } from "@testing-library/react";
import { RegisterForm } from "@/components/forms/RegisterForm";

describe("RegisterForm", () => {
  it("renderiza campos de nombre, email y contraseña", () => {
    render(<RegisterForm />);
    expect(screen.getByPlaceholderText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });
});
