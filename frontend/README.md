# BellezaTotal Frontend

Aplicación Next.js para el taller de Computación en Internet III. Integra autenticación por roles, gestión de servicios/citas y consumo del backend NestJS.

## Requisitos previos
- Node.js >= 20.19.0 (recomendado 20.x LTS)
- npm 10+

## Variables de entorno
Crea `frontend/.env.local` con al menos:

```
NEXT_PUBLIC_API_URL=https://nestjs-tuxnet-lrey4b2j6-santiagosantacruz57s-projects.vercel.app
NEXT_PUBLIC_USE_MOCKS=true
```

`NEXT_PUBLIC_USE_MOCKS` activa los mocks locales (MSW) para trabajar sin backend.

## Scripts principales
```bash
npm install      # instala dependencias
npm run dev      # inicia el servidor de desarrollo
npm run build    # compila la app para producción
npm run start    # sirve la build
```

## Mock Service Worker (MSW)
Durante desarrollo se levanta automáticamente y responde a:
- `POST /auth/login` / `POST /auth/register`
- `GET|POST /services`
- `GET|POST /appointments`
- `GET /users`

Desactiva los mocks poniendo `NEXT_PUBLIC_USE_MOCKS=false` cuando el backend real esté listo.

## Estructura destacada
- `src/components/` – Formularios, layout y navegación.
- `src/services/` – Capa de acceso a API.
- `src/store/useAuthStore.ts` – Estado global de autenticación con Zustand.
- `src/mocks/` – Handlers y datos de MSW.

## Próximos pasos
1. Completar páginas y servicios faltantes para cada rol.
2. Añadir pruebas unitarias (Vitest) y E2E (Playwright).
3. Configurar pipeline de CI/CD y despliegue en Vercel.
