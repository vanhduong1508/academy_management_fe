 export interface CourseResponse {
  id: number;
  code: string;
  title: string;
  startDate: string | null;
  endDate: string | null;
  content: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  price: number | null;
  createdAt: string;
  updatedAt: string;
}

export type CourseSimple = CourseResponse;
export type CourseDetail = CourseResponse;
export type CourseDetailResponse = CourseResponse;

export interface LessonResponse {
  id: number;
  title: string;
  type: string; 
  urlVid: string | null;
}

export interface ChapterResponse {
  id: number;
  title: string;
  lessons: LessonResponse[];
}

export interface CourseStructureResponse {
  id: number;
  title: string;
  description: string | null;
  chapters: ChapterResponse[];
}

export interface CoursePageResponse {
  content: CourseResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
