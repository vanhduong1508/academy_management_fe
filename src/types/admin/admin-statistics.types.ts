// Thống kê số lượng học viên theo địa điểm (quê quán / tỉnh)
export interface LocationStat {
    name: string;
    count: number;
}

export interface CourseYearStatistic {
  courseId: number;
  courseTitle: string;
  startDate: string;

  totalStudents: number;
  passedCount: number;
  failedCount: number;
}
