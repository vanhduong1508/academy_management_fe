import axios, { AxiosInstance } from 'axios';
import { logout } from '../redux/slices/auth.slice'; // Vẫn giữ lại logout

type AppStore = {
    getState: () => any; // Chỉ cần biết hàm getState tồn tại
    dispatch: (action: any) => any; // Chỉ cần biết hàm dispatch tồn tại
};

const API_BASE_URL = 'http://localhost:8080/api';

export const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setupInterceptors = (store: AppStore) => {
    
    // Interceptor Request: Đính kèm Token
    axiosInstance.interceptors.request.use(
        (config) => {
            // Truy cập store.getState().auth.token (Đã có sẵn store)
            const token = store.getState().auth.token;
            if (token) {
                // Ensure headers object exists before setting Authorization
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );
    
    // Interceptor Response: Xử lý lỗi 401
    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response && error.response.status === 401) {
                // Nếu 401, dispatch logout và chuyển hướng
                store.dispatch(logout());
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );
};

export { axiosInstance as api };