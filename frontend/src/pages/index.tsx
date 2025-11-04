import { LoginForm } from "@/components/forms/LoginForm";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-10">
      <h1 className="text-4xl font-bold text-pink-600 mb-8">
        BellezaTotal 💅
      </h1>
      <div className="flex gap-12 flex-wrap justify-center">
        <div>
          <h2 className="text-xl font-semibold mb-3 text-center">
            Inicia sesión
          </h2>
          <LoginForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-3 text-center">
            Regístrate
          </h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
