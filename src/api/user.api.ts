import { axiosInstance } from './index';
import { UserResponse } from '../types';

// Lấy hồ sơ người dùng đang đăng nhập
export const getMe = (userId: number) => {
  return axiosInstance.get<UserResponse>('/users/me', {
    params: { userId },
  });
};

// Cập nhật hồ sơ cá nhân
export const updateMe = (
  userId: number,
  data: { fullName?: string; password?: string }
) => {
  return axiosInstance.put<UserResponse>('/users/me', data, {
    params: { userId },
  });
};

// (Admin) Lấy danh sách tất cả user
export const getAllUsers = () => {
  return axiosInstance.get<UserResponse[]>('/admin/users');
};
