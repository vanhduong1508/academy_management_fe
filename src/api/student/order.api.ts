import { axiosInstance } from "../index";
import type { OrderResponse, OrderPayload, PaymentInfoResponse } from "../../types/student/order.types";

export const createOrderApi = async (payload: OrderPayload): Promise<OrderResponse> => {
  const res = await axiosInstance.post<OrderResponse>("/orders", payload);
  return res.data;
};

export const getMyOrdersApi = async (): Promise<OrderResponse[]> => {
  const res = await axiosInstance.get<OrderResponse[]>("/orders/me");
  return res.data;
};

export const getPaymentInfoApi = async (): Promise<PaymentInfoResponse> => {
  const res = await axiosInstance.get<PaymentInfoResponse>("/payment-info");
  return res.data;
};

// Sends a request to admin to review this order/payment.
export const requestPaymentApprovalApi = async (orderId: number): Promise<any> => {
  const res = await axiosInstance.post(`/orders/${orderId}/request-approval`);
  return res.data;
};