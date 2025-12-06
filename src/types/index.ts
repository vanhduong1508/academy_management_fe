// src/types/index.ts

export * from "./shared/user.types";
export * from "./admin/admin-course.types";
export * from "./admin/admin-enrollment.types";
export * from "./admin/admin-order.types";


// 👉 Cho CourseFormModal
export interface CourseFormPayload {
  title: string;
  startDate: string;
  endDate: string;
  content: string;
}

// 👉 Cho Pagination component
export interface PaginationMeta {
  page: number;          // current page (0-based)
  size: number;          // page size
  totalElements: number;
  totalPages: number;
}
