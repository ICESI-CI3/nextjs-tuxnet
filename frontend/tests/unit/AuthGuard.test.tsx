import { render } from "@testing-library/react";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuthStore } from "@/store/useAuthStore";

jest.mock("@/store/useAuthStore");

describe("AuthGuard", () => {
  it("redirige si no hay token", () => {
    (useAuthStore as jest.Mock).mockReturnValue({ token: null });
    render(
      <AuthGuard>
        <div>Contenido protegido</div>
      </AuthGuard>
    );
    // Aquí podrías simular redirección con next/router mockeado
  });
});
