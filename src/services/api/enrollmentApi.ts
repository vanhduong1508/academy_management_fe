import axiosClient from "./axiosClient";
import { Enrollment } from "../../types/enrollment";

export interface EnrollPayload {
  studentId: number;
  courseId: number;
}

// Payload cập nhật kết quả PASS/FAIL
export interface UpdateResultPayload {
  passed: boolean;
}

// lấy tất cả danh sách
export const getAllEnrollments = async (): Promise<Enrollment[]> => {
  try {
    const response = await axiosClient.get<Enrollment[]>("/api/enrollments");
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(`Lỗi [${status}] khi lấy danh sách enrollment: ${msg}`);
    throw new Error(`Không thể tải danh sách enrollment: ${msg}`);
  }
};

// lấy theo id
export const getEnrollmentsByStudent = async (studentId: number): Promise<Enrollment[]> => {
  try {
    const response = await axiosClient.get<Enrollment[]>(`/api/enrollments/by-student/${studentId}`);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(`Lỗi [${status}] khi lấy enrollment của student ${studentId}: ${msg}`);
    throw new Error(`Không thể tải enrollment của học viên: ${msg}`);
  }
};

// đăng ký khóa học mới
export const enrollCourse = async (data: EnrollPayload): Promise<Enrollment> => {
  try {
    const response = await axiosClient.post<Enrollment>("/api/enrollments", data);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(`Lỗi [${status}] khi đăng ký khóa học: ${msg}`);
    throw new Error(`Không thể đăng ký khóa học: ${msg}`);
  }
};

// update
export const updateEnrollmentResult = async (
  enrollmentId: number,
  data: UpdateResultPayload
): Promise<Enrollment> => {
  try {
    const response = await axiosClient.put<Enrollment>(`/api/enrollments/${enrollmentId}/certificate`, data);
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const msg = error.response?.data?.message || error.message;
    console.error(`Lỗi [${status}] khi cập nhật kết quả enrollment ${enrollmentId}: ${msg}`);
    throw new Error(`Không thể cập nhật kết quả: ${msg}`);
  }
};
