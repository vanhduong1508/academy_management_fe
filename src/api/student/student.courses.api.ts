// src/api/student/student-courses.api.ts
import { axiosInstance } from "../index";
import type {
  Course,
  PageResponse,
  CourseStructureResponse,
} from "../../types/models/course.types";

// 📌 1. Lấy danh sách khóa học (phân trang)
export const getStudentCoursesPageApi = async (
  page = 0,
  size = 10
): Promise<PageResponse<Course>> => {
  const res = await axiosInstance.get<PageResponse<Course>>("/courses", {
    params: { page, size },
  });
  return res.data;
};

// 📌 2. Lấy chi tiết 1 khóa học theo id
export const getStudentCourseDetailApi = async (
  id: number
): Promise<Course> => {
  const res = await axiosInstance.get<Course>(`/courses/${id}`);
  return res.data;
};

// 📌 3. Lấy structure (chapters → lessons) của khóa học
export const getStudentCourseStructureApi = async (
  id: number
): Promise<CourseStructureResponse> => {
  const res = await axiosInstance.get<CourseStructureResponse>(
    `/courses/${id}/structure`
  );
  return res.data;
};
