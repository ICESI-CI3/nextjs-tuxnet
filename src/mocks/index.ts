const shouldUseMocks = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const initMocks = async () => {
  if (!shouldUseMocks || typeof window === "undefined") return;

  const { worker } = await import("./browser");
  if (!worker.listHandlers().length) return;

  await worker.start({
    onUnhandledRequest: (request) => {
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[msw] Petición no controlada: ${request.method} ${request.url}`,
        );
      }
    },
  });
};
