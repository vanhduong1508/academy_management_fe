import { axiosInstance } from "../index";
import type { CertificateResponse } from "../../types/student/certificate.types";

export const getMyCertificatesApi = async (): Promise<CertificateResponse[]> => {
  const res =
    await axiosInstance.get<CertificateResponse[]>("/student/me/certificates");
  return res.data;
}; 

export const getCertificateDetailApi = async (
  enrollmentId: number
): Promise<CertificateResponse> => {
  const res = await axiosInstance.get<CertificateResponse>(
    `/student/me/certificates/${enrollmentId}`
  );
  return res.data;
};
