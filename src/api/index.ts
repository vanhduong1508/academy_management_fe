// src/api/index.ts
import axios, { AxiosInstance } from "axios";
import { logout } from "../redux/slices/auth.slice";

type AppStore = {
  getState: () => any;
  dispatch: (action: any) => any;
};

const API_BASE_URL = "http://localhost:8080/api";

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

let storeRef: AppStore | null = null;

// Gọi hàm này trong main.tsx sau khi tạo store
export const setupAxiosInterceptors = (store: AppStore) => {
  storeRef = store;

  // Request: tự động gắn Bearer token
  axiosInstance.interceptors.request.use(
    (config) => {
      if (!storeRef) return config;
      const state = storeRef.getState();
      const token: string | null = state.auth?.token ?? null;

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response: nếu 401 → logout + về /login
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401 && storeRef) {
        storeRef.dispatch(logout());
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

export { axiosInstance as api };
