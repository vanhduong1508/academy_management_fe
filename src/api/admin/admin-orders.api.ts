// src/api/admin/admin-orders.api.ts
import { axiosInstance } from "../index";
import type { Order } from "../../types/models/order.types";

/**
 * Admin: lấy danh sách đơn hàng đang chờ duyệt
 * BE: GET /api/admin/orders/pending
 */
export const getPendingOrdersApi = async (): Promise<Order[]> => {
  const res = await axiosInstance.get<Order[]>("/admin/orders/pending");
  return res.data;
};

/**
 * Admin: phê duyệt đơn
 * BE: PUT /api/admin/orders/{orderId}/approve
 */
export const approveOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(`/admin/orders/${orderId}/approve`);
  return res.data;
};

/**
 * Admin: từ chối đơn
 * BE: PUT /api/admin/orders/{orderId}/reject
 */
export const rejectOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(`/admin/orders/${orderId}/reject`);
  return res.data;
};
