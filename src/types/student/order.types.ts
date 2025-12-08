export interface OrderPayload {
  courseId: number;
}

export interface OrderResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  price: number | null;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  transferNote: string | null;
}

export interface PaymentInfoResponse {
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
  transferGuide: string;
}
