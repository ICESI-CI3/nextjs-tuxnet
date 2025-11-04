import Head from "next/head";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Crear cuenta | BellezaTotal</title>
      </Head>
      <AuthLayout
        title="Crea tu cuenta"
        subtitle="Registra tu salon o crea tu perfil de cliente para comenzar a reservar."
        footer={
          <div className="space-y-2 text-sm text-text/60">
            <p>
              Ya tienes una cuenta?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary hover:underline"
              >
                Inicia sesion
              </Link>
            </p>
          </div>
        }
      >
        <div className="space-y-6">
          <RegisterForm />
          <div className="rounded-xl bg-secondary/20 p-4 text-sm text-text/70">
            <h2 className="text-sm font-semibold text-primary">
              Que incluye tu cuenta?
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Panel personalizado para clientes, especialistas y administradores.</li>
              <li>Historial de citas con estados y seguimiento en tiempo real.</li>
              <li>Notificaciones y recordatorios para tus servicios clave.</li>
            </ul>
          </div>
        </div>
      </AuthLayout>
    </>
  );
}
