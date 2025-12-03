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

export const setupInterceptors = (store: AppStore) => {
  // Request: gắn token
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response: nếu 401 → logout
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        store.dispatch(logout());
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

export { axiosInstance as api };
