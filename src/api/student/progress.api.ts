import { axiosInstance } from "../index";
import type {
  LessonProgressResponse,
  EnrollmentProgressResponse,
  CompleteLessonPayload,
} from "../../types/student/progress.types";

export const completeLessonApi = async (
  lessonId: number,
  payload: CompleteLessonPayload
): Promise<LessonProgressResponse> => {
  const res = await axiosInstance.post<LessonProgressResponse>(
    `/student/lessons/${lessonId}/complete`,
    payload
  );
  return res.data;
};

export const getEnrollmentProgressApi = async (
  enrollmentId: number
): Promise<EnrollmentProgressResponse> => {
  const res = await axiosInstance.get<EnrollmentProgressResponse>(
    `/student/enrollments/${enrollmentId}/progress`
  );
  return res.data;
};
