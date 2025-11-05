import { test, expect } from '@playwright/test';

test.describe('Autenticación', () => {

  test('Login exitoso', async ({ page }) => {
    await page.goto('/login');
    const emailInput = page.locator('input[name="email"], input[placeholder*="correo"]');
    const passwordInput = page.locator('input[name="password"], input[placeholder*="contraseña"]');
    const loginButton = page.locator('button:has-text("Iniciar sesión")');

    await emailInput.fill('admin@test.com');
    await passwordInput.fill('admin123');
    await loginButton.click();

    await expect(page.locator('text=Panel administrativo')).toBeVisible();
  });

  test('Registro de usuario', async ({ page }) => {
    await page.goto('/register');

    const firstname = page.locator('input[name="firstname"], input[placeholder*="nombre"]');
    const lastname = page.locator('input[name="lastname"], input[placeholder*="apellido"]');
    const email = page.locator('input[name="email"], input[placeholder*="correo"]');
    const password = page.locator('input[name="password"], input[placeholder*="contraseña"]');
    const registerButton = page.locator('button:has-text("Registrar")');

    const dynamicEmail = `user_${Date.now()}@example.com`;

    await firstname.fill('Test');
    await lastname.fill('User');
    await email.fill(dynamicEmail);
    await password.fill('12345678');
    await registerButton.click();

    await expect(page.locator('text=Registro exitoso')).toBeVisible();
  });

});
