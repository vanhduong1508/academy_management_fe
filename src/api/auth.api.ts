// src/api/auth.api.ts
import { axiosInstance } from './index';
import type { UserSimpleResponse } from '../types';

export interface RegisterStudentPayload {
  username: string;
  password: string;
  email: string;
  phone: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// 🔥 Đăng ký học viên (public) – POST /api/auth/register
export const registerStudent = (data: RegisterStudentPayload) => {
  return axiosInstance.post<UserSimpleResponse>('/auth/register', data);
};

// 🔥 Đăng nhập – POST /api/auth/login
export const login = (data: LoginPayload) => {
  return axiosInstance.post<UserSimpleResponse>('/auth/login', data);
};
