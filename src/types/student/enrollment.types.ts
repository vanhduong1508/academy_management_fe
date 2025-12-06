export interface EnrollPayload {
  studentId: number;
  courseId: number;
}

// Match backend EnrollmentResponse structure
export interface EnrollmentResponse {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  status: "ENROLLED" | "COMPLETED" | "NOT_COMPLETED";
  progressPercentage: number | null;
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
  result: "PASS" | "FAIL" | null; // CertificateResult enum
  certificateCode: string | null;
}

export interface EnrollmentPageResponse {
  content: EnrollmentResponse[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
