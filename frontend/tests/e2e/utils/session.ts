// tests/utils/session.ts
import type { Page } from "@playwright/test";

/**
 * Simula una sesión de administrador en localStorage.
 * Debe llamarse después de page.goto("/") para que el contexto exista.
 */
export async function mockAdminSession(page: Page) {
  await page.goto("/"); // asegura que localStorage esté disponible

  await page.evaluate(() => {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        token: "fake-token",
        user: {
          id: "1",
          firstname: "Admin",
          email: "admin@test.com",
          roles: ["admin"],
        },
      })
    );
  });
}
