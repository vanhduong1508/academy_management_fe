// src/api/admin/admin-students.api.ts
import { axiosInstance } from "../index";
import type { Student } from "../../types/models/user.types";
import type { PageResponse } from "../../types/models/course.types";

// Admin: phân trang danh sách học viên
// BE: GET /api/admin/students?page=&size=
export const getStudentsPageApi = async (
  page = 0,
  size = 5
): Promise<PageResponse<Student>> => {
  const res = await axiosInstance.get<PageResponse<Student>>(
    "/admin/students",
    { params: { page, size } }
  );
  return res.data;
};

// Admin: xem chi tiết học viên
// BE: GET /api/admin/students/{id}
export const getStudentDetailApi = async (id: number): Promise<Student> => {
  const res = await axiosInstance.get<Student>(`/admin/students/${id}`);
  return res.data;
};

// Admin: xóa học viên
// BE: DELETE /api/admin/students/{id}
export const deleteStudentApi = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/students/${id}`);
};
