// src/api/admin/admin-students.api.ts
import { axiosInstance } from "../index";
import type { PageResponse } from "../../types/shared/pagination.types";
import type { AdminStudent } from "../../types/admin/admin-student.types";

export async function getStudentsPageApi(
  page = 0,
  size = 10
): Promise<PageResponse<AdminStudent>> {
  const res = await axiosInstance.get<PageResponse<AdminStudent>>(
    "/admin/students",
    {
      params: { page, size },
    }
  );
  return res.data;
}

export async function getStudentDetailApi(
  id: number
): Promise<AdminStudent> {
  const res = await axiosInstance.get<AdminStudent>(`/admin/students/${id}`);
  return res.data;
}

export async function getCourseOfStudent(
  studentId: number
): Promise<AdminStudent> {
  const res = await axiosInstance.get<AdminStudent>(
    `/admin/students/${studentId}/courses`
  );
  return res.data;
  
}

export async function deleteStudentApi(id: number): Promise<void> {
  await axiosInstance.delete(`/admin/students/${id}`);
}
