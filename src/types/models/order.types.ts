// src/types/models/order.types.ts

export type PaymentStatus = "PAID" | "PENDING" | "FAILED";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Order {
  id: number;

  studentId: number;
  studentName: string;

  courseId: number;
  courseTitle: string;

  amount: number; // BigDecimal -> number
  paymentMethod?: string | null;
  paymentStatus: PaymentStatus;
  approvalStatus: ApprovalStatus | string;

  createdAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
}

// OrderCreateRequest
export interface OrderCreatePayload {
  studentId: number;
  courseId: number;
  amount: number;
  paymentMethod?: string | null;
}
