// src/types/index.ts
import type { Role, AuthUser, AuthResponse } from "./models/user.types";

export * from "./models/user.types";
export * from "./models/course.types";
export * from "./models/enrollment.types";
export * from "./models/order.types";
export * from "./models/certificate.types";
export type UserRole = Role;
export type { AuthUser, AuthResponse };

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
