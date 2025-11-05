import { test, expect, Page, Route } from "@playwright/test";
import { mockAdminSession } from "../utils/session";

test.describe("Admin - Gestión de Usuarios", () => {
  const mockUsers = [
    {
      id: "1",
      firstname: "Laura",
      email: "laura@test.com",
      roles: ["client"],
      isActive: true,
    },
    {
      id: "2",
      firstname: "Pedro",
      email: "pedro@test.com",
      roles: ["stylist"],
      isActive: false,
    },
  ];

  async function setupMock(page: Page) {
    await mockAdminSession(page);
    await page.route("**/users", async (route: Route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockUsers),
      })
    );
  }

  test("✅ muestra correctamente la tabla de usuarios", async ({ page }) => {
    await setupMock(page);
    await page.goto("/admin/users");

    await expect(page.locator("text=Gestión de usuarios")).toBeVisible();
    await expect(page.locator("text=Cliente")).toBeVisible();
    await expect(page.locator("text=Especialista")).toBeVisible();

    const rows = page.locator("tbody tr");
    expect(await rows.count()).toBeGreaterThan(0);
  });

  test("✅ puede filtrar usuarios por rol", async ({ page }) => {
    await setupMock(page);
    await page.goto("/admin/users");

    await page.getByRole("button", { name: "Especialista" }).click();
    const rows = page.locator("tbody tr");
    expect(await rows.count()).toBe(1);
    await expect(page.locator("text=Pedro")).toBeVisible();
  });

  test("❌ muestra mensaje de error si falla el backend", async ({ page }) => {
    await mockAdminSession(page);
    await page.route("**/users", async (route: Route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Error al obtener los usuarios" }),
      })
    );

    await page.goto("/admin/users");
    await expect(page.locator("text=Error al obtener los usuarios")).toBeVisible();
  });
});
