export interface CompleteLessonPayload {
  enrollmentId: number;
}

export interface LessonProgressResponse {
  enrollmentId: number;
  lessonId: number;
  lessonName: string;
  lessonOrder: number | null;
  completed: boolean;
  completedAt: string | null;
}

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
