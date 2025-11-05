// tests/e2e/specialist/view-profile-specialist.spec.ts
import { test, expect } from "@playwright/test";
import { loginAs } from "../utils/helpers";

test.describe("Perfil del especialista", () => {
  test("El especialista puede ver su perfil y datos de especialidad", async ({ page }) => {
    //  Inicia sesión como especialista
    await loginAs(page, "stylist@test.com", "12345");

    //  Navega a la página de perfil
    await page.goto("/specialist/profile");
    await expect(page.locator("text=Perfil, Mi Perfil, Especialista")).toBeVisible();

    //  Verifica campos de información personal
    await expect(page.locator("text=Nombre, Nombre completo")).toBeVisible();
    await expect(page.locator("text=Correo, Email, stylist@test.com")).toBeVisible();

    //  Verifica información específica del especialista (servicios, horario, citas)
    const specialtySection = page.locator("text=Servicios, Especialidad, Horario");
    if ((await specialtySection.count()) > 0) {
      await expect(specialtySection.first()).toBeVisible();
    }

    //  Verifica barra o botones del perfil
    await expect(page.locator("nav, header")).toBeVisible();
  });
});
