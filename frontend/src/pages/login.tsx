import Head from "next/head";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Iniciar sesion | BellezaTotal</title>
      </Head>
      <AuthLayout
        title="Bienvenida de nuevo"
        subtitle="Accede al panel para gestionar servicios, citas y clientes."
        footer={
          <div className="space-y-2 text-sm text-text/60">
            <p>
              Eres nuevo en BellezaTotal?{" "}
              <Link
                href="/register"
                className="font-semibold text-primary hover:underline"
              >
                Crea una cuenta
              </Link>
            </p>
            <p>Soporte: soporte@bellezatotal.com</p>
          </div>
        }
      >
        <div className="space-y-6">
          <LoginForm />
          <ul className="grid gap-3 text-sm text-text/70">
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </span>
              Gestiona servicios y productos desde un solo lugar.
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                2
              </span>
              Agenda y confirma citas en cuestion de segundos.
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                3
              </span>
              Manten informados a tus clientes con notificaciones.
            </li>
          </ul>
        </div>
      </AuthLayout>
    </>
  );
}
