

export type CertificateResult = "PASS" | "FAIL";

// CertificateResponse
export interface Certificate {
  id: number;
  certificateCode: string;   // mã chuẩn từ BE
  certificateNo?: string;    // alias cho FE nếu BE dùng tên khác
  studentId: number;
  courseId: number;
  courseTitle?: string;      // ✅ dùng ở FE (student/admin)
  issuedAt: string;          // ISO date string
}

// IssueCertificateRequest
export interface IssueCertificatePayload {
  result: CertificateResult;
}
