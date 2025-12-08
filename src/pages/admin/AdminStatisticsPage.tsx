// src/pages/admin/AdminStatisticsPage.tsx
import { useEffect, useMemo, useState, useRef } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import {
  getStudentStatsByHometownApi,
  getStudentStatsByProvinceApi,
  getCourseStatisticsByYearApi,
} from "../../api/admin/admin-statistics.api";

import { getStudentLearningHistoryApi } from "../../api/admin/admin-statistics.api";

import type {
  LocationStat,
  CourseYearStatistic,
} from "../../types/admin/admin-statistics.types";

import type { StudentLearningHistory } from "../../types/admin/admin-enrollment.types";

import styles from "../../styles/AdminStatisticsPage.module.css";

type SectionKey = "hometown" | "province" | "courses" | "learning-history";
const ORDER: SectionKey[] = [
  "hometown",
  "province",
  "courses",
  "learning-history",
];
const CURRENT_YEAR = new Date().getFullYear();

export default function AdminStatisticsPage() {
  const [active, setActive] = useState<SectionKey>("hometown");
  const prevRef = useRef<SectionKey>("hometown");
  const [direction, setDirection] = useState<"left" | "right">("right");

  // HOMETOWN
  const [hometowns, setHometowns] = useState<LocationStat[]>([]);
  const [hometownLoading, setHometownLoading] = useState(false);
  const [hometownError, setHometownError] = useState<string | null>(null);
  const [hometownTopN, setHometownTopN] = useState<number>(10);

  // PROVINCE
  const [provinces, setProvinces] = useState<LocationStat[]>([]);
  const [provinceLoading, setProvinceLoading] = useState(false);
  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [provinceTopN, setProvinceTopN] = useState<number>(10);

  // COURSES
  const [courseYear, setCourseYear] = useState<number>(CURRENT_YEAR);
  const [courses, setCourses] = useState<CourseYearStatistic[]>([]);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState<string | null>(null);

  // HISTORY
  const [historyStudentId, setHistoryStudentId] = useState<number>(0);
  const [history, setHistory] = useState<StudentLearningHistory | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  /* ---------- Fetchers ---------- */
  const fetchHometowns = async () => {
    try {
      setHometownLoading(true);
      setHometownError(null);
      const res = await getStudentStatsByHometownApi();
      setHometowns(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error(err);
      setHometownError(err?.message || "Không tải được thống kê quê quán");
      setHometowns([]);
    } finally {
      setHometownLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      setProvinceLoading(true);
      setProvinceError(null);
      const res = await getStudentStatsByProvinceApi();
      setProvinces(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error(err);
      setProvinceError(err?.message || "Không tải được thống kê tỉnh");
      setProvinces([]);
    } finally {
      setProvinceLoading(false);
    }
  };

  const fetchCourses = async (year: number) => {
    try {
      setCourseLoading(true);
      setCourseError(null);
      const res = await getCourseStatisticsByYearApi(year);
      setCourses(Array.isArray(res) ? res : []);
    } catch (err: any) {
      console.error(err);
      setCourseError(
        err?.message || `Không tải được thống kê khóa học cho năm ${year}`
      );
      setCourses([]);
    } finally {
      setCourseLoading(false);
    }
  };

  const fetchHistory = async (studentId: number) => {
    if (!studentId) return;

    try {
      setHistoryLoading(true);
      setHistoryError(null);
      const res = await getStudentLearningHistoryApi(studentId);
      setHistory(res ?? null);
    } catch (err: any) {
      console.error(err);
      setHistoryError(err?.message || "Không tải được lịch sử học tập");
      setHistory(null);
    } finally {
      setHistoryLoading(false);
    }
  };

  /* ---------- Initial load: load first active only ---------- */
  useEffect(() => {
    if (active === "hometown") fetchHometowns();
    if (active === "province") fetchProvinces();
    if (active === "courses") fetchCourses(courseYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- When active changes: set direction and load if needed ---------- */
  useEffect(() => {
    const prev = prevRef.current;
    if (prev !== active) {
      const prevIdx = ORDER.indexOf(prev);
      const nextIdx = ORDER.indexOf(active);
      setDirection(nextIdx > prevIdx ? "right" : "left");
      prevRef.current = active;
    }

    if (active === "hometown" && hometowns.length === 0 && !hometownLoading)
      fetchHometowns();
    if (active === "province" && provinces.length === 0 && !provinceLoading)
      fetchProvinces();
    if (active === "courses" && courses.length === 0 && !courseLoading)
      fetchCourses(courseYear);
    if (active === "learning-history" && history === null && !historyLoading)
      fetchHistory(historyStudentId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  /* ---------- When year changes and viewing courses ---------- */
  useEffect(() => {
    if (active === "courses") fetchCourses(courseYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseYear]);

  const hometownChartData = useMemo(() => {
    return (hometowns ?? [])
      .slice()
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, hometownTopN)
      .map((it) => ({
        name: it.name ?? "Chưa cập nhật",
        count: it.count ?? 0,
      }));
  }, [hometowns, hometownTopN]);

  const provinceChartData = useMemo(() => {
    return (provinces ?? [])
      .slice()
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, provinceTopN)
      .map((it) => ({
        name: it.name ?? "Chưa cập nhật",
        count: it.count ?? 0,
      }));
  }, [provinces, provinceTopN]);

  const courseChartData = useMemo(() => {
    return (courses ?? []).map((c) => ({
      name: c.courseTitle ?? "Không tên",
      passed: c.passedCount ?? 0,
      failed: c.failedCount ?? 0,
      total: c.totalStudents ?? 0,
    }));
  }, [courses]);

  const renderStatusVi = (status: string) => {
    switch (status) {
      case "ENROLLED":
        return "Đang học";
      case "COMPLETED":
        return "Đã hoàn thành";
      case "NOT_COMPLETED":
        return "Chưa hoàn thành";
      default:
        return status;
    }
  };

  const renderResultVi = (result: string | null) => {
    switch (result) {
      case "PASS":
      case "PASSED":
        return "Đạt";
      case "FAIL":
      case "FAILED":
        return "Không đạt";
      case "NOT_REVIEWED":
        return "Chưa duyệt";
      default:
        return "-";
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Thống kê</h2>
          <p className={styles.subtitle}>Chọn 1 phần để xem biểu đồ</p>
        </div>

        <div className={styles.headerActions}>
          <button
            className={`${styles.navButton} ${
              active === "hometown" ? styles.navButtonActive : ""
            }`}
            onClick={() => setActive("hometown")}
            aria-pressed={active === "hometown"}
          >
            Quê quán
          </button>

          <button
            className={`${styles.navButton} ${
              active === "province" ? styles.navButtonActive : ""
            }`}
            onClick={() => setActive("province")}
            aria-pressed={active === "province"}
          >
            Tỉnh / Thành
          </button>

          <button
            className={`${styles.navButton} ${
              active === "courses" ? styles.navButtonActive : ""
            }`}
            onClick={() => setActive("courses")}
            aria-pressed={active === "courses"}
          >
            Khóa học theo năm
          </button>

          <button
            className={`${styles.navButton} ${
              active === "learning-history" ? styles.navButtonActive : ""
            }`}
            onClick={() => setActive("learning-history")}
            aria-pressed={active === "learning-history"}
          >
            Lịch sử học tập
          </button>
        </div>
      </div>

      <div className={styles.sectionsViewport}>
        {/* HOMETOWN */}
        <section
          className={`${styles.sectionPane} ${
            active === "hometown" ? styles.visible : ""
          } ${direction === "left" ? styles.fromLeft : styles.fromRight}`}
        >
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Học viên theo quê quán</h3>
                <p className={styles.sectionDescription}>
                  Biểu đồ phân bố (Top N)
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label className={styles.filterLabel}>
                  Top:
                  <select
                    value={hometownTopN}
                    onChange={(e) => setHometownTopN(Number(e.target.value))}
                    style={{ marginLeft: 8 }}
                  >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                  </select>
                </label>

                <button
                  className={styles.button}
                  onClick={fetchHometowns}
                  disabled={hometownLoading}
                >
                  {hometownLoading ? "⟳" : "Tải lại"}
                </button>
              </div>
            </div>

            {hometownError && (
              <div className={styles.errorBox}>{hometownError}</div>
            )}

            <div className={styles.chartWrapper} style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={hometownChartData}
                  margin={{ top: 12, right: 12, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Số học viên" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* PROVINCE */}
        <section
          className={`${styles.sectionPane} ${
            active === "province" ? styles.visible : ""
          } ${direction === "left" ? styles.fromLeft : styles.fromRight}`}
        >
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>
                  Học viên theo tỉnh / thành
                </h3>
                <p className={styles.sectionDescription}>
                  Biểu đồ phân bố (Top N)
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label className={styles.filterLabel}>
                  Top:
                  <select
                    value={provinceTopN}
                    onChange={(e) => setProvinceTopN(Number(e.target.value))}
                    style={{ marginLeft: 8 }}
                  >
                    <option value={5}>Top 5</option>
                    <option value={10}>Top 10</option>
                    <option value={20}>Top 20</option>
                    <option value={50}>Top 50</option>
                  </select>
                </label>

                <button
                  className={styles.button}
                  onClick={fetchProvinces}
                  disabled={provinceLoading}
                >
                  {provinceLoading ? "⟳" : "Tải lại"}
                </button>
              </div>
            </div>

            {provinceError && (
              <div className={styles.errorBox}>{provinceError}</div>
            )}

            <div className={styles.chartWrapper} style={{ height: 360 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={provinceChartData}
                  margin={{ top: 12, right: 12, bottom: 80 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    height={70}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" name="Số học viên" fill="#06b6d4" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* COURSES */}
        <section
          className={`${styles.sectionPane} ${
            active === "courses" ? styles.visible : ""
          } ${direction === "left" ? styles.fromLeft : styles.fromRight}`}
        >
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Khóa học theo năm</h3>
                <p className={styles.sectionDescription}>
                  Số học viên Đạt / Không đạt
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label className={styles.filterLabel}>
                  Năm:
                  <input
                    type="number"
                    className={styles.yearInput}
                    value={courseYear}
                    onChange={(e) => setCourseYear(Number(e.target.value))}
                    style={{ marginLeft: 8 }}
                  />
                </label>

                <button
                  className={styles.button}
                  onClick={() => fetchCourses(courseYear)}
                  disabled={courseLoading}
                >
                  {courseLoading ? "⟳" : "Tải lại"}
                </button>
              </div>
            </div>

            {courseError && (
              <div className={styles.errorBox}>{courseError}</div>
            )}

            <div className={styles.chartWrapper} style={{ height: 420 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={courseChartData}
                  margin={{ top: 12, right: 12, bottom: 120 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={110}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="passed" name="Đạt" stackId="a" fill="#10b981" />
                  <Bar
                    dataKey="failed"
                    name="Không đạt"
                    stackId="a"
                    fill="#ef4444"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* HISTORY */}
        <section
          className={`${styles.sectionPane} ${
            active === "learning-history" ? styles.visible : ""
          } ${direction === "left" ? styles.fromLeft : styles.fromRight}`}
        >
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>
                  Lịch sử học tập học viên
                </h3>
                <p className={styles.sectionDescription}>
                  Tra cứu theo mã học viên
                </p>
              </div>

              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  type="number"
                  placeholder="Nhập mã học viên"
                  className={styles.yearInput}
                  value={historyStudentId || ""}
                  onChange={(e) => setHistoryStudentId(Number(e.target.value))}
                />

                <button
                  className={styles.button}
                  onClick={() => fetchHistory(historyStudentId)}
                  disabled={historyLoading}
                >
                  {historyLoading ? "⟳" : "Tra cứu"}
                </button>
              </div>
            </div>

            {historyError && (
              <div className={styles.errorBox}>{historyError}</div>
            )}

            {history && (
              <div style={{ marginTop: 16 }}>
                <div className={styles.statsGrid}>
                  <div>
                    Mã học viên: <b>{history.studentCode}</b>
                  </div>
                  <div>
                    ID học viên: <b>{history.studentId}</b>
                  </div>
                  <div>
                    Họ và tên: <b>{history.studentName}</b>
                  </div>

                  <div>
                    Tổng đăng ký: <b>{history.totalEnrollments}</b>
                  </div>
                  <div>
                    Đã hoàn thành: <b>{history.completedEnrollments}</b>
                  </div>
                  <div>
                    Số chứng chỉ: <b>{history.certificateCount}</b>
                  </div>
                  <div>
                    Đạt: <b>{history.passedCount}</b>
                  </div>
                  <div>
                    Không đạt: <b>{history.failedCount}</b>
                  </div>
                  <div>
                    Tiến độ TB: <b>{history.averageProgress.toFixed(1)}%</b>
                  </div>
                </div>

                <table className={styles.table} style={{ marginTop: 16 }}>
                  <thead>
                    <tr>
                      <th>Khoá học</th>
                      <th>Trạng thái</th>
                      <th>Kết quả</th>
                      <th>Tiến độ</th>
                      <th>Chứng chỉ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.enrollments?.length ? (
                      history.enrollments.map((e) => (
                        <tr key={e.id}>
                          <td>{e.courseTitle}</td>
                          <td>{renderStatusVi(e.status)}</td>
                          <td>{renderResultVi(e.result)}</td>
                          <td>{(e.progressPercentage ?? 0).toFixed(1)}%</td>
                          <td>{e.certificateCode ?? "-"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ textAlign: "center", padding: 12 }}
                        >
                          Không có dữ liệu
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
