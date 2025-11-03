import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthGuard } from "@/components/AuthGuard";

const PUBLIC_ROUTES = ["/login", "/register"];

export default function App({ Component, pageProps, router }: AppProps) {
  const isPublic = PUBLIC_ROUTES.includes(router.pathname);

  if (isPublic) {
    return <Component {...pageProps} />;
  }

  return (
    <AuthGuard>
      <Component {...pageProps} />
    </AuthGuard>
  );
}
