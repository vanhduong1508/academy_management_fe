import axiosClient from "./axiosClient";
import {
  Enrollment,
  EnrollmentPage,
  CertificateResponse,
  StudentResponse,
} from "../../types/enrollment";

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
// LẤY DANH SÁCH ENROLLMENT (có paging)
// -----------------------------
export const getAllEnrollments = async (
  page: number = 0,
  size: number = 10
): Promise<EnrollmentPage> => {
  try {
    const response = await axiosClient.get<EnrollmentPage>(
      `/api/enrollments?page=${page}&size=${size}`
    );

    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(`Lỗi [${status}] khi lấy danh sách enrollment: ${msg}`);
    throw new Error(`Không thể tải danh sách enrollment: ${msg}`);
  }
};

// -----------------------------
// Đăng ký khóa học mới
// -----------------------------
export const enrollCourse = async (
  payload: EnrollPayload
): Promise<Enrollment> => {
  try {
    const response = await axiosClient.post<Enrollment>(
      "/api/enrollments",
      payload
    );
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(`Lỗi [${status}] khi đăng ký khóa học: ${msg}`);
    throw new Error(`Không thể đăng ký khóa học: ${msg}`);
  }
};

// -----------------------------
// Cập nhật kết quả PASSED/FAILED
// -----------------------------
export const updateEnrollmentResult = async (
  enrollmentId: number,
  payload: UpdateResultPayload
): Promise<CertificateResponse> => {
  try {
    const response = await axiosClient.put<CertificateResponse>(
      `/api/enrollments/${enrollmentId}/certificate`,
      payload
    );
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(
      `Lỗi [${status}] khi cập nhật kết quả enrollment ${enrollmentId}: ${msg}`
    );
    throw new Error(`Không thể cập nhật kết quả: ${msg}`);
  }
};

// -----------------------------
// Lấy danh sách học viên theo studentId
// -----------------------------
export const getEnrollmentsByStudent = async (
  studentId: number
): Promise<Enrollment[]> => {
  try {
    const response = await axiosClient.get<Enrollment[]>(
      `/api/enrollments/by-student/${studentId}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Lỗi khi lấy danh sách enrollment của học viên ${studentId}:`,
      error
    );
    return [];
  }
};

// -----------------------------
// Lấy danh sách học viên chưa đăng ký khóa học
// -----------------------------
export const getUnregisteredStudents = async (): Promise<StudentResponse[]> => {
  try {
    const response = await axiosClient.get<StudentResponse[]>(
      "/api/enrollments/unregistered-students"
    );
    return response.data;
  } catch (error: any) {
    console.error("Lỗi khi lấy danh sách học viên chưa đăng ký:", error);
    return [];
  }
};

// -----------------------------
// Lấy trạng thái hoàn thành của enrollment
// -----------------------------
export const getCompletionStatus = async (
  enrollmentId: number
): Promise<{ completed: boolean }> => {
  try {
    const response = await axiosClient.get<{ completed: boolean }>(
      `/api/enrollments/${enrollmentId}/completion-status`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      `Lỗi khi lấy trạng thái hoàn thành của enrollment ${enrollmentId}:`,
      error
    );
    return { completed: false };
  }
};

// -----------------------------
// Cập nhật trạng thái hoàn thành / không hoàn thành
// -----------------------------
export const updateCompletionStatus = async (
  enrollmentId: number,
  completed: boolean
): Promise<void> => {
  try {
    await axiosClient.put(
      `/api/enrollments/${enrollmentId}/completion-status`,
      { completed }
    );
  } catch (error: any) {
    console.error(
      `Lỗi khi cập nhật trạng thái hoàn thành của enrollment ${enrollmentId}:`,
      error
    );
  }
};
export type { Enrollment };

