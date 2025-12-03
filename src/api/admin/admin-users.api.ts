// src/api/admin/admin-users.api.ts
import { axiosInstance } from "../index";
import type { Student } from "../../types/models/user.types";
import type { PageResponse } from "../../types/models/course.types";

// Admin: phân trang danh sách học viên
// GET /api/students?page=&size=
export const getStudentsPageApi = async (
  page = 0,
  size = 10
): Promise<PageResponse<Student>> => {
  const res = await axiosInstance.get<PageResponse<Student>>("/students", {
    params: { page, size },
  });
  return res.data;
};
