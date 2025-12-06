// src/api/admin/admin-progress.api.ts
import { axiosInstance } from "../index";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";

// GET: list tất cả enrollments + progress cho admin
export async function getAllEnrollmentProgressForAdminApi(): Promise<EnrollmentProgressResponse[]> {
  const res = await axiosInstance.get<EnrollmentProgressResponse[]>(
    "/admin/enrollments/progress"
  );
  // res.data là List<EnrollmentProgressResponse>
  return res.data ?? [];
}

// GET: list enrollments đủ điều kiện cấp certificate (NOT_REVIEWED + 100%)
export async function getEnrollmentsReadyForCertificateApi(): Promise<EnrollmentProgressResponse[]> {
  const res = await axiosInstance.get<EnrollmentProgressResponse[]>(
    "/admin/enrollments/ready-for-certificate"
  );
  return res.data ?? [];
}
