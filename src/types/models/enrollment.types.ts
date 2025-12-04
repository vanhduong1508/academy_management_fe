// 1. Enrollment cơ bản – map với EnrollmentResponse.java
export interface Enrollment {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseCode: string;
  courseTitle: string;

  enrolledAt: string; // ISO date-time
  result: string | null; // "Dang hoc", "Dat", "Truot"... hoặc null
  certificateNo: string | null;
}

// 2. Tiến độ tổng quát – map với EnrollmentProgressResponse.java
export interface EnrollmentProgress {
  enrollmentId: number;
  studentId: number;
  courseId: number;

  completedVideoLessons: number;
  totalVideoLessons: number;
  progressPercent: number; // 0–100
}

// 3. Tiến độ từng bài học – map với LessonProgressResponse.java
export interface LessonProgress {
  enrollmentId: number;
  lessonId: number;
  completed: boolean;
  completedAt: string | null; // ISO date-time
}

// 4. Hoàn thành hay chưa – map với EnrollmentCompletionResponse.java
export interface EnrollmentCompletion {
  enrollmentId: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;        // 0–100
  hasCertificate: boolean;        // đã có chứng chỉ chưa
  canIssueCertificate: boolean;   // đủ điều kiện cấp chưa (>=100%, pass,...)

  // client side dùng cho UI filter / thống kê
  status?: "COMPLETED" | "IN_PROGRESS" | "NOT_COMPLETED";
}

// 5. Payload dùng cho admin (để sau nếu cần)
export interface UpdateCompletionStatusPayload {
  completed: boolean;
}
