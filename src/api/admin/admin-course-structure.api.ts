// src/api/admin/admin-course-structure.api.ts
import { axiosInstance } from "../index";
import type {
  CourseStructureResponse,
  ChapterResponse,
  LessonResponse,
  ChapterCreatePayload,
  LessonCreatePayload,
} from "../../types/admin/admin-course.types";

/**
 * GET /api/admin/courses/{courseId}/structure
 */
export const getCourseStructureApi = async (
  courseId: number
): Promise<CourseStructureResponse> => {
  const res = await axiosInstance.get<CourseStructureResponse>(
    `/admin/courses/${courseId}/structure`
  );
  return res.data;
};

/**
 * POST /api/admin/courses/{courseId}/chapters
 */
export const addChapterApi = async (
  courseId: number,
  payload: ChapterCreatePayload
): Promise<ChapterResponse> => {
  const res = await axiosInstance.post<ChapterResponse>(
    `/admin/courses/${courseId}/chapters`,
    payload
  );
  return res.data;
};

/**
 * POST /api/admin/chapters/{chapterId}/lessons
 * payload có urlVid (link video)
 */
export const addLessonApi = async (
  chapterId: number,
  payload: LessonCreatePayload
): Promise<LessonResponse> => {
  const res = await axiosInstance.post<LessonResponse>(
    `/admin/chapters/${chapterId}/lessons`,
    payload
  );
  return res.data;
};
