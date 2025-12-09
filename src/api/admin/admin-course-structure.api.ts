import { axiosInstance } from "../index";
import type {
  CourseStructureResponse,
  ChapterResponse,
  LessonResponse,
  ChapterCreatePayload,
  LessonCreatePayload,
  ChapterUpdatePayload,
  LessonUpdatePayload
} from "../../types/admin/admin-course.types";

export const getCourseStructureApi = async (
  courseId: number
): Promise<CourseStructureResponse> => {
  const res = await axiosInstance.get<CourseStructureResponse>(
    `/admin/courses/${courseId}/structure`
  );
  return res.data;
};

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

export const updateChapterApi = async (
  chapterId: number,
  payload: ChapterUpdatePayload
) => {
  const res = await axiosInstance.put<ChapterResponse>(
    `/admin/courses/chapters/${chapterId}`,
    payload
  );
  return res.data;
};

export const deleteChapterApi = async (
  chapterId: number
): Promise<void> => {
  await axiosInstance.delete(`/admin/courses/chapters/${chapterId}`);
};

export const updateLessonApi = async (
  lessonId: number,
  payload: LessonUpdatePayload
) => {
  const res = await axiosInstance.put<LessonResponse>(
    `/admin/chapters/lessons/${lessonId}`,
    payload
  );
  return res.data;
};

export const deleteLessonApi = async (
  lessonId: number
): Promise<void> => {
  await axiosInstance.delete(`/admin/chapters/lessons/${lessonId}`);
};
