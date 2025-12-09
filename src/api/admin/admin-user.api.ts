import { axiosInstance } from "../index";
import type { AdminUser } from "../../types/admin/admin-user.types";

export const getAdminUsersApi = async (): Promise<AdminUser[]> => {
  const res = await axiosInstance.get<AdminUser[]>("/admin/users");
  return res.data;
};
