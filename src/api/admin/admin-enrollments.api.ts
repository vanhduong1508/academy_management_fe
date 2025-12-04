// src/api/admin/admin-enrollments.api.ts
import { axiosInstance } from "../index";
import type { EnrollmentCompletion } from "../../types/models/enrollment.types";

/**
 * Admin: lấy danh sách enrollments đủ điều kiện cấp chứng chỉ (100% progress)
 * BE: GET /api/admin/enrollments/ready-for-certificate
 */
export const getAllEnrollmentsProgressApi = async (): Promise<
  EnrollmentCompletion[]
> => {
  const res = await axiosInstance.get<EnrollmentCompletion[]>(
    "/admin/enrollments/ready-for-certificate"
  );
  return res.data;
};

/**
 * Admin: lấy tiến độ chi tiết của 1 enrollment
 * BE: GET /api/admin/enrollments/{enrollmentId}/progress
 */
export const getEnrollmentProgressApi = async (
  enrollmentId: number
): Promise<EnrollmentCompletion> => {
  const res = await axiosInstance.get<EnrollmentCompletion>(
    `/admin/enrollments/${enrollmentId}/progress`
  );
  return res.data;
};
