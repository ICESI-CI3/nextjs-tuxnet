// tests/e2e/utils/helpers.ts
import { Page } from '@playwright/test';

export async function loginAs(page: Page, email: string, password: string) {
  await page.goto('/login');

  // Ajusta los selectores si tu formulario usa name/id distintos
  await page.fill('input[name="email"], input#email, input[placeholder*="correo"], input[placeholder*="Correo"]', email);
  await page.fill('input[name="password"], input#password, input[placeholder*="Contraseña"], input[placeholder*="••"]', password);
  await page.click('button[type="submit"], button:has-text("Iniciar sesión")');

  // Espera a que la app redirija (puede variar)
  await page.waitForLoadState('networkidle');
}
