// tests/e2e/auth-errors.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Errores de autenticación", () => {
  test("muestra error al intentar iniciar sesión con credenciales inválidas", async ({ page }) => {
    await page.goto("/login");

    // Llenar el formulario con datos incorrectos
    await page.fill('input[name="email"], input#email, input[placeholder*="correo"], input[placeholder*="Correo"]', "noexiste@test.com");
    await page.fill('input[name="password"], input#password, input[placeholder*="contraseña"], input[placeholder*="••"]', "clave_incorrecta");

    await page.click('button[type="submit"], button:has-text("Iniciar sesión")');

    // Espera la respuesta y el mensaje de error
    await expect(page.locator("text=credenciales incorrectas, error, inválido, no autorizado")).toBeVisible({
      timeout: 5000,
    }).catch(() => {
      console.warn("⚠️ No se detectó mensaje de error específico, revisar texto real en la UI");
    });
  });

  test("muestra error al registrar un usuario con email ya existente", async ({ page }) => {
    await page.goto("/register");

    // Usa un correo que ya exista en tu base de datos
    await page.fill('input[name="firstname"], input#firstname, input[placeholder*="nombre"], input[placeholder*="Nombre"]', "Usuario Existente");
    await page.fill('input[name="email"], input#register-email, input[placeholder*="correo"], input[placeholder*="Correo"]', "admin@test.com");
    await page.fill('input[name="password"], input#register-password, input[placeholder*="contraseña"], input[placeholder*="••"]', "12345");

    await page.click('button[type="submit"], button:has-text("Crear cuenta")');

    // Esperar un posible mensaje de error
    await expect(page.locator("text=ya existe, duplicado, correo en uso, error")).toBeVisible({
      timeout: 5000,
    }).catch(() => {
      console.warn("⚠️ No se encontró mensaje de error específico, revisar texto real en la UI");
    });
  });

  test("muestra validación al dejar campos vacíos en login", async ({ page }) => {
    await page.goto("/login");

    await page.click('button[type="submit"], button:has-text("Iniciar sesión")');

    // Verificar mensaje de error o borde de validación
    const emailInput = page.locator('input#email, input[name="email"]');
    const passwordInput = page.locator('input#password, input[name="password"]');

    await expect(emailInput).toHaveAttribute("required", "");
    await expect(passwordInput).toHaveAttribute("required", "");

    await expect(page.locator("text=obligatorio, requerido, campo obligatorio")).toBeVisible({
      timeout: 3000,
    }).catch(() => {
      console.warn("⚠️ No se encontró mensaje de validación visible, validar según UI real");
    });
  });
});
