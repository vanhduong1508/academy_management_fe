// src/types/models/order.types.ts

export type OrderApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED';

export interface Order {
  id: number;

  studentId: number;
  studentName: string;

  courseId: number;
  courseTitle: string;

  amount: number;
  paymentMethod?: string | null;

  paymentStatus: PaymentStatus;
  approvalStatus: OrderApprovalStatus;

  createdAt: string;
  approvedAt?: string | null;
  rejectedAt?: string | null;
}

export interface OrderCreatePayload {
  studentId: number;
  courseId: number;
  amount: number;
  paymentMethod?: string;
}
