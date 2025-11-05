// tests/e2e/admin/view-profile-admin.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Perfil del administrador (mock)", () => {
  test("El admin puede ver su información de perfil", async ({ page }) => {
    // 🧩 1. Interceptamos la llamada al endpoint de perfil
    await page.route("**/auth/profile", async (route) => {
      const mockProfile = {
        id: 1,
        name: "Administrador General",
        email: "admin@test.com",
        role: "admin",
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockProfile),
      });
    });

    // 🧩 2. Interceptamos la llamada al login (por si tu frontend lo hace antes)
    await page.route("**/auth/login", async (route) => {
      const mockLogin = {
        token: "fake-token",
        user: {
          id: 1,
          email: "admin@test.com",
          role: "admin",
        },
      };
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockLogin),
      });
    });

    // 🧩 3. Simulamos que el usuario está logueado
    await page.goto("/login");
    await page.evaluate(() => {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          token: "fake-token",
          user: {
            id: 1,
            name: "Administrador General",
            email: "admin@test.com",
            role: "admin",
          },
        })
      );
    });

    // 🧩 4. Navegamos a la página de perfil
    await page.goto("/admin/profile");

    // 🧩 5. Verificamos el contenido esperado
    await expect(
      page.locator("text=Perfil, Mi Perfil, Administrador")
    ).toBeVisible({ timeout: 5000 });

    await expect(page.locator("text=Administrador General")).toBeVisible();
    await expect(page.locator("text=admin@test.com")).toBeVisible();

    // 🧩 6. Comprobamos presencia del botón de editar (si aplica)
    const editBtn = page.locator("button:has-text('Editar'), text=Actualizar");
    if ((await editBtn.count()) > 0) {
      await expect(editBtn.first()).toBeVisible();
    }

    // 🧩 7. Verificamos que haya un navbar o header
    await expect(page.locator("nav, header")).toBeVisible();
  });
});
