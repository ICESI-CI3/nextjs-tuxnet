import { test, expect } from "@playwright/test";

test("flujo completo del cliente", async ({ page }) => {
  await page.goto("/");
  await page.fill('input[placeholder="Correo electrónico"]', "cliente@test.com");
  await page.fill('input[placeholder="Contraseña"]', "123456789");
  await page.click("button:has-text('Iniciar sesión')");

  await expect(page).toHaveURL(/client/);
  await expect(page.locator("text=Nuestros Servicios")).toBeVisible();
});
