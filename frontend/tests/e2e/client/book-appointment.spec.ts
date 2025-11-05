import { test, expect } from "@playwright/test";

const mockClient = {
  token: "fake-token",
  user_id: "456",
  firstname: "Cliente",
  email: "client@test.com",
  roles: ["client"],
  isActive: true,
};

test.describe("Client - Book Appointment", () => {
  test.beforeEach(async ({ page }) => {
    // 1️⃣ Interceptar el login (mockeado)
    await page.route("**/auth/login", async (route) => {
      const body = await route.request().postDataJSON();
      if (body.email === "client@test.com" && body.password === "12345") {
        return route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify(mockClient),
        });
      } else {
        return route.fulfill({
          status: 401,
          contentType: "application/json",
          body: JSON.stringify({ message: "Credenciales inválidas" }),
        });
      }
    });

    // 2️⃣ Ir al login e iniciar sesión
    await page.goto("/login");
    await page.fill("#email", "client@test.com");
    await page.fill("#password", "12345");
    await page.click('button[type="submit"]');

    // 3️⃣ Esperar que redirija al dashboard de cliente
    await page.waitForURL(/client(\/dashboard)?/);
  });

  // 4️⃣ Test: verificar que se muestre el formulario
  test("✅ muestra el formulario de reserva", async ({ page }) => {
    await page.goto("/client/book-appointment");

    // Esperar que cargue el contenido
    await expect(page.getByRole("heading", { name: /reservar cita/i })).toBeVisible({ timeout: 5000 });
    await expect(page.getByLabel(/servicio/i)).toBeVisible();
    await expect(page.getByLabel(/fecha/i)).toBeVisible();
    await expect(page.getByLabel(/hora/i)).toBeVisible();
  });

  // 5️⃣ Test: realizar una reserva
  test("✅ permite crear una reserva correctamente", async ({ page }) => {
    await page.goto("/client/book-appointment");

    // Simular selección de campos
    await page.getByLabel(/servicio/i).selectOption({ index: 0 });
    await page.getByLabel(/fecha/i).fill("2025-11-10");
    await page.getByLabel(/hora/i).fill("10:30");

    // Interceptar el POST de creación de cita para simular éxito
    await page.route("**/appointments", async (route) => {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ message: "Reserva confirmada" }),
      });
    });

    // Enviar formulario
    await page.click('button[type="submit"]');

    // Verificar mensaje de éxito
    await expect(page.getByText(/reserva confirmada/i)).toBeVisible({ timeout: 5000 });
  });
});
