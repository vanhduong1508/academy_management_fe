// Match backend StudentResponse structure
export interface StudentResponse {
  id: number;
  studentCode: string;
  fullName: string;
  dob: string | null; // LocalDate
  hometown: string | null;
  province: string | null;
  status: string;
  email: string | null;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

// Match backend StudentUpdateRequest structure
export interface UpdateStudentPayload {
  fullName: string;
  dob: string; // LocalDate format: YYYY-MM-DD
  hometown?: string | null;
  province?: string | null;
}
