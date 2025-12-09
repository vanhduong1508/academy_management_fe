import { axiosInstance } from "../index";
import type {
  LocationStat,
  CourseYearStatistic,
} from "../../types/admin/admin-statistics.types";
import type {
  StudentLearningHistory,
} from "../../types/admin/admin-enrollment.types";


export const getStudentStatsByHometownApi = async (): Promise<LocationStat[]> => {
  const res = await axiosInstance.get<LocationStat[]>(
    "/admin/statistics/by-hometown"
  );
  return res.data;
};

export const getStudentStatsByProvinceApi = async (): Promise<LocationStat[]> => {
  const res = await axiosInstance.get<LocationStat[]>(
    "/admin/statistics/students/by-province"
  );
  return res.data;
};


export const getCourseStatisticsByYearApi = async (
  year: number
): Promise<CourseYearStatistic[]> => {
  const res = await axiosInstance.get<CourseYearStatistic[]>(
    "/admin/statistics/courses/by-year",
    {
      params: { year },
    }
  );
  return res.data;
};

export const getStudentLearningHistoryApi = async (
  studentId: number
): Promise<StudentLearningHistory> => {
  const res = await axiosInstance.get<StudentLearningHistory>(
    `/admin/students/${studentId}/learning-history`
  );
  return res.data;
};
