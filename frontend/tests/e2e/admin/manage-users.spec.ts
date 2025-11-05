import { test, expect } from '@playwright/test';

test.describe('Admin - Gestión de usuarios', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="email"]').fill('admin@test.com');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button:has-text("Iniciar sesión")').click();
    await expect(page.locator('text=Panel administrativo')).toBeVisible();
  });

  test('Visualiza tabla de usuarios', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('table')).toBeVisible();
  });

  test('Filtra usuarios por rol', async ({ page }) => {
    await page.goto('/admin/users');
    const roleSelect = page.locator('select[name="role"], select[aria-label*="rol"]');
    await roleSelect.selectOption('cliente');
    await expect(page.locator('table')).toContainText('cliente');
  });

});
