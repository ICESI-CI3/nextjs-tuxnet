const API_URL = process.env.NEXT_PUBLIC_API_URL;
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === "true";

export const getApiBaseUrl = () => {
  if (USE_MOCKS && typeof window !== "undefined") {
    // Deriva del origen actual para que MSW pueda interceptar las peticiones
    return "";
  }

  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  return API_URL.replace(/\/$/, "");
};

export const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return {};
  }
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
