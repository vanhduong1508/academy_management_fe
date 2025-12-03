// src/api/student/enrollment.api.ts
import { axiosInstance } from "../index";
import type { Enrollment } from "../../types/models/enrollment.types";

// STUDENT: lấy enrollments của chính mình
// Đề xuất BE: GET /api/enrollments/my (dùng JWT, không cần studentId param)
export const getMyEnrollmentsApi = async (): Promise<Enrollment[]> => {
  const res = await axiosInstance.get<Enrollment[]>("/enrollments/my");
  return res.data;
};
