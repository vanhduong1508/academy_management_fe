export interface Course {
  id: number;
  code: string;
  title: string;
  startDate: string;
  endDate: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CourseCreateRequest {
  title: string;
  startDate: string;
  endDate: string;
  content: string;
}

export interface CourseUpdateRequest {
  title: string;
  startDate: string;
  endDate: string;
  content: string;
}
