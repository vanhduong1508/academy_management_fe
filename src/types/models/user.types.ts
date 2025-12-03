// src/types/models/user.types.ts

export type Role = "ADMIN" | "STUDENT";

export interface AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: Role;
  studentId?: number | null;
  studentCode?: string | null;
}

// BE trả phẳng, KHÔNG có field "user"
export interface AuthResponse {
  token: string;
  user: AuthUser;
  userId: number;
  username: string;
  fullName: string;
  role: Role;
  studentId?: number | null;
  studentCode?: string | null;

}

// ========== phần còn lại giữ như trước ==========

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  dob: string;
  hometown?: string | null;
  province?: string | null;
  status: "ACTIVE" | "INACTIVE";
}

export interface StudentUpdatePayload {
  fullName: string;
  dob: string;
  hometown?: string | null;
  province?: string | null;
}

export interface RegisterStudentPayload {
  username: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
  dob: string;
  hometown?: string;
  province?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}
