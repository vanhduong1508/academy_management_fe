// src/api/auth.api.ts
import { axiosInstance } from './index';
import type { UserSimpleResponse } from '../types';

export interface RegisterStudentPayload {
  fullName: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// 🔥 Đăng ký học viên
// BE: POST /api/auth/register
export const registerStudent = (data: RegisterStudentPayload) => {
  return axiosInstance.post<UserSimpleResponse>('/auth/register', data);
};

// 🔥 Đăng nhập
// BE: POST /api/auth/login
export const login = (data: LoginPayload) => {
  return axiosInstance.post<UserSimpleResponse>('/auth/login', data);
};

// 🔥 Lấy thông tin người dùng hiện tại
// BE (dự kiến): GET /api/users/me
export const getCurrentUser = () => {
  return axiosInstance.get<UserSimpleResponse>('/users/me');
};
