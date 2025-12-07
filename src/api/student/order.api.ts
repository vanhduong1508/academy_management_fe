import { axiosInstance } from "../index";
import type {
  OrderResponse,
  OrderPayload,
  PaymentInfoResponse,
} from "../../types/student/order.types";

export const createOrderApi = async (
  payload: OrderPayload
): Promise<OrderResponse> => {
  const res = await axiosInstance.post<OrderResponse>("/orders", payload);
  return res.data;
};

export const getMyOrdersApi = async (): Promise<OrderResponse[]> => {
  const res = await axiosInstance.get<OrderResponse[]>("/orders/me");
  return res.data;
};

export const getPaymentInfoApi = async (): Promise<PaymentInfoResponse> => {
  const res =
    await axiosInstance.get<PaymentInfoResponse>("/payment-info");
  return res.data;
};
