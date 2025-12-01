// /src/api/auth.api.ts
import { axiosInstance } from './index';
import type { UserSimpleResponse } from '../types/models/user.types';

export interface RegisterStudentPayload {
  fullName: string;
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// 🔥 Tạo tài khoản admin
export const createAdmin = (data: { username: string; password: string }) => {
  return axiosInstance.post<UserSimpleResponse>('/api/admin/users/create-admin', data);
};

// 🔥 Đăng ký học viên
export const registerStudent = (data: RegisterStudentPayload) => {
  return axiosInstance.post<UserSimpleResponse>('/api/auth/register', data);
};

// 🔥 Đăng nhập
export const login = (data: LoginPayload) => {
  return axiosInstance.post<UserSimpleResponse>('/api/auth/login', data);
};

// 🔥 Lấy thông tin người dùng hiện tại
export const getCurrentUser = () => {
  return axiosInstance.get<UserSimpleResponse>('/api/users/me');
};
