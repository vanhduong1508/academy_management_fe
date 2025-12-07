import { axiosInstance } from "../index";
import type {
  EnrollmentResponse,
  EnrollmentPageResponse,
  EnrollPayload,
} from "../../types/student/enrollment.types";

export const enrollCourseApi = async (
  payload: EnrollPayload
): Promise<EnrollmentResponse> => {
  const res = await axiosInstance.post<EnrollmentResponse>(
    "/enrollments",
    payload
  );
  return res.data;
};

export const getAllEnrollmentsApi = async (
  page = 0,
  size = 5
): Promise<EnrollmentPageResponse> => {
  const res = await axiosInstance.get<EnrollmentPageResponse>("/enrollments", {
    params: { page, size },
  });
  return res.data;
};

export const getMyEnrollmentsApi = async (): Promise<EnrollmentResponse[]> => {
  const res =
    await axiosInstance.get<EnrollmentResponse[]>("/enrollments/me");
  return res.data;
};
