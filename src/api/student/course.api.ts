import { axiosInstance } from "../index";
import type {
  CourseDetailResponse,
  CourseStructureResponse,
  CoursePageResponse,
} from "../../types/student/course.types";

export const getAllCoursesApi = async (
  page = 0,
  size = 5
): Promise<CoursePageResponse> => {
  const res = await axiosInstance.get<CoursePageResponse>("/courses", {
    params: { page, size },
  });
  return res.data;
};

export const getCourseByIdApi = async (
  id: number
): Promise<CourseDetailResponse> => {
  const res = await axiosInstance.get<CourseDetailResponse>(`/courses/${id}`);
  return res.data;
};

export const getCourseStructureApi = async (
  id: number
): Promise<CourseStructureResponse> => {
  const res = await axiosInstance.get<CourseStructureResponse>(
    `/courses/${id}/structure`
  );
  return res.data;
};
