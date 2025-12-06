// src/api/admin/admin-orders.api.ts
import { axiosInstance } from "../index";
import type { Order } from "../../types/admin/admin-order.types";

/**
 * GET /api/admin/orders/pending
 * Danh sách order đang chờ duyệt
 */
export const getPendingOrdersApi = async (): Promise<Order[]> => {
  const res = await axiosInstance.get<Order[]>("/admin/orders/pending");
  return res.data;
};

/**
 * PUT /api/admin/orders/{id}/approve
 * Duyệt đơn → BE tự tạo Enrollment
 */
export const approveOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(
    `/admin/orders/${orderId}/approve`
  );
  return res.data;
};

/**
 * PUT /api/admin/orders/{id}/reject
 * Từ chối đơn
 */
export const rejectOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(
    `/admin/orders/${orderId}/reject`
  );
  return res.data;
};
