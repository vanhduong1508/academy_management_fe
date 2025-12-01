// src/api/enrollment.api.ts
import { axiosInstance } from './index';
import type {
  Enrollment,
  EnrollmentCompletion,
  UpdateCompletionStatusPayload,
  EnrollmentResultUpdatePayload,
} from '../types/models/enrollment.types';
import type { Certificate } from '../types/models/certificate.types';
import type { PageResponse } from '../types/models/course.types';

// Admin: phân trang enrollments
export const getEnrollmentsPageApi = async (
  page = 0,
  size = 10
): Promise<PageResponse<Enrollment>> => {
  const res = await axiosInstance.get<PageResponse<Enrollment>>('/enrollments', {
    params: { page, size },
  });
  return res.data;
};

// Admin: enrollments theo student (nếu cần)
export const getEnrollmentsByStudentApi = async (
  studentId: number
): Promise<Enrollment[]> => {
  const res = await axiosInstance.get<Enrollment[]>(`/enrollments/by-student/${studentId}`);
  return res.data;
};

// Admin: students chưa từng đăng ký
export const getUnregisteredStudentsApi = async (): Promise<any[]> => {
  const res = await axiosInstance.get<any[]>('/enrollments/unregistered-students');
  return res.data;
};

// Completion status
export const getCompletionStatusApi = async (
  enrollmentId: number
): Promise<EnrollmentCompletion> => {
  const res = await axiosInstance.get<EnrollmentCompletion>(
    `/api/enrollments/${enrollmentId}/completion-status`
  );
  return res.data;
};

export const updateCompletionStatusApi = async (
  enrollmentId: number,
  payload: UpdateCompletionStatusPayload
): Promise<void> => {
  await axiosInstance.put(`/enrollments/${enrollmentId}/completion-status`, payload);
};

// Cấp chứng chỉ + cập nhật result
export const issueCertificateApi = async (
  enrollmentId: number,
  payload: EnrollmentResultUpdatePayload
): Promise<Certificate> => {
  const res = await axiosInstance.put<Certificate>(
    `/api/enrollments/${enrollmentId}/certificate`,
    payload
  );
  return res.data;
};
