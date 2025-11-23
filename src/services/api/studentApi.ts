import axiosClient from "./axiosClient";
import { Student } from "../../types/student";
import { StudentCreateRequest, StudentUpdateRequest } from "../../types/studentRequest";

/**
 * Lấy danh sách học viên
 */
export const getAllStudents = async (): Promise<Student[]> => {
  try {
    const response = await axiosClient.get<Student[]>("/api/students");
    return response.data;
  } catch (error: any) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message || error.message;
    console.error(`Lỗi [${status}] khi lấy DS học viên: ${errorMessage}`);
    throw new Error(`Không thể tải dữ liệu học viên: ${errorMessage}`);
  }
};

/**
 * Lấy học viên theo ID
 */
export const getStudentById = async (id: number): Promise<Student> => {
  try {
    const response = await axiosClient.get<Student>(`/api/students/${id}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw new Error(`Không tìm thấy học viên với ID: ${id}`);
    }
    throw new Error("Lỗi khi lấy thông tin học viên.");
  }
};

/**
 * Tạo mới học viên
 */
export const createStudent = async (
  data: StudentCreateRequest
): Promise<Student> => {
  try {
    const response = await axiosClient.post<Student>("/api/students", data);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Lỗi khi tạo học viên";
    throw new Error(msg);
  }
};

/**
 * Cập nhật học viên
 */
export const updateStudent = async (
  id: number,
  data: StudentUpdateRequest
): Promise<Student> => {
  try {
    const response = await axiosClient.put<Student>(`/api/students/${id}`, data);
    return response.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || "Lỗi khi cập nhật học viên";
    throw new Error(msg);
  }
};

/**
 * Xóa học viên theo ID
 */
export const deleteStudent = async (id: number): Promise<void> => {
  try {
    await axiosClient.delete(`/api/students/${id}`);
  } catch (error: any) {
    const msg = error.response?.data?.message || "Lỗi khi xóa học viên";
    throw new Error(msg);
  }
};
