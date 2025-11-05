import { test, expect, Page } from "@playwright/test";
import { mockAdminSession } from "../utils/session";

test.describe("Admin - Perfil", () => {
  test("✅ muestra datos del perfil correctamente", async ({ page }) => {
    await mockAdminSession(page);
    await page.goto("/admin/profile");

    await expect(page.locator("text=Perfil administrativo")).toBeVisible();
    await expect(page.locator("text=admin@test.com")).toBeVisible();
    await expect(page.locator("text=Administrador BellezaTotal")).toBeVisible();
  });

  test("✅ muestra roles activos", async ({ page }) => {
    await mockAdminSession(page);
    await page.goto("/admin/profile");

    await expect(page.locator("text=Roles activos")).toBeVisible();
    await expect(page.locator("text=ADMIN")).toBeVisible();
  });

  test("❌ maneja ausencia de usuario en localStorage", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.goto("/admin/profile");

    await expect(page.locator("text=Administrador BellezaTotal")).toBeVisible();
  });
});
