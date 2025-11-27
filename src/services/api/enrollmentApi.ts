import axiosClient from "./axiosClient";
import { AxiosError } from "axios";
import {
  Enrollment,
  EnrollmentPage,
  CertificateResponse,
  StudentResponse,
} from "../../types/enrollment";

// -----------------------------
// TYPING VÀ HỖ TRỢ XỬ LÝ LỖI
// -----------------------------

interface ApiErrorResponse {
  message: string;
}

const isAxiosError = (error: unknown): error is AxiosError<ApiErrorResponse> => {
  return (error as AxiosError).isAxiosError !== undefined;
};

// Payload cập nhật kết quả PASS/FAIL
export interface UpdateResultPayload {
  passed: boolean;
}

// Payload đăng ký mới
export interface EnrollPayload {
  studentId: number;
  courseId: number;
}

// -----------------------------
// ENROLLMENT API
// -----------------------------

/**
 * LẤY DANH SÁCH ENROLLMENT (có paging)
 */
export const getAllEnrollments = async (
  page: number = 0,
  size: number = 10,
  sortBy: string = "id" // ✅ [FIX] Thêm tham số sortBy
): Promise<EnrollmentPage> => {
  try {
    // ✅ [FIX] Truyền sortBy vào query string
    const response = await axiosClient.get<EnrollmentPage>(
      `/enrollments?page=${page}&size=${size}&sortBy=${sortBy}`
    );
    return response.data;
  } catch (error: unknown) {
    const defaultErrorMsg = "Không thể tải danh sách enrollment.";
    let status = "Unknown";
    let msg = defaultErrorMsg;

    if (isAxiosError(error) && error.response) {
      status = String(error.response.status);
      msg = error.response.data?.message || defaultErrorMsg;
    } else if (error instanceof Error) {
      msg = error.message;
    }

    console.error(`Lỗi [${status}] khi lấy danh sách enrollment: ${msg}`);

    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
    } as EnrollmentPage;
  }
};

/**
 * Đăng ký khóa học mới
 */
export const enrollCourse = async (
  payload: EnrollPayload
): Promise<Enrollment> => {
  try {
    const response = await axiosClient.post<Enrollment>(
      "/enrollments", 
      payload
    );
    return response.data;
  } catch (error: unknown) {
    const status = (isAxiosError(error) && error.response?.status) || "Unknown";
    const msg =
      (isAxiosError(error) && error.response?.data?.message) ||
      (error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định");

    console.error(`Lỗi [${status}] khi đăng ký khóa học: ${msg}`);
    throw new Error(`Không thể đăng ký khóa học: ${msg}`);
  }
};

/**
 * Cập nhật kết quả PASSED/FAILED
 */
export const updateEnrollmentResult = async (
  enrollmentId: number,
  payload: UpdateResultPayload
): Promise<CertificateResponse> => {
  try {
    const response = await axiosClient.put<CertificateResponse>(
      `/enrollments/${enrollmentId}/certificate`,
      payload
    );
    return response.data;
  } catch (error: unknown) {
    const status = (isAxiosError(error) && error.response?.status) || "Unknown";
    const msg =
      (isAxiosError(error) && error.response?.data?.message) ||
      (error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định");

    console.error(
      `Lỗi [${status}] khi cập nhật kết quả enrollment ${enrollmentId}: ${msg}`
    );
    throw new Error(`Không thể cập nhật kết quả: ${msg}`);
  }
};

/**
 * Lấy danh sách học viên theo studentId
 */
export const getEnrollmentsByStudent = async (
  studentId: number
): Promise<Enrollment[]> => {
  try {
    const response = await axiosClient.get<Enrollment[]>(
      `/enrollments/by-student/${studentId}`
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy danh sách enrollment của học viên ${studentId}:`,
      error
    );
    return [];
  }
};

/**
 * Lấy danh sách học viên chưa đăng ký khóa học
 */
export const getUnregisteredStudents = async (): Promise<StudentResponse[]> => {
    try {
        const response = await axiosClient.get<StudentResponse[]>(
            "/enrollments/unregistered-students"
        );
        return response.data;
    } catch (error: unknown) {
        console.error("Lỗi khi lấy danh sách học viên chưa đăng ký:", error);
        return [];
    }
};

/**
 * Lấy trạng thái hoàn thành của enrollment
 */
export const getCompletionStatus = async (
  enrollmentId: number
): Promise<{ completed: boolean }> => {
  try {
    const response = await axiosClient.get<{ completed: boolean }>(
      `/enrollments/${enrollmentId}/completion-status`
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      `Lỗi khi lấy trạng thái hoàn thành của enrollment ${enrollmentId}:`,
      error
    );
    return { completed: false };
  }
};

/**
 * Cập nhật trạng thái hoàn thành / không hoàn thành
 */
export const updateCompletionStatus = async (
  enrollmentId: number,
  completed: boolean
): Promise<void> => {
  try {
    await axiosClient.put(
      `/enrollments/${enrollmentId}/completion-status`,
      { completed }
    );
  } catch (error: unknown) {
    console.error(
      `Lỗi khi cập nhật trạng thái hoàn thành của enrollment ${enrollmentId}:`,
      error
    );
  }
};
export type { Enrollment };