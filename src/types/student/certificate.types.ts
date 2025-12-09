export interface CertificateResponse {
  enrollmentId: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  result: "PASS" | "FAIL" | "NOT_REVIEWED";
  certificateCode: string | null;
  issuedAt: string;
}
