// src/api/course.api.ts
import { axiosInstance } from "./index";
import type { Course, PageResponse } from "../types/models/course.types";

export const getAllCoursesApi = async (): Promise<Course[]> => {
  // BE của bạn: @RequestMapping("/api/courses")
  const res = await axiosInstance.get<Course[]>("/api/courses");
  return res.data;
};
// GET /api/courses?page=&size=
export const getCoursesPageApi = async (
  page = 0,
  size = 10
): Promise<PageResponse<Course>> => {
  const res = await axiosInstance.get<PageResponse<Course>>("/api/courses", {
    params: { page, size },
  });
  return res.data;
};
