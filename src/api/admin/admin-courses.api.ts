// src/api/admin/admin-courses.api.ts
import { axiosInstance } from "../index";
import type {
  Course,
  CourseCreatePayload,
  CourseUpdatePayload,
} from "../../types/admin/admin-course.types";
import type { PageResponse } from "../../types/shared/pagination.types";

/**
 * GET /api/courses?page=&size=
 * Dùng chung cho admin để liệt kê khóa học
 */
export const getAdminCoursesPageApi = async (
  page = 0,
  size = 10
): Promise<PageResponse<Course>> => {
  const res = await axiosInstance.get<PageResponse<Course>>("/courses", {
    params: { page, size },
  });
  return res.data;
};

/**
 * POST /api/admin/courses
 * Tạo course mới (controller admin)
 */
export const createCourseApi = async (
  payload: CourseCreatePayload
): Promise<Course> => {
  const res = await axiosInstance.post<Course>("/admin/courses", payload);
  return res.data;
};

/**
 * PUT /api/admin/courses/{id}
 * Cập nhật khóa học
 */
export const updateCourseApi = async (
  id: number,
  payload: CourseUpdatePayload
): Promise<Course> => {
  const res = await axiosInstance.put<Course>(`/admin/courses/${id}`, payload);
  return res.data;
};

/**
 * DELETE /api/admin/courses/{id}
 * Soft delete
 */
export const deleteCourseApi = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/courses/${id}`);
};

/**
 * GET /api/admin/courses/{id}
 * Chi tiết khóa học
 */
export const getCourseDetailApi = async (id: number): Promise<Course> => {
  const res = await axiosInstance.get<Course>(`/admin/courses/${id}`);
  return res.data;
};