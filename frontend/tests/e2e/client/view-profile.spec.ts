import { test, expect } from "@playwright/test";

const mockClient = {
  token: "fake-token",
  user_id: "456",
  firstname: "Cliente",
  email: "client@test.com",
  roles: ["client"],
  isActive: true,
};

test.describe("Client - View Profile", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/auth/login", async (route) => {
      const body = await route.request().postDataJSON();
      if (body.email === "client@test.com" && body.password === "12345") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockClient),
        });
      } else {
        return route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Credenciales inválidas" }),
        });
      }
    });

    await page.goto("/login");
    await page.fill("#email", "client@test.com");
    await page.fill("#password", "12345");
    await page.click('button[type="submit"]');
  });

  test("✅ muestra correctamente la información del perfil", async ({ page }) => {
    await page.goto("/client/profile");
    await expect(page.getByRole("heading", { name: /mi perfil/i })).toBeVisible();
    await expect(page.getByText(/correo:/i)).toBeVisible();
    await expect(page.getByText(/cliente/i)).toBeVisible();
  });
});
