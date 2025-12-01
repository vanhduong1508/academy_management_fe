// src/types/models/certificate.types.ts

export interface Certificate {
  id: number;
  enrollmentId: number;
  studentId: number;
  courseId: number;
  certificateNo: string;
  issuedAt: string; // LocalDateTime
  result: string;   // PASS / FAIL
}
