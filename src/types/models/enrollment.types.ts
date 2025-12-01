// ===============================================
// EnrollmentResponse (BE → FE)
// ===============================================
export interface Enrollment {
  id: number;

  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseCode: string;
  courseTitle: string;

  enrolledAt: string;               // LocalDateTime
  status: string | null;            // ENROLLED / COMPLETED / NOT_COMPLETED
  result: string | null;            // "Dang hoc" | "Dat" | "Khong dat" | null
  certificateNo: string | null;     // nếu đã cấp chứng chỉ thì có
}

// ===============================================
// Completion Status (GET /api/enrollments/{id}/completion-status)
// ===============================================
export interface EnrollmentCompletion {
  enrollmentId: number;
  studentId: number;
  courseId: number;
  completed: boolean;  // true nếu status = COMPLETED
}

// Request body cho update completion
export interface UpdateCompletionStatusPayload {
  completed: boolean;
}

// ===============================================
// Issue Certificate (PUT /api/enrollments/{id}/certificate)
// Body = EnrollmentResultUpdateRequest { passed: boolean }
// ===============================================
export interface EnrollmentResultUpdatePayload {
  passed: boolean;   // true = PASS, false = FAIL
}
