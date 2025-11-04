import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

const highlights = [
  {
    title: "Agenda inteligente",
    description:
      "Visualiza disponibilidad, gestiona reservas y confirma citas al instante.",
  },
  {
    title: "Gestión por roles",
    description:
      "Paneles dedicados para administradores, especialistas y clientes.",
  },
  {
    title: "Experiencia premium",
    description:
      "Notificaciones, recordatorios y seguimiento para fidelizar clientes.",
  },
];

export default function HomePage() {
  return (
    <>
      <Head>
        <title>BellezaTotal | Gestión integral de salones</title>
      </Head>
      <div className="relative overflow-hidden bg-gradient-to-br from-white via-secondary/30 to-primary/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,105,180,0.25),_transparent_55%)]" />
        <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="BellezaTotal logo"
              width={48}
              height={48}
              className="rounded-full border border-primary/40 object-cover shadow-sm"
            />
            <span className="text-lg font-semibold tracking-wide text-primary">
              BellezaTotal
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary/10"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90"
            >
              Crear cuenta
            </Link>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-col items-center gap-16 px-6 pb-20 pt-10 sm:px-10 lg:flex-row lg:items-start lg:gap-20">
          <section className="flex-1 space-y-8">
            <div className="space-y-4 text-center lg:text-left">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.2em] text-primary">
                Belleza & bienestar
              </span>
              <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
                La plataforma que centraliza tu salón de belleza
              </h1>
              <p className="max-w-2xl text-base text-text/70 sm:text-lg">
                Organiza servicios, gestiona tu equipo y brinda experiencias
                memorables a tus clientes. Todo en un solo tablero conectado a
                tus flujos cotidianos.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 transition hover:bg-primary/90"
                >
                  Empezar ahora
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full border border-primary/40 px-6 py-3 text-sm font-medium text-primary transition hover:bg-primary/10"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>

            <div className="grid gap-6 rounded-3xl border border-white/60 bg-white/60 p-6 shadow-lg shadow-primary/10 backdrop-blur">
              {highlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-neutral/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <h3 className="text-base font-semibold text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-text/70">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="flex w-full max-w-md flex-1 flex-col gap-6 rounded-3xl border border-white/80 bg-white/80 p-6 shadow-xl shadow-primary/20 backdrop-blur">
            <div className="rounded-2xl bg-primary/10 p-5 text-sm text-text/80">
              <h2 className="text-base font-semibold text-primary">
                ¿Por qué BellezaTotal?
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Roles con dashboards personalizados.</li>
                <li>Alertas y recordatorios para evitar ausencias.</li>
                <li>Historial de servicios y métricas clave.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-neutral/10 p-5 text-sm text-text/70">
              <p className="font-medium text-primary">
                "Nuestra agenda dejó de ser un caos. Ahora cada especialista sabe
                su día y el equipo administra la operación en minutos."
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.2em] text-text/50">
                — Equipo BellezaTotal
              </p>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/60 bg-white/60 py-6 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 text-sm text-text/60 sm:flex-row sm:px-10">
            <p>© {new Date().getFullYear()} BellezaTotal. Todos los derechos reservados.</p>
            <p>Facultad Barberi · Computación en Internet III</p>
          </div>
        </footer>
      </div>
    </>
  );
}
