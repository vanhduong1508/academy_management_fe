export interface Enrollment {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  enrolledAt: string;        // ISO string
  result?: string;           // "PASSED" | "FAILED" | undefined
  certificateNo?: string;    // certificateCode
  certificateIssuedAt?: string;
}