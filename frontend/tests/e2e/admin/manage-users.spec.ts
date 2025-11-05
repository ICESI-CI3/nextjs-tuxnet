// tests/e2e/admin/manage-users.spec.ts
import { test, expect } from '@playwright/test';

test('El admin puede ver lista de usuarios (mock)', async ({ page }) => {
  // Interceptamos la llamada a la API que devuelve usuarios
  await page.route('**/users', async (route) => {
    const mockUsers = [
      { id: 1, name: 'Ana López', role: 'cliente' },
      { id: 2, name: 'Juan Pérez', role: 'especialista' },
      { id: 3, name: 'Laura Gómez', role: 'cliente' },
    ];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockUsers),
    });
  });

  // Navegamos a la página del admin
  await page.goto('/admin/users');

  // Verificamos elementos del panel
  await expect(page.locator('text=Clientes')).toBeVisible();
  await page.click('text=Especialistas');

  // Contamos las tarjetas renderizadas
  const userCards = page.locator('.UserCard');
  const count = await userCards.count();

  // Verificamos que se hayan mostrado los usuarios del mock
  expect(count).toBeGreaterThan(0);
});
