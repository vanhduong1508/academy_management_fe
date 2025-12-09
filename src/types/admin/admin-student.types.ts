// src/types/admin/admin-student.types.ts

export interface AdminStudent {
  id: number;
  studentCode: string;
  fullName: string;
  dob: string | null;      
  hometown: string | null;
  province: string | null;
  status: string;            
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}
