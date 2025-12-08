export interface StudentResponse {
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

export interface UpdateStudentPayload {
  fullName: string;
  dob: string; 
  hometown?: string | null;
  province?: string | null;
}
