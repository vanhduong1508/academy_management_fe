// src/api/auth/auth.api.ts
import { axiosInstance } from "../index";
import type {
  AuthResponse,
  LoginPayload,
  RegisterStudentPayload,
} from "../../types/auth/auth.types";

export const loginApi = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const res = await axiosInstance.post<AuthResponse>("/auth/login", payload);
  return res.data;
};

export const registerStudentApi = async (
  payload: RegisterStudentPayload
): Promise<AuthResponse> => {
  const res = await axiosInstance.post<AuthResponse>("/auth/register", payload);
  return res.data;
};
