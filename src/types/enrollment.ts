// -----------------------------
// Enrollment / Registration
// -----------------------------
export interface Enrollment {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  enrolledAt: string;           // ISO string
  result?: string;              // PASS / FAIL
  certificateNo?: string;       // Số chứng chỉ nếu đã cấp
  certificateIssuedAt?: string; // Ngày cấp chứng chỉ ISO string
}

// -----------------------------
// Certificate response (tách ra từ BE)
// -----------------------------
export interface CertificateResponse {
  enrollmentId: number;
  certificateNo: string;
  result: "PASS" | "FAIL";
  issuedAt: string; // ISO string
}

// -----------------------------
// Student info (chưa đăng ký khóa học)
// -----------------------------
export interface StudentResponse {
  id: number;
  studentCode: string;
  fullName: string;
  dob?: string;        // ISO string
  hometown?: string;
  province?: string;
  status?: string;     // ACTIVE / INACTIVE
}

// -----------------------------
// Response của API getAllEnrollments dạng paging
// -----------------------------
export interface EnrollmentPage {
  content: Enrollment[];
  totalElements: number;
  totalPages: number;
}
