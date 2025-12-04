// src/api/auth.api.ts
import { axiosInstance } from "../index";
import type {
  AuthResponse,
  LoginPayload,
  RegisterStudentPayload,
} from "../../types/models/user.types";

// LOGIN: dùng cho cả ADMIN + STUDENT
export const loginApi = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const res = await axiosInstance.post<AuthResponse>("/auth/login", payload);
  return res.data;
};

// REGISTER: chỉ tạo STUDENT
export const registerStudentApi = async (
  payload: RegisterStudentPayload
): Promise<void> => {
  await axiosInstance.post("/auth/register", payload);
};
