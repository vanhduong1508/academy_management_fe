// src/api/admin/admin-users.api.ts
import { axiosInstance } from "../index";
import type { AdminUser } from "../../types/admin/admin-user.types";

/**
 * GET /api/admin/users
 * Lấy danh sách toàn bộ user trong hệ thống
 */
export const getAdminUsersApi = async (): Promise<AdminUser[]> => {
  const res = await axiosInstance.get<AdminUser[]>("/admin/users");
  return res.data;
};
