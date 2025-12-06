export * from "./shared/user.types";

export * from "./auth/auth.types";

export * from "./student/course.types";
export * from "./student/enrollment.types";
export * from "./student/order.types";
export * from "./student/progress.types";
export * from "./student/certificate.types";
export * from "./student/student.types";

// Admin types giữ nguyên
export * from "./admin/admin-enrollment.types";
export * from "./admin/admin-order.types";

// Pagination
export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

// CourseFormModal
export interface CourseFormPayload {
  title: string;
  startDate: string;
  endDate: string;
  content: string;
}
