import { RoleGuard } from "@/components/RoleGuard";
import { useAuthStore } from "@/store/useAuthStore";

export default function UsersPage() {
  const { user } = useAuthStore();

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-2">Gestión de Usuarios</h1>
        <p>Bienvenido, {user?.firstname}</p>
        {/* Aquí iría el CRUD de usuarios */}
      </div>
    </RoleGuard>
  );
}
