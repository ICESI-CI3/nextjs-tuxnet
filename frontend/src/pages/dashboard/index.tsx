import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardPage() {
  const { user } = useAuthStore();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-pink-600">
        Bienvenido {user?.firstname} 👋
      </h1>
      <p className="text-gray-600 mt-2">
        Rol actual: {user?.roles.join(", ")}
      </p>
    </div>
  );
}
