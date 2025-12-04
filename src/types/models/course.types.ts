
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // page index hiện tại (0-based)
  size: number;
}

// Khớp CourseResponse.java
export interface Course {
  price: number | null;
  id: number;
  code: string;
  title: string;
  description?: string | null;
  startDate: string | null; // ISO: "2025-12-04"
  endDate: string | null;
  content: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  createdAt: string | null;
  updatedAt: string | null;
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
export interface CourseStructureResponse {
  id: number;
  title: string;
  description: string | null;
  chapters: Chapter[];
}

// Payload khớp ChapterCreateRequest.java
export interface ChapterCreatePayload {
  title: string;
}

// Payload suy ra từ LessonCreateRequest (BE dùng title + type)
export interface LessonCreatePayload {
  title: string;
  type?: string | null; // optional, BE cho phép null
}

// Payloads khớp CourseCreateRequest / CourseUpdateRequest
export interface CourseCreatePayload {
  title: string;
  startDate?: string | null; // yyyy-MM-dd
  endDate?: string | null;
  content?: string | null;
}

// CourseUpdateRequest.java:
//  title (NotBlank), startDate (NotNull), endDate (NotNull), content?
export interface CourseUpdatePayload {
  title: string;
  startDate: string; // yyyy-MM-dd
  endDate: string;
  content?: string | null;
}

