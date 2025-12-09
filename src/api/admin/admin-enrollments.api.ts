import { axiosInstance } from "../index";
import type { EnrollmentCompletion } from "../../types/admin/admin-enrollment.types";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";

export type CompletionResult = "NOT_REVIEWED" | "PASSED" | "FAILED";

export interface UpdateCompletionResultPayload {
  result: CompletionResult;
}

export const updateCompletionResultApi = async (
  enrollmentId: number,
  payload: UpdateCompletionResultPayload
): Promise<EnrollmentCompletion> => {
  const res = await axiosInstance.put<EnrollmentCompletion>(
    `/admin/enrollments/${enrollmentId}/result`,
    payload
  );
  return res.data;
};

export const getAllEnrollmentsProgressApi = async (): Promise<
  EnrollmentProgressResponse[]
> => {
  const res = await axiosInstance.get<EnrollmentProgressResponse[]>(
    "/admin/enrollments/ready-for-certificate"
  );
  return res.data;
};
