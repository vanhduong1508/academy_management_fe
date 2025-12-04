// src/api/admin/admin-enrollments.api.ts
import { axiosInstance } from "../index";
import type { EnrollmentCompletion } from "../../types/models/enrollment.types";

// Admin: lấy danh sách toàn bộ enrollments + % progress
// GET /api/admin/enrollments/progress
export const getAllEnrollmentsProgressApi = async (): Promise<
  EnrollmentCompletion[]
> => {
  const res = await axiosInstance.get<EnrollmentCompletion[]>(
    "/admin/enrollments/progress"
  );
  return res.data;
};
