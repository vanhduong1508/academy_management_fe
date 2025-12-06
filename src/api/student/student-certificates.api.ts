// src/api/student/student-certificates.api.ts
import { axiosInstance } from "../index";
import type { CertificateResponse } from "../../types/admin/admin-certificate.types";

/**
 * GET /api/certificates/student/{studentId}
 */
export const getStudentCertificatesApi = async (
  studentId: number
): Promise<CertificateResponse[]> => {
  const res = await axiosInstance.get<CertificateResponse[]>(
    `/certificates/student/${studentId}`
  );
  return res.data;
};
