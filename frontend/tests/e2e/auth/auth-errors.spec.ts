// tests/e2e/auth/auth-errors.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Errores de autenticación", () => {
  test("muestra error de servidor (500) en login", async ({ page }) => {
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ message: "Error interno del servidor" }),
      });
    });

    await page.goto("/login");
    await page.fill("#email", "admin@test.com");
    await page.fill("#password", "1234567890");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Error interno del servidor")).toBeVisible();
  });

  test("muestra validación si se deja vacío el formulario", async ({ page }) => {
    await page.goto("/login");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Error al iniciar sesión")).toBeVisible();
  });
});
