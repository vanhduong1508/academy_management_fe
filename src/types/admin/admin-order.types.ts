// src/types/admin/admin-order.types.ts

export type PaymentStatus = "PAID" | "PENDING" | string;
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface Order {
  id: number;

  studentId: number | null;
  studentName: string | null;

  courseId: number | null;
  courseTitle: string | null;

  price: number;       // BigDecimal -> number
  paymentStatus: PaymentStatus;
  approvalStatus: ApprovalStatus;

  createdAt: string;
  approvedAt: string | null;
  rejectedAt: string | null;

  transferNote: string;
}
