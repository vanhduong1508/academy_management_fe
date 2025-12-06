// src/types/admin/admin-user.types.ts

export type Role = "ADMIN" | "STUDENT";

export interface AdminUser {
  id: number;
  username: string;
  fullName: string | null;
  isActive: boolean;
  createdAt: string; // BE đang để String
}

export interface UserSimple {
  id: number;
  username: string;
  role: Role | string;
}
