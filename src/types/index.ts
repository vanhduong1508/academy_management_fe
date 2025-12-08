export * from "./shared/user.types";

export * from "./auth/auth.types";

export * from "./student/course.types";
export * from "./student/enrollment.types";
export * from "./student/order.types";
export * from "./student/progress.types";
export * from "./student/certificate.types";
export * from "./student/student.types";

export * from "./admin/admin-enrollment.types";
export * from "./admin/admin-order.types";

export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CourseFormPayload {
  title: string;
  startDate: string;
  endDate: string;
  content: string;
}
