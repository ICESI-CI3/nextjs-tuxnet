// tests/e2e/specialist/view-appointments.spec.ts
import { test, expect } from '@playwright/test';

test('El especialista ve sus citas del día', async ({ page }) => {
  await page.goto('/specialist/appointment');

  await expect(page.locator('text=Citas de hoy')).toBeVisible();

  const appointments = page.locator('.AppointmentCard');
  const count = await appointments.count();

  // Verificamos que haya al menos una cita
  expect(count).toBeGreaterThan(0);
});
