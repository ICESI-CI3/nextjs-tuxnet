import { ClientNavbar } from "@/components/navbar/ClientNavbar";

export const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <ClientNavbar />
      <main className="p-8">{children}</main>
    </div>
  );
};
