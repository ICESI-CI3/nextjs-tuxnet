"use client";
import { useEffect, useState } from "react";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { serviceService } from "@/services/serviceService";
import { ServiceCard } from "@/components/ServiceCard";
import { Service } from "@/types/service";

export default function ClientHome() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data);
      } catch (err) {
        console.error("Error cargando servicios:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <ClientLayout>
      <h2 className="text-2xl font-bold text-center mb-8 text-primary">
        Nuestros Servicios
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {services.length > 0 ? (
          services.map((srv) => <ServiceCard key={srv.id} service={srv} />)
        ) : (
          <p className="text-gray-500">No hay servicios disponibles.</p>
        )}
      </div>
    </ClientLayout>
  );
}
