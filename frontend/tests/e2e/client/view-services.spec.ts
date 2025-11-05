import { test, expect } from "@playwright/test";

const mockClient = {
  token: "fake-token",
  user_id: "456",
  firstname: "Cliente",
  email: "client@test.com",
  roles: ["client"],
  isActive: true,
};

test.describe("Client - View Services", () => {
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

  test("✅ muestra lista de servicios disponibles", async ({ page }) => {
    await page.goto("/client/services");
    await expect(page.getByRole("heading", { name: /servicios disponibles/i })).toBeVisible();

    const services = page.locator(".service-card");
    const count = await services.count();
    expect(count).toBeGreaterThan(0);
  });
});
