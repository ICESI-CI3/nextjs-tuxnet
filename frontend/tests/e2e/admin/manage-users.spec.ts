// tests/e2e/admin/manage-users.spec.ts
import { test, expect } from '@playwright/test';

test('El admin puede ver lista de usuarios', async ({ page }) => {
  await page.goto('/admin/users');

  await expect(page.locator('text=Clientes')).toBeVisible();

  await page.click('text=Especialistas');

  const userCards = page.locator('.UserCard');
  const count = await userCards.count();

  // Comprobamos que haya al menos 1 usuario
  expect(count).toBeGreaterThan(0);
});
