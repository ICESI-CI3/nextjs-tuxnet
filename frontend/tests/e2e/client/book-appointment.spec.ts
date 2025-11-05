import { test, expect } from '@playwright/test';

test.describe('Cliente - Reserva de citas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'client@test.com');
    await page.fill('input[name="password"]', 'client123');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Bienvenido')).toBeVisible();
  });

  test('Formulario de reserva visible', async ({ page }) => {
    await page.goto('/client/book-appointment');
    await expect(page.getByRole('heading', { name: /reservar cita/i })).toBeVisible();
    await expect(page.getByLabel(/servicio/i)).toBeVisible();
    await expect(page.getByLabel(/fecha/i)).toBeVisible();
    await expect(page.getByLabel(/hora/i)).toBeVisible();
  });

  test('Crear reserva', async ({ page }) => {
    await page.goto('/client/book-appointment');
    await page.getByLabel(/servicio/i).selectOption({ index: 0 });
    await page.getByLabel(/fecha/i).fill('2025-11-10');
    await page.getByLabel(/hora/i).fill('10:30');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Cita reservada correctamente')).toBeVisible();
  });

});
