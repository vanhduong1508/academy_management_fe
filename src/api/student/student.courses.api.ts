// src/api/student/student-courses.api.ts
import { axiosInstance } from "../index";
import type { Course, PageResponse } from "../../types/models/course.types";

// List khóa học phân trang cho student – dùng CourseController (GET /api/courses)
export const getStudentCoursesPageApi = async (
  page = 0,
  size = 10
): Promise<PageResponse<Course>> => {
  const res = await axiosInstance.get<PageResponse<Course>>("/courses", {
    params: { page, size },
  });
  return res.data;
};

// Nếu bạn muốn list tất cả không phân trang (tùy dùng hay không)
export const getAllStudentCoursesApi = async (): Promise<Course[]> => {
  const res = await axiosInstance.get<Course[]>("/courses/all");
  return res.data;
};
