import React from "react";
import Link from "next/link";
import { Service } from "@/types/service";

export const ServiceCard = ({ service }: { service: Service }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-80 hover:shadow-xl transition-transform hover:scale-105">
      <h3 className="text-lg font-semibold text-primary">{service.name}</h3>

      {service.category && (
        <p className="text-sm text-gray-500 mt-1">Categoría: {service.category}</p>
      )}

      <p className="text-gray-600 mt-2">
        Duración: {service.durationMin} min
      </p>

      <p className="text-pink-500 font-bold mt-3">
        ${Number(service.price).toFixed(2)}
      </p>

      <Link
        href={`/client/service/${service.id}`}
        className="mt-4 inline-block bg-secondary text-white px-4 py-2 rounded-md hover:opacity-90"
      >
        Reservar
      </Link>
    </div>
  );
};
