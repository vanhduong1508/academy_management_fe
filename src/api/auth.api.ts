// src/api/auth.api.ts
import { axiosInstance } from './index';
import type { AuthResponse } from '../types';

export interface RegisterStudentPayload {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// Đăng ký học viên – POST /api/auth/register
export const registerStudent = (data: RegisterStudentPayload) => {
  // axiosInstance đã baseURL = '/api' rồi thì chỉ cần '/auth/...'
  return axiosInstance.post<AuthResponse>('/auth/register', data);
};

// Đăng nhập – POST /api/auth/login
export const login = (data: LoginPayload) => {
  return axiosInstance.post<AuthResponse>('/auth/login', data);
};
