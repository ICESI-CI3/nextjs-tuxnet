import { render, screen } from "@testing-library/react";
import { ClientNavbar } from "@/components/navbar/ClientNavbar";

describe("ClientNavbar", () => {
  it("muestra enlaces principales", () => {
    render(<ClientNavbar />);
    expect(screen.getByText(/mis reservas/i)).toBeInTheDocument();
    expect(screen.getByText(/mi perfil/i)).toBeInTheDocument();
  });
});
