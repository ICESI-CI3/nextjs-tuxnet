// tests/e2e/bellezatotal.spec.ts
import { test, expect } from "@playwright/test";

test.describe("BellezaTotal E2E Tests", () => {

  // =======================
  // Autenticación
  // =======================
  test.describe("Login y Registro", () => {
    test("Login exitoso como admin", async ({ page }) => {
      await page.goto("/login");
      await page.fill("#email", "admin@test.com");
      await page.fill("#password", "admin123");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Panel administrativo")).toBeVisible();
    });

    test("Login falla con credenciales inválidas", async ({ page }) => {
      await page.goto("/login");
      await page.fill("#email", "wrong@test.com");
      await page.fill("#password", "wrong123");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Error al iniciar sesión")).toBeVisible();
    });

    test("Login muestra error de servidor", async ({ page }) => {
      await page.route("**/auth/login", async (route) => {
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ message: "Error interno del servidor" }),
        });
      });
      await page.goto("/login");
      await page.fill("#email", "admin@test.com");
      await page.fill("#password", "admin123");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Error interno del servidor")).toBeVisible();
    });

    test("Register exitoso", async ({ page }) => {
      await page.goto("/register");
      await page.fill('input[name="email"]', "newuser@test.com");
      await page.fill('input[name="password"]', "12345678");
      await page.fill('input[name="firstname"]', "Nuevo");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Bienvenida de nuevo")).toBeVisible();
    });
  });

  // =======================
  // Admin
  // =======================
  test.describe("Admin - Gestión de usuarios", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill("#email", "admin@test.com");
      await page.fill("#password", "admin123");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Panel administrativo")).toBeVisible();
    });

    test("Visualiza tabla de usuarios", async ({ page }) => {
      await page.goto("/admin/users");
      await expect(page.locator("table")).toBeVisible();
    });

    test("Filtra usuarios por rol", async ({ page }) => {
      await page.goto("/admin/users");
      await page.selectOption('select[name="role"], select[aria-label*="rol"]', "client");
      await expect(page.locator("table")).toContainText("cliente");
    });

    test("Crear nuevo usuario", async ({ page }) => {
      await page.goto("/admin/users/new");
      await page.fill('input[name="email"]', "cliente2@test.com");
      await page.fill('input[name="firstname"]', "Cliente2");
      await page.selectOption('select[name="role"]', "client");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Usuario creado correctamente")).toBeVisible();
    });
  });

  // =======================
  // Cliente
  // =======================
  test.describe("Cliente - Reserva de citas", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.fill('input[name="email"]', "client@test.com");
      await page.fill('input[name="password"]', "client123");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Bienvenido")).toBeVisible();
    });

    test("Formulario de reserva visible", async ({ page }) => {
      await page.goto("/client/book-appointment");
      await expect(page.getByRole("heading", { name: /reservar cita/i })).toBeVisible();
      await expect(page.getByLabel(/servicio/i)).toBeVisible();
      await expect(page.getByLabel(/fecha/i)).toBeVisible();
      await expect(page.getByLabel(/hora/i)).toBeVisible();
    });

    test("Crear reserva", async ({ page }) => {
      await page.goto("/client/book-appointment");
      await page.getByLabel(/servicio/i).selectOption({ index: 0 });
      await page.getByLabel(/fecha/i).fill("2025-11-10");
      await page.getByLabel(/hora/i).fill("10:30");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=Cita reservada correctamente")).toBeVisible();
    });

    test("Filtrar reservas por estado", async ({ page }) => {
      await page.goto("/client/appointment");
      await page.click('button:has-text("Pendientes")');
      await expect(page.locator("text=Pendiente")).toBeVisible();
    });
  });
});
