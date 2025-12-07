export interface OrderPayload {
  courseId: number;
}

// Match backend OrderResponse structure
export interface OrderResponse {
  id: number;
  studentId: number;
  studentName: string;
  courseId: number;
  courseTitle: string;
  totalAmount: number | null;
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;
  transferNote: string | null;
}

// Match backend PaymentInfoResponse structure
export interface PaymentInfoResponse {
  bankAccountNumber: string;
  bankAccountName: string;
  bankName: string;
  transferGuide: string;
}
