// src/api/admin/admin-course-structure.api.ts
import { axiosInstance } from "../index";
import type {
  CourseStructureResponse,
  Chapter,
  Lesson,
  ChapterCreatePayload,
  LessonCreatePayload,
} from "../../types/models/course.types";

// ======================= READ STRUCTURE =======================
// GET /api/courses/{id}/structure
export const getCourseStructureApi = async (
  courseId: number
): Promise<CourseStructureResponse> => {
  const res = await axiosInstance.get<CourseStructureResponse>(
    `/courses/${courseId}/structure`
  );
  return res.data;
};

// ======================= CREATE CHAPTER =======================
// POST /api/admin/courses/{courseId}/chapters
export const addChapterApi = async (
  courseId: number,
  payload: ChapterCreatePayload
): Promise<Chapter> => {
  const res = await axiosInstance.post<Chapter>(
    `/admin/courses/${courseId}/chapters`,
    payload
  );
  return res.data;
};

// ======================= CREATE LESSON =======================
// POST /api/admin/chapters/{chapterId}/lessons
export const addLessonApi = async (
  chapterId: number,
  payload: LessonCreatePayload
): Promise<Lesson> => {
  const res = await axiosInstance.post<Lesson>(
    `/admin/chapters/${chapterId}/lessons`,
    payload
  );
  return res.data;
};
