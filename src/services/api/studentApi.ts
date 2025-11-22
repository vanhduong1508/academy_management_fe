import axiosClient from "./axiosClient";
import { Student } from "../../types/student";

/**
 * Lấy danh sách tất cả học viên từ API.
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
 * Lấy thông tin chi tiết một học viên theo ID.
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
