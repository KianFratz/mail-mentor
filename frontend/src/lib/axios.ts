import axios from "axios";
import { emitTokenChange } from "./tokenEvents";

const TOKEN_KEY = "access_token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
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
let refreshQueue: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isLoginRequest = error.config?.url?.includes("auth/login");
    const isRefreshRequest = error.config?.url?.includes("auth/refresh");

    if (isLoginRequest || isRefreshRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(originalRequest));
          })
        })
      }

      isRefreshing = true;
      try {
        const data = await api.post("/auth/refresh");
        localStorage.setItem(TOKEN_KEY, data.data.access_token);
        emitTokenChange(data.data.access_token);

        refreshQueue.forEach((cb) => cb(data.data.access_token));
        refreshQueue = [];

        originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError){
        refreshQueue.forEach((cb) => cb(null));
        refreshQueue = [];
        hardLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

function hardLogout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.replace("/login");
}

export default api;
