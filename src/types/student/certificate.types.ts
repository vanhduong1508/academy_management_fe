// Match backend CertificateResponse structure
export interface CertificateResponse {
  enrollmentId: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  result: string; // "PASS" | "FAIL"
  certificateCode: string | null;
  issuedAt: string;
}
