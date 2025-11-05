// tests/e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

const mockUser = {
  token: "fake-token",
  user_id: "123",
  firstname: "Admin",
  email: "admin@test.com",
  roles: ["admin"],
  isActive: true,
};

test.describe("Login de usuario", () => {
  test.beforeEach(async ({ page }) => {
    // Interceptar la llamada POST /auth/login
    await page.route("**/auth/login", async (route) => {
      const body = await route.request().postDataJSON();
      if (body.email === "admin@test.com" && body.password === "12345") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockUser),
        });
      } else {
        return route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Credenciales inválidas" }),
        });
      }
    });
  });

  test("permite iniciar sesión correctamente", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "admin@test.com");
    await page.fill("#password", "1234567890");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Iniciar sesión")).toBeVisible();
    await expect(page.locator("p:text('¿Aún no tienes cuenta?')")).toBeVisible();
  });

  test("muestra error si las credenciales son incorrectas", async ({ page }) => {
    await page.goto("/login");

    await page.fill("#email", "fake@user.com");
    await page.fill("#password", "wrongpass");
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Credenciales inválidas")).toBeVisible();
  });
});
