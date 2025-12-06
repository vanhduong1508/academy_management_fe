// src/types/admin/admin-enrollment.types.ts

// ===== ENUMS =====
export type EnrollmentStatus = "ENROLLED" | "COMPLETED" | "NOT_COMPLETED";

export type CompletionResult =
  | "NOT_REVIEWED"
  | "PASSED"
  | "FAILED";

export type CertificateResult = "PASS" | "FAIL"; // từ CertificateResult enum

// ===== EnrollmentResponse =====
// (trả về ở các API enrollments dùng dto.response.EnrollmentResponse)
export interface Enrollment {
  id: number;

  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseCode: string;
  courseTitle: string;

  status: EnrollmentStatus;
  progressPercentage: number | null;

  enrolledAt: string;   // LocalDateTime
  createdAt: string;
  updatedAt: string;

  // info certificate nếu đã có
  result: CertificateResult | null; // PASSED / FAILED or null
  certificateCode: string | null;
}

// ===== EnrollmentCompletionResponse =====
// (dto.enrollment.EnrollmentCompletionResponse)
export interface EnrollmentCompletion {
  enrollmentId: number;

  courseId: number;
  courseTitle: string;

  studentId: number;
  studentName: string;

  status: EnrollmentStatus;
  result: CompletionResult | null;

  completedAt: string | null;
}

// ===== EnrollmentProgressResponse =====
// (dto.response.EnrollmentProgressResponse)
export interface EnrollmentProgress {
  enrollmentId: number;

  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseCode: string;
  courseTitle: string;

  completedVideoLessons: number;
  totalVideoLessons: number;
  progressPercentage: number; // ✅ TRÙNG BE

  eligibleForCertificate: boolean;
  completionResult: CompletionResult | null;

  enrolledAt: string | null;
}