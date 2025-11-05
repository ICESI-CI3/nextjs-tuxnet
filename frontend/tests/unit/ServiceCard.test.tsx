import { render, screen } from "@testing-library/react";
import { ServiceCard } from "@/components/ServiceCard";
import { Service } from "@/types/service";

const mockService: Service = {
  id: "1",
  name: "Corte de cabello",
  category: "Estética",
  durationMin: 30,
  price: 50000,
  status: "active",
  createdAt: "2025-01-01",
  updatedAt: "2025-01-01",
};

describe("ServiceCard", () => {
  it("muestra nombre, duración y precio", () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText("Corte de cabello")).toBeInTheDocument();
    expect(screen.getByText(/30 min/i)).toBeInTheDocument();
    expect(screen.getByText(/\$ ?50\.000/)).toBeInTheDocument();
  });
});
