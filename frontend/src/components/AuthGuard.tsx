import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/store/useAuthStore";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { token, restoreSession } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    restoreSession();
    const storedToken = localStorage.getItem("token");
    if (!storedToken) router.push("/login");
  }, []);

  if (!token) return null;
  return <>{children}</>;
};
