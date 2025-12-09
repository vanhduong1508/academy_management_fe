import { axiosInstance } from "../index";
import type {
  Course,
  CourseCreatePayload,
  CourseUpdatePayload,
} from "../../types/admin/admin-course.types";
import type { PageResponse } from "../../types/shared/pagination.types";

export const getAdminCoursesPageApi = async (
  page = 0,
  size = 5
): Promise<PageResponse<Course>> => {
  const res = await axiosInstance.get<PageResponse<Course>>("/courses", {
    params: { page, size },
  });
  return res.data;
};

export const createCourseApi = async (
  payload: CourseCreatePayload
): Promise<Course> => {
  const res = await axiosInstance.post<Course>("/admin/courses", payload);
  return res.data;
};

export const updateCourseApi = async (
  id: number,
  payload: CourseUpdatePayload
): Promise<Course> => {
  const res = await axiosInstance.put<Course>(`/admin/courses/${id}`, payload);
  return res.data;
};

export const deleteCourseApi = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/admin/courses/${id}`);
};

export const getCourseDetailApi = async (id: number): Promise<Course> => {
  const res = await axiosInstance.get<Course>(`/admin/courses/${id}`);
  return res.data;
};