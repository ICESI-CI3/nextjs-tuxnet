// tests/e2e/auth/register.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Registro de usuario", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/auth/register", async (route) => {
      const body = await route.request().postDataJSON();
      if (body.email === "existe@test.com") {
        return route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ message: "El correo ya está registrado" }),
        });
      } else {
        return route.fulfill({
          status: 201,
          contentType: "application/json",
          body: JSON.stringify({
            id: "fake-id",
            firstname: body.firstname,
            email: body.email,
          }),
        });
      }
    });
  });

  test("permite registrar un nuevo usuario", async ({ page }) => {
    await page.goto("/register");
    await page.fill("#firstname", "Alejandro");
    await page.fill("#register-email", "nuevo@test.com");
    await page.fill("#register-password", "1234567800");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Registro exitoso")).toBeVisible();
  });

  test("muestra error si el correo ya existe", async ({ page }) => {
    await page.goto("/register");
    await page.fill("#firstname", "Alejandro");
    await page.fill("#register-email", "existe@test.com");
    await page.fill("#register-password", "12345678");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=El correo ya está registrado")).toBeVisible();
  });
});
