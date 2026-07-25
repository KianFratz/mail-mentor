import axios from "axios";
import { emitTokenChange, performLogout } from "./tokenEvents";
import { TOKEN_KEY } from "@/constants/auth.constant";

interface RefreshResponse {
  access_token: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 60000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = error.config?.url?.includes("auth/login");
    const isRefreshRequest = error.config?.url?.includes("auth/refresh");
    const isLogoutRequest = error.config?.url?.includes("auth/logout");

    if (isLoginRequest || isRefreshRequest || isLogoutRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      originalRequest.headers = originalRequest.headers ?? {};

      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          refreshQueue.push({
            resolve: (newToken) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            },
            reject,
          }),
        );
      }

      isRefreshing = true;
      try {
        const response = await api.post<RefreshResponse>("/auth/refresh");
        const newToken = response.data.access_token;

        if (!newToken) {
          throw new Error("No access token is refresh response");
        }

        localStorage.setItem(TOKEN_KEY, newToken);
        emitTokenChange(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        refreshQueue.forEach(({ resolve }) => resolve(newToken));
        refreshQueue = [];

        return api(originalRequest);
      } catch (refreshError) {
        refreshQueue.forEach(({ reject }) => reject(refreshError));
        refreshQueue = [];

        await performLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
