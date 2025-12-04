// src/api/student/student-certificates.api.ts
import { axiosInstance } from "../index";
import type { Certificate } from "../../types/models/certificate.types";

// GET /api/certificates/student/{studentId}
export const getMyCertificatesApi = async (
  studentId: number
): Promise<Certificate[]> => {
  const res = await axiosInstance.get<Certificate[]>(
    `/certificates/student/${studentId}`
  );
  return res.data;
};
