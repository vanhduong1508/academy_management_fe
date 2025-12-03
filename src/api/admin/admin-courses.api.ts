import { axiosInstance } from "../index";
import type {
  Course,
  CourseStructure,
  PageResponse,
} from "../../types/models/course.types";

export interface CourseCreatePayload {
  title: string;
  description?: string;
  price?: number;
  startDate?: string | null;
  endDate?: string | null;
  content?: string | null;
}

export interface CourseUpdatePayload {
  title: string;
  description?: string;
  price?: number;
  startDate?: string | null;
  endDate?: string | null;
  content?: string | null;
}

// LIST
export const getCoursesPageApi = async (
  page = 0,
  size = 10
): Promise<PageResponse<Course>> => {
  const res = await axiosInstance.get<PageResponse<Course>>("/courses", {
    params: { page, size },
  });
  return res.data;
};

// alias cho code đang import getAdminCoursesPageApi
export const getAdminCoursesPageApi = getCoursesPageApi;

// DETAIL
export const getCourseDetailApi = async (id: number): Promise<Course> => {
  const res = await axiosInstance.get<Course>(`/courses/${id}`);
  return res.data;
};

export const getCourseStructureApi = async (
  id: number
): Promise<CourseStructure> => {
  const res = await axiosInstance.get<CourseStructure>(
    `/courses/${id}/structure`
  );
  return res.data;
};

// CREATE / UPDATE / DELETE
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

// alias cho code đang import createAdminCourseApi, updateAdminCourseApi, deleteAdminCourseApi
export const createAdminCourseApi = createCourseApi;
export const updateAdminCourseApi = updateCourseApi;
export const deleteAdminCourseApi = deleteCourseApi;
