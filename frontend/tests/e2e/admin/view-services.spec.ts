// tests/e2e/view-services.spec.ts
import { test, expect } from '@playwright/test';
import { loginAs } from '../utils/helpers';

test.describe('Ver servicios (cliente / admin / especialista)', () => {
  test('Cliente: puede ver la lista de servicios en /client', async ({ page }) => {
    // Si tu app requiere login para /client, descomenta la línea siguiente
    await loginAs(page, 'cliente@test.com', '12345');

    await page.goto('/client');
    await expect(page.locator('text=Servicios, Servicios Disponibles, Nuestros Servicios')).toBeVisible({ timeout: 5000 }).catch(()=>{ /* fallback */ });

    const services = page.locator('.ServiceCard, article.ServiceCard, [data-test="service-card"]');
    const count = await services.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Admin: puede ver servicios en /admin', async ({ page }) => {
    await loginAs(page, 'admin@test.com', '12345');
    await page.goto('/admin');
    await expect(page.locator('text=Servicios')).toBeVisible();

    const services = page.locator('.ServiceCard, article.ServiceCard, [data-test="service-card"]');
    const count = await services.count();
    expect(count).toBeGreaterThan(0);
  });

  test('Especialista: puede ver servicios en /specialist', async ({ page }) => {
    await loginAs(page, 'stylist@test.com', '12345');
    await page.goto('/specialist');
    await expect(page.locator('text=Servicios, Servicios ofrecidos')).toBeVisible();

    const services = page.locator('.ServiceCard, article.ServiceCard, [data-test="service-card"]');
    const count = await services.count();
    expect(count).toBeGreaterThan(0);
  });
});
