// tests/e2e/auth/login.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Inicio de sesión', () => {
  test('Debe iniciar sesión correctamente con credenciales válidas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'juan.perez@example.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/client/);
  });

  test('Debe mostrar error con credenciales incorrectas', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'noexiste@example.com');
    await page.fill('input[name="password"]', '12345678');
    await page.click('button[type="submit"]');

    await expect(page.locator('text=credenciales inválidas')).toBeVisible();
  });
});
