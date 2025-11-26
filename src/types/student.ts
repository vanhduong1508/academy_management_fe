export interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  dob: string; // yyyy-MM-dd
  hometown?: string | null;
  province?: string | null;
  status?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}