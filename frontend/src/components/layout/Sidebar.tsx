import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { hasRole } from "@/utils/roles";

export const Sidebar = () => {
  const { user } = useAuthStore();

  return (
    <aside className="bg-pink-100 h-full p-4 w-64">
      <h2 className="text-lg font-bold mb-4 text-pink-600">
        BellezaTotal
      </h2>

      <nav className="flex flex-col gap-2">
        {hasRole(user?.roles || [], ["admin", "staff"]) && (
          <Link href="/dashboard/appointments">Citas</Link>
        )}

        {hasRole(user?.roles || [], ["admin"]) && (
          <Link href="/dashboard/users">Usuarios</Link>
        )}

        {hasRole(user?.roles || [], ["client"]) && (
          <Link href="/client/profile">Mi Perfil</Link>
        )}
      </nav>
    </aside>
  );
};
