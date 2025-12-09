import type { PageResponse } from "../shared/pagination.types";
export type CourseStatus = "ACTIVE" | "INACTIVE" | string;

export interface Course {
  id: number;
  code: string;
  title: string;
  startDate: string | null;   
  endDate: string | null;
  content: string | null;
  status: CourseStatus;
  price: number;              
  createdAt: string;
  updatedAt: string;
}

export type CourseResponse = Course;

export type CoursePage = PageResponse<Course>;
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
  price?: number | null;
}



export interface LessonResponse {
  id: number;
  title: string;
  type: string;         
  urlVid: string | null; 
  orderIndex: number;   
}

export interface ChapterResponse {
  id: number;
  title: string;
  orderIndex: number;        
  lessons: LessonResponse[];
}

export interface CourseStructureResponse {
  id: number;                    
  title: string;                
  description: string | null;    
  chapters: ChapterResponse[];   
}

export interface ChapterCreatePayload {
  title: string;
}

export interface LessonCreatePayload {
  title: string;
  type: string;         
  urlVid: string | null;
}

export interface LessonUpdatePayload {
  title: string;
  type: string;        
  urlVid: string | null;
}

export interface ChapterUpdatePayload {
  title: string;
}