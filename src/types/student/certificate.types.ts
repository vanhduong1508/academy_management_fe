export interface CertificateResponse {
  enrollmentId: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  result: string; 
  certificateCode: string | null;
  issuedAt: string;
    approvalStatus: "PENDING" | "APPROVED";
}
