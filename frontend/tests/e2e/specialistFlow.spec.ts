import { test, expect } from "@playwright/test";

test("flujo del especialista", async ({ page }) => {
  await page.goto("/");
  await page.fill('input[placeholder="Correo electrónico"]', "stylist@test.com");
  await page.fill('input[placeholder="Contraseña"]', "123456789");
  await page.click("button:has-text('Iniciar sesión')");

  await expect(page).toHaveURL(/specialist/);
  await expect(page.locator("text=Citas del día")).toBeVisible();
});
