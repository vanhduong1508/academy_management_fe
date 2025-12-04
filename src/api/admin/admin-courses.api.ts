// src/api/admin/admin-courses.api.ts
import { axiosInstance } from "../index";
import type {
  Course,
  PageResponse,
  CourseCreatePayload,
  CourseUpdatePayload,
} from "../../types/models/course.types";

// ======================= LIST COURSES (PAGE) =======================
// BE: @RequestMapping("/api/courses") trong CourseController
// GET /api/courses?page=&size=
export const getAdminCoursesPageApi = async (
  page = 0,
  size = 5
): Promise<PageResponse<Course>> => {
  const res = await axiosInstance.get<PageResponse<Course>>("/courses", {
    params: { page, size },
  });
  return res.data;
};

// ======================= CRUD COURSE (ADMIN) =======================
// BE: @RequestMapping("/api/admin/courses") trong CourseAdminController

// POST /api/admin/courses
export const createCourseApi = async (
  payload: CourseCreatePayload
): Promise<Course> => {
  const res = await axiosInstance.post<Course>("/admin/courses", payload);
  return res.data;
};

// PUT /api/admin/courses/{id}
export const updateCourseApi = async (
  id: number,
  payload: CourseUpdatePayload
): Promise<Course> => {
  const res = await axiosInstance.put<Course>(`/admin/courses/${id}`, payload);
  return res.data;
};

// DELETE /api/admin/courses/{id}
export const deleteCourseApi = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/courses/${id}`);
};

// Giữ alias cho code cũ đang import
export const createAdminCourseApi = createCourseApi;
export const updateAdminCourseApi = updateCourseApi;
export const deleteAdminCourseApi = deleteCourseApi;

// ======================= DETAIL (nếu cần dùng) =======================

// GET /api/courses/{id}
export const getCourseDetailApi = async (id: number): Promise<Course> => {
  const res = await axiosInstance.get<Course>(`/courses/${id}`);
  return res.data;
};
