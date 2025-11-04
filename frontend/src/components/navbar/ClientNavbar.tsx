"use client";
import Link from "next/link";

export const ClientNavbar = () => {
  return (
    <nav className="bg-primary text-white flex justify-between items-center px-8 py-4 shadow-md">
      <h1 className="font-bold text-xl">💅 BellezaTotal</h1>
      <div className="flex gap-6">
        <Link href="/client/reservas" className="hover:underline">
          Mis Reservas
        </Link>
        <Link href="/client/perfil" className="hover:underline">
          Mi Perfil
        </Link>
      </div>
    </nav>
  );
};
