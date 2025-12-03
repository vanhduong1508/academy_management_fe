// src/api/student/student-profile.api.ts
import { axiosInstance } from "../index";
import type {
  Student,
  StudentUpdatePayload,
} from "../../types/models/user.types";

// GET /api/students/me?studentId=...
export const getMyStudentProfileApi = async (
  studentId: number
): Promise<Student> => {
  const res = await axiosInstance.get<Student>("/students/me", {
    params: { studentId },
  });
  return res.data;
};

// PUT /api/students/me?studentId=...
export const updateMyStudentProfileApi = async (
  studentId: number,
  payload: StudentUpdatePayload
): Promise<Student> => {
  const res = await axiosInstance.put<Student>("/students/me", payload, {
    params: { studentId },
  });
  return res.data;
};
