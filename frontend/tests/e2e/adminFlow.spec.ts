import { test, expect } from "@playwright/test";

test("flujo del administrador", async ({ page }) => {
  await page.goto("/");
  await page.fill('input[placeholder="Correo electrónico"]', "admin@test.com");
  await page.fill('input[placeholder="Contraseña"]', "123456789");
  await page.click("button:has-text('Iniciar sesión')");

  await expect(page).toHaveURL(/admin/);
  await expect(page.locator("text=Servicios")).toBeVisible();
  await page.click("text=Usuarios");
  await expect(page).toHaveURL(/users/);
});
