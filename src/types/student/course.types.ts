// Match backend CourseResponse structure
export interface CourseResponse {
  id: number;
  code: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  content: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

// For backward compatibility
export type CourseSimple = CourseResponse;
export type CourseDetail = CourseResponse;
export type CourseDetailResponse = CourseResponse;

// Lesson structure matching backend LessonResponse
export interface LessonResponse {
  id: number;
  title: string;
  type: string; // "VIDEO" | "QUIZ" | "DOCUMENT" | ...
  urlVid: string | null;
}

// Chapter structure matching backend ChapterResponse
export interface ChapterResponse {
  id: number;
  title: string;
  lessons: LessonResponse[];
}

// Course structure matching backend CourseStructureResponse
export interface CourseStructureResponse {
  id: number;
  title: string;
  description: string | null;
  chapters: ChapterResponse[];
}

// Pagination response matching Spring Page<T>
// Spring Page serializes with field 'number' for current page
export interface CoursePageResponse {
  content: CourseResponse[];
  totalElements: number;
  totalPages: number;
  number: number; // current page number (0-indexed)
  size: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
