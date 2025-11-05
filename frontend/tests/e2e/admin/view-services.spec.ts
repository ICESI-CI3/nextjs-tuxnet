import { test, expect, Page, Route } from "@playwright/test";
import { mockAdminSession } from "../utils/session";

test.describe("Admin - Gestión de Servicios", () => {
  const mockServices = [
    { id: "1", name: "Corte", price: 20000, durationMin: 30 },
    { id: "2", name: "Manicure", price: 30000, durationMin: 45 },
  ];

  async function setupMock(page: Page) {
    await mockAdminSession(page);
    await page.route("**/services", async (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockServices),
      })
    );
  }

  test("✅ muestra correctamente la tabla de servicios", async ({ page }) => {
    await setupMock(page);
    await page.goto("/admin/services");

    await expect(page.locator("text=Servicios del salon")).toBeVisible();
    const rows = page.locator("tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test("✅ puede eliminar un servicio con confirmación", async ({ page }) => {
    await setupMock(page);
    await page.goto("/admin/services");

    // simular confirmación del diálogo
    page.once("dialog", (dialog) => dialog.accept());
    await page.click("text=Eliminar");
    await expect(page.locator("text=Servicio eliminado correctamente")).toBeVisible();
  });

  test("❌ muestra mensaje de error si falla el backend", async ({ page }) => {
    await mockAdminSession(page);
    await page.route("**/services", async (route: Route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Error al cargar los servicios" }),
      })
    );

    await page.goto("/admin/services");
    await expect(page.locator("text=Error al cargar los servicios")).toBeVisible();
  });
});
