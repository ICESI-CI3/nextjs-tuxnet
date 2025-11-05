import { render, screen, fireEvent } from "@testing-library/react";
import { LoginForm } from "@/components/forms/LoginForm";

describe("LoginForm", () => {
  it("muestra los campos de correo y contraseña", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText(/correo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });

  it("muestra error si se envía vacío", async () => {
    render(<LoginForm />);
    fireEvent.click(screen.getByRole("button"));
    expect(await screen.findByText(/error/i)).toBeInTheDocument();
  });
});
