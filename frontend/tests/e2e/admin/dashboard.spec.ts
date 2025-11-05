import { test, expect, Page, Route } from "@playwright/test";
import { mockAdminSession } from "../utils/session";

test.describe("Admin - Tablero general", () => {
  async function setupMocks(page: Page) {
    await mockAdminSession(page);

    await page.route("**/services", async (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: "1", name: "Corte", price: 20000 }]),
      })
    );
    await page.route("**/appointments", async (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([{ id: "1", scheduledAt: "2025-11-05T10:00:00Z" }]),
      })
    );
    await page.route("**/users", async (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify([
          { id: "1", firstname: "Ana", roles: ["client"] },
          { id: "2", firstname: "Luis", roles: ["stylist"] },
        ]),
      })
    );
  }

  test("✅ muestra métricas y estadísticas del tablero", async ({ page }) => {
    await setupMocks(page);
    await page.goto("/admin");

    await expect(page.locator("text=Panel administrativo")).toBeVisible();
    await expect(page.locator("text=Servicios activos")).toBeVisible();
    await expect(page.locator("text=Reservas registradas")).toBeVisible();
  });

  test("❌ muestra error si alguna llamada falla", async ({ page }) => {
    await mockAdminSession(page);

    await page.route("**/services", async (route: Route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Error cargando información" }),
      })
    );

    await page.goto("/admin");

    // usa expresión flexible para coincidir con cualquier error similar
    await expect(page.locator("text=/Error cargando/i")).toBeVisible();
  });
});
