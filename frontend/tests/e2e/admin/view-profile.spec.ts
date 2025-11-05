// tests/e2e/admin/view-profile-admin.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "../utils/helpers";

test.describe("Perfil del administrador", () => {
  test("El admin puede ver su información de perfil", async ({ page }) => {
    //  Inicia sesión como admin
    await loginAs(page, "admin@test.com", "12345");

    //  Navega al perfil del admin
    await page.goto("/admin/profile");
    await expect(page.locator("text=Perfil, Mi Perfil, Administrador")).toBeVisible();

    //  Verifica elementos clave en la UI
    await expect(page.locator("text=Nombre, Nombre completo")).toBeVisible();
    await expect(page.locator("text=Correo, Email, admin@test.com")).toBeVisible();

    //  Verifica la presencia de botones o secciones esperadas
    const editBtn = page.locator("button:has-text('Editar'), text=Actualizar");
    if ((await editBtn.count()) > 0) {
      await expect(editBtn.first()).toBeVisible();
    }

    //  Verifica navegación o barra de usuario
    await expect(page.locator("nav, header")).toBeVisible();
  });
});
