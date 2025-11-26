// src/services/api/studentApi.ts
import axiosClient from "./axiosClient";
import { Student } from "../../types/student";
import { StudentCreateRequest, StudentUpdateRequest } from "../../types/studentRequest";

// --- PAGE RESPONSE ---
export type PageResponse<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
};

// --- EXISTING API ---
export const getStudentsPage = async (
  page: number = 0,
  size: number = 5
): Promise<PageResponse<Student>> => {
  const res = await axiosClient.get<PageResponse<Student>>(`/students?page=${page}&size=${size}`);
  return res.data;
};

export const getStudentById = async (id: number): Promise<Student> => {
  const res = await axiosClient.get<Student>(`/students/${id}`);
  return res.data;
};

export const createStudent = async (data: StudentCreateRequest): Promise<Student> => {
  const res = await axiosClient.post<Student>("/students", data);
  return res.data;
};

export const updateStudent = async (id: number, data: StudentUpdateRequest): Promise<Student> => {
  const res = await axiosClient.put<Student>(`/students/${id}`, data);
  return res.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await axiosClient.delete(`/students/${id}`);
};

// --- NEW API: LẤY HỌC VIÊN CHƯA ĐĂNG KÝ KHÓA HỌC NÀO ---
export const getStudentsNotEnrolled = async (): Promise<Student[]> => {
  try {
    const res = await axiosClient.get<Student[]>("/students/not-enrolled");
    return res.data;
  } catch (error: any) {
    const msg = error.response?.data?.message || error.message || "Lỗi khi tải danh sách học viên chưa đăng ký";
    throw new Error(msg);
  }
};
