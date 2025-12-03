// src/api/admin/admin-certificates.api.ts
import { axiosInstance } from "../index";
import type {
  Certificate,
  CertificateResult,
  IssueCertificatePayload,
} from "../../types/models/certificate.types";

// re-export để chỗ khác có thể import type CertificateResult từ file này
export type { CertificateResult };

// POST /api/certificates/enrollment/{enrollmentId}
export const issueCertificateApi = async (
  enrollmentId: number,
  payload: IssueCertificatePayload
): Promise<Certificate> => {
  const res = await axiosInstance.post<Certificate>(
    `/certificates/enrollment/${enrollmentId}`,
    payload
  );
  return res.data;
};
