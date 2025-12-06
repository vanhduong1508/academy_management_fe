// Match backend LessonCompleteRequest
export interface CompleteLessonPayload {
  enrollmentId: number;
}

// Match backend LessonProgressResponse
export interface LessonProgressResponse {
  enrollmentId: number;
  lessonId: number;
  lessonName: string;
  lessonOrder: number | null;
  completed: boolean;
  completedAt: string | null;
}

// Match backend EnrollmentProgressResponse
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
  completionResult: "NOT_REVIEWED" | "PASSED" | "FAILED" | null;
  eligibleForCertificate: boolean;
  enrolledAt: string;
}
