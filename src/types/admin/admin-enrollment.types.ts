export type EnrollmentStatus = "ENROLLED" | "COMPLETED" | "NOT_COMPLETED";

export type CompletionResult =  "NOT_REVIEWED" | "PASSED"  | "FAILED";

export type CertificateResult = "PASS" | "FAIL"; 


export interface Enrollment {
  id: number;

  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseCode: string;
  courseTitle: string;

  status: EnrollmentStatus;
  progressPercentage: number | null;

  enrolledAt: string;   
  createdAt: string;
  updatedAt: string;

  result: CertificateResult | null; 
  certificateCode: string | null;
}


export interface EnrollmentCompletion {
  enrollmentId: number;

  courseId: number;
  courseTitle: string;

  studentId: number;
  studentName: string;

  status: EnrollmentStatus;
  result: CompletionResult | null;

  completedAt: string | null;
}

export interface EnrollmentProgress {
  enrollmentId: number;

  studentId: number;
  studentCode: string;
  studentName: string;

  courseId: number;
  courseCode: string;
  courseTitle: string;

  completedVideoLessons: number;
  totalVideoLessons: number;
  progressPercentage: number; 

  eligibleForCertificate: boolean;
  completionResult: CompletionResult | null;

  enrolledAt: string | null;
}

export interface StudentLearningHistory {
  studentId: number;
  studentCode: string;
  studentName: string;

  totalEnrollments: number;
  completedEnrollments: number;

  certificateCount: number;
  passedCount: number;
  failedCount: number;

  averageProgress: number;

  enrollments: Enrollment[];
}