import axios from "axios";
import { useAuthStore } from "@/store/authStore";

/**
 * Axios instance for browser calls to this app's `/api/*` routes.
 * Attaches `Authorization: Bearer <jwt>` when a token exists in the Zustand store.
 */
export const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const url = config.url ?? "";
  const isInternalApi = url.startsWith("/api");
  if (!isInternalApi) {
    return config;
  }
  const token = useAuthStore.getState().jwtToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
