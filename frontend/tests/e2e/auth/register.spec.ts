// tests/e2e/auth/register.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Registro de usuarios', () => {
  test('Debe registrar un nuevo cliente con datos válidos', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="firstname"]', 'Juan Pérez');
    await page.fill('input[name="email"]', 'juan.perez@example.com');
    await page.fill('input[name="password"]', '12345678');

    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/client/);
  });

  test('Debe mostrar error si el correo ya está registrado', async ({ page }) => {
    await page.goto('/register');

    await page.fill('input[name="firstname"]', 'Juan Pérez');
    await page.fill('input[name="email"]', 'juan.perez@example.com');
    await page.fill('input[name="password"]', '12345678');

    await page.click('button[type="submit"]');

    await expect(page.locator('text=correo ya registrado')).toBeVisible();
  });
});
