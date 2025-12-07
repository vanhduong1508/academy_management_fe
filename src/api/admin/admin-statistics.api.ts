// src/api/admin/admin-statistics.api.ts
import { api } from "../index";

import type {
  LocationStat,
  CourseYearStatistic,
} from "../../types/admin/admin-statistics.types";

// BE: @RequestMapping("/api/admin/statistics")

// GET /api/admin/statistics/by-hometown
export async function getStudentStatsByHometownApi(): Promise<LocationStat[]> {
  const res = await api.get("/admin/statistics/by-hometown");
  return res.data;
}

// GET /api/admin/statistics/students/by-province
export async function getStudentStatsByProvinceApi(): Promise<LocationStat[]> {
  const res = await api.get("/admin/statistics/students/by-province");
  return res.data;
}

// GET /api/admin/statistics/courses/by-year?year=2025
export async function getCourseStatisticsByYearApi(
  year: number
): Promise<CourseYearStatistic[]> {
  const res = await api.get("/admin/statistics/courses/by-year", {
    params: { year },
  });
  // BE trả List<CourseYearStatisticResponse> → res.data là array
  return res.data;
}
