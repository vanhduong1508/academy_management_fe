import axios from "axios";

// Lấy baseURL từ biến môi trường REACT_APP_API_URL, fallback về localhost
const baseURL = process.env.REACT_APP_API_URL || "http://localhost:7880";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true // Nếu Spring Security cần cookie/auth
});

export default axiosClient;
