export interface Student {
  id: number;
  studentCode: string;
  fullName: string;
  dob?: string;
  hometown?: string;
  province?: string;
  status: "ACTIVE" | "INACTIVE";
  userId?: number;
}

export interface StudentUpdatePayload {
  fullName?: string;
  dob?: string;
  hometown?: string;
  province?: string;
}

export interface StudentCreatePayload {
  studentCode: string;
  fullName: string;
  dob: string;
  hometown?: string;
  province?: string;
}