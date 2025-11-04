import { useEffect } from "react";
import type { AppProps } from "next/app";
import dayjs from "dayjs";
import "dayjs/locale/es";
import "@/styles/globals.css";
import { AuthGuard } from "@/components/AuthGuard";
import { initMocks } from "@/mocks";

dayjs.locale("es");

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    void initMocks();
  }, []);

  return (
    <AuthGuard>
      <Component {...pageProps} />
    </AuthGuard>
  );
}
