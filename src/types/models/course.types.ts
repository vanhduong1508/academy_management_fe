// ====== COMMON PAGE WRAPPER ======
export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // current page index (0-based)
}

// ====== COURSE BASIC ======
export interface Course {
  id: number;
  code: string;
  title: string;
  startDate: string; // ISO "yyyy-MM-dd"
  endDate: string;   // ISO "yyyy-MM-dd"
  content: string;
  status: string;    // "ACTIVE" | "INACTIVE"
  createdAt?: string;
  updatedAt?: string;
}

// Payload dùng cho tạo / cập nhật khóa học
export interface CourseFormPayload {
  title: string;
  startDate: string;
  endDate: string;
  content: string;
}

// ====== STRUCTURE (chapters -> lessons) ======
export interface LessonStructure {
  id: number;
  title: string;
  type: string; // VIDEO / QUIZ / DOCUMENT ...
}

export interface ChapterStructure {
  id: number;
  title: string;
  lessons: LessonStructure[];
}

export interface CourseStructure {
  id: number;
  title: string;
  description: string;
  chapters: ChapterStructure[];
}
