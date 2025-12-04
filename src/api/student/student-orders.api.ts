// src/api/student/student-orders.api.ts
import { axiosInstance } from "../index";
import type { Order, OrderCreatePayload } from "../../types/models/order.types";
import type { Enrollment } from "../../types/models/enrollment.types";

/**
 * Student: tạo đơn hàng mua khóa học
 * BE: POST /api/orders
 */
export const createOrderApi = async (
  payload: OrderCreatePayload
): Promise<Order> => {
  const res = await axiosInstance.post<Order>("/orders", payload);
  return res.data;
};

/**
 * Student: lấy list enrollments của chính mình
 * BE (đang dùng): GET /api/enrollments/me?studentId=...
 */
export const getMyEnrollmentsApi = async (
  studentId: number
): Promise<Enrollment[]> => {
  const res = await axiosInstance.get<Enrollment[]>("/enrollments/me", {
    params: { studentId },
  });
  return res.data;
};
