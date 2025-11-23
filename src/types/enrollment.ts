export interface Enrollment {
  id: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  courseId: number;
  courseCode: string;
  courseTitle: string;
  enrolledAt: string;     
  result?: string;           
  certificateNo?: string;    
  certificateIssuedAt?: string;
}