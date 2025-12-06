// src/types/admin/admin-course.types.ts
import type { PageResponse } from "../shared/pagination.types";

// ============= ENUM / STATUS =============
export type CourseStatus = "ACTIVE" | "INACTIVE" | string;

// ============= COURSE DTO (CourseResponse) =============
export interface Course {
  id: number;
  code: string;
  title: string;
  startDate: string | null;    // LocalDate -> ISO string
  endDate: string | null;
  content: string | null;
  status: CourseStatus;
  price: number;               // BigDecimal -> number
  createdAt: string;
  updatedAt: string;
}

// để hợp với cách bạn đang import
export type CourseResponse = Course;

// Page<Course>
export type CoursePage = PageResponse<Course>;

// ============= PAYLOAD (CourseCreateRequest / CourseUpdateRequest) =============
export interface CourseCreatePayload {
  title: string;
  startDate?: string | null;
  endDate?: string | null;
  content?: string | null;
  price?: number | null;
}

export interface CourseUpdatePayload {
  title: string;
  startDate: string;
  endDate: string;
  content?: string | null;
}

// ============= STRUCTURE: CourseStructureResponse / ChapterResponse / LessonResponse =============

export interface LessonResponse {
  id: number;
  title: string;
  type: string;          // "VIDEO" | "QUIZ" | "DOCUMENT" | ...
  urlVid: string | null; // link video (nếu là VIDEO)
  orderIndex: number;    // thứ tự bài trong chương
}

export interface ChapterResponse {
  id: number;
  title: string;
  orderIndex: number;        // thứ tự chương trong khóa
  lessons: LessonResponse[]; // danh sách bài học trong chương
}

export interface CourseStructureResponse {
  id: number;                    // courseId
  title: string;                 // tên khóa học
  description: string | null;    // mô tả / content
  chapters: ChapterResponse[];   // danh sách chương
}

// ============= PAYLOAD CHAPTER / LESSON =============
export interface ChapterCreatePayload {
  title: string;
}

export interface LessonCreatePayload {
  title: string;
  type: string;          // VIDEO / QUIZ / DOCUMENT...
  urlVid: string | null;
}
