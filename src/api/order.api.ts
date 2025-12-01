// src/api/order.api.ts
import { axiosInstance } from './index';
import type { Order, OrderCreatePayload } from '../types/models/order.types';
import type { Enrollment } from '../types/models/enrollment.types';

// STUDENT: tạo đơn hàng
export const createOrderApi = async (payload: OrderCreatePayload): Promise<Order> => {
  const res = await axiosInstance.post<Order>('/api/orders', payload);
  return res.data;
};

// STUDENT: xem enrollments của mình
// OrderController: GET /api/enrollments/me?studentId=...
export const getMyEnrollmentsApi = async (studentId: number): Promise<Enrollment[]> => {
  const res = await axiosInstance.get<Enrollment[]>('/api/enrollments/me', {
    params: { studentId },
  });
  return res.data;
};

// ADMIN: list đơn chờ duyệt
// (giả định controller admin là /api/admin/orders/pending)
export const getPendingOrdersApi = async (): Promise<Order[]> => {
  const res = await axiosInstance.get<Order[]>('/api/admin/orders/pending');
  return res.data;
};

// ADMIN: duyệt đơn
export const approveOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(`/api/admin/orders/${orderId}/approve`);
  return res.data;
};

// ADMIN: từ chối đơn
export const rejectOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(`/api/admin/orders/${orderId}/reject`);
  return res.data;
};
