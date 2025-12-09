import { axiosInstance } from "../index";
import type { Order } from "../../types/admin/admin-order.types";

export const getPendingOrdersApi = async (): Promise<Order[]> => {
  const res = await axiosInstance.get<Order[]>("/admin/orders/pending");
  return res.data;
};

export const approveOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(
    `/admin/orders/${orderId}/approve`
  );
  return res.data;
};


export const rejectOrderApi = async (orderId: number): Promise<Order> => {
  const res = await axiosInstance.put<Order>(
    `/admin/orders/${orderId}/reject`
  );
  return res.data;
};

