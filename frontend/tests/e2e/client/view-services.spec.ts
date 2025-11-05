// tests/e2e/client/view-services.spec.ts
import { test, expect } from '@playwright/test';

test('El cliente puede ver la lista de servicios', async ({ page }) => {
  await page.goto('/client');
  await expect(page.locator('text=Servicios')).toBeVisible();

  const services = page.locator('.ServiceCard');
  const count = await services.count();

  // Verificamos que haya al menos un servicio disponible
  expect(count).toBeGreaterThan(0);
});
