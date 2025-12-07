// src/types/admin/admin-progress.types.ts

export type CompletionResult = "NOT_REVIEWED" | "PASSED" | "FAILED";

export interface EnrollmentProgressResponse {
  enrollmentId: number;

  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseCode: string;
  courseTitle: string;

  progressPercentage: number;     
  totalVideoLessons: number;
  completedVideoLessons: number;

  completionResult: CompletionResult | null;
  eligibleForCertificate: boolean;

  enrolledAt: string | null;      // LocalDateTime -> string
}

// alias cho các import cũ
export type EnrollmentProgress = EnrollmentProgressResponse;
