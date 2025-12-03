// src/api/student/student-progress.api.ts
import { axiosInstance } from "../index";
import type {
  EnrollmentProgress,
  LessonProgress,
} from "../../types/models/enrollment.types";

// payload BE cần khi complete lesson
export interface LessonCompletePayload {
  enrollmentId: number;
}

// POST /api/lessons/{lessonId}/complete
export const completeLessonApi = async (
  lessonId: number,
  payload: LessonCompletePayload
): Promise<LessonProgress> => {
  const res = await axiosInstance.post<LessonProgress>(
    `/lessons/${lessonId}/complete`,
    payload
  );
  return res.data;
};

// GET /api/enrollments/{enrollmentId}/progress
export const getEnrollmentProgressStudentApi = async (
  enrollmentId: number
): Promise<EnrollmentProgress> => {
  const res = await axiosInstance.get<EnrollmentProgress>(
    `/enrollments/${enrollmentId}/progress`
  );
  return res.data;
};
