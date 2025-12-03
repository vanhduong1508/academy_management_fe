
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // page index hiện tại (0-based)
  size: number;
}

// CourseResponse
export interface Course {
  id: number;
  code: string;
  title: string;
  price: number | null;     // ✅ số hoặc null
  description?: string;     // ✅ để CourseCard dùng
  startDate?: string;
  endDate?: string;
}

// LessonResponse
export interface Lesson {
  id: number;
  title: string;
  type: string;
}

// ChapterResponse
export interface Chapter {
  id: number;
  title: string;
  lessons: Lesson[];
}

// CourseStructureResponse
export interface CourseStructure {
  id: number;
  title: string;
  description?: string | null;
  chapters: Chapter[];
}

// Payloads khớp CourseCreateRequest / CourseUpdateRequest
export interface CourseCreatePayload {
  title: string;
  startDate?: string | null; // yyyy-MM-dd
  endDate?: string | null;
  content?: string | null;
}

export interface CourseUpdatePayload {
  title: string;
  startDate: string; // bắt buộc
  endDate: string;
  content?: string | null;
}
