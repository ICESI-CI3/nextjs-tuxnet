// tests/e2e/client/book-appointment.spec.ts
import { test, expect } from '@playwright/test';

test('El cliente puede reservar un servicio', async ({ page }) => {
  await page.goto('/client/service/1');
  await page.click('button:has-text("Reservar")');
  await expect(page.locator('text=Reserva confirmada')).toBeVisible();
});
