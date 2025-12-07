import { axiosInstance } from "../index";
import type {
  StudentResponse,
  UpdateStudentPayload,
} from "../../types/student/student.types";

export const getMyProfileApi = async (): Promise<StudentResponse> => {
  const res = await axiosInstance.get<StudentResponse>("/students/me");
  return res.data;
};

export const updateMyProfileApi = async (
  payload: UpdateStudentPayload
): Promise<StudentResponse> => {
  const res = await axiosInstance.put<StudentResponse>(
    "/students/me",
    payload
  );
  return res.data;
};
