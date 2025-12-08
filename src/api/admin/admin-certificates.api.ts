import { axiosInstance } from "../index";
import type {
  CertificateResponse,
  IssueCertificatePayload,
} from "../../types/admin/admin-certificate.types";
import type { PageResponse } from "../../types/shared/pagination.types";

export async function getIssuedCertificatesApi(): Promise<CertificateResponse[]> {
  const res = await axiosInstance.get<
    PageResponse<CertificateResponse> | CertificateResponse[]>("/admin/certificates/enrollments", {
    params: {
      page: 0,
      size: 1000,
    },
  });
  const data = res.data as| PageResponse<CertificateResponse>| CertificateResponse[];
  if (Array.isArray(data)) {
    return data;
  }
  return data.content ?? [];
}
export async function issueCertificateApi(
  enrollmentId: number,
  payload: IssueCertificatePayload
): Promise<CertificateResponse> {
  const res = await axiosInstance.post<CertificateResponse>(
    `/admin/certificates/enrollment/${enrollmentId}`,
    payload
  );
  return res.data;
}
