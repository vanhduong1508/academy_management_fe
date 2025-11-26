import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:7880/api";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Optional: error interceptor to normalize errors
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can customize error handling here
    return Promise.reject(error);
  }
);

export default axiosClient;