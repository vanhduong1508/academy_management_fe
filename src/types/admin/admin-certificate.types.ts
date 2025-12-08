// src/types/admin/admin-certificate.types.ts

export type CertificateResult = "PASS" | "FAIL";

export interface CertificateResponse {
  id?: number;            

  enrollmentId: number;

  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseTitle: string;
  courseCode: string;

  certificateCode: string;
  issuedAt: string;        
  result: CertificateResult;
}

export interface IssueCertificatePayload {
  result: CertificateResult;
}
