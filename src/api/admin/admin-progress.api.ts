import { axiosInstance } from "../index";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";

export async function getAllEnrollmentProgressForAdminApi(): Promise<EnrollmentProgressResponse[]> {
  const res = await axiosInstance.get<EnrollmentProgressResponse[]>(
    "/admin/enrollments/progress"
  );

  return res.data ?? [];
}

export async function getEnrollmentsReadyForCertificateApi(): Promise<EnrollmentProgressResponse[]> {
  const res = await axiosInstance.get<EnrollmentProgressResponse[]>(
    "/admin/enrollments/ready-for-certificate"
  );
  return res.data ?? [];
}
