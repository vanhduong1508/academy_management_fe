// src/types/student.ts

export interface Student {
  id: number; // Theo schema API là int64
  code: string;
  fullName: string;
  dob: string; // Ngày sinh, định dạng "YYYY-MM-DD"
  hometown: string; // Quê quán
  province: string; // Tỉnh thường trú
  status: string;
  createdAt: string;
}