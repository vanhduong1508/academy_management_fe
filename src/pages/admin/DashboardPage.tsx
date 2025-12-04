// src/pages/admin/DashboardPage.tsx
import { useEffect, useState } from "react";
import { getStudentsPageApi } from "../../api/admin/admin-students.api";
import { getAdminCoursesPageApi } from "../../api/admin/admin-courses.api";
import { getAllEnrollmentsProgressApi } from "../../api/admin/admin-enrollments.api";
import { getPendingOrdersApi } from "../../api/admin/admin-orders.api";

import type { PageResponse } from "../../types/models/course.types";
import type { Student } from "../../types/models/user.types";
import type { Course } from "../../types/models/course.types";
import type { EnrollmentCompletion } from "../../types/models/enrollment.types";
import type { Order } from "../../types/models/order.types";

import styles from "../../styles/AdminDashboardPage.module.css";

interface DashboardStats {
  totalStudents: number;
  totalCourses: number;
  totalEnrollments: number;
  totalCertificates: number;

  completedCount: number;
  inProgressCount: number;
  notCompletedCount: number;

  pendingOrdersCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalCertificates: 0,
    completedCount: 0,
    inProgressCount: 0,
    notCompletedCount: 0,
    pendingOrdersCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      // Lấy tổng students & courses bằng PageResponse.totalElements
      const [studentsPage, coursesPage, enrollmentsProgress, pendingOrders] =
        await Promise.all([
          getStudentsPageApi(0, 1) as Promise<PageResponse<Student>>,
          getAdminCoursesPageApi(0, 1) as Promise<PageResponse<Course>>,
          getAllEnrollmentsProgressApi() as Promise<EnrollmentCompletion[]>,
          getPendingOrdersApi() as Promise<Order[]>,
        ]);

      const totalStudents =
        studentsPage.totalElements ?? studentsPage.content.length;
      const totalCourses =
        coursesPage.totalElements ?? coursesPage.content.length;

      const totalEnrollments = enrollmentsProgress.length;
      const completed = enrollmentsProgress.filter(
        (e) => e.status === "COMPLETED"
      ).length;
      const notCompleted = enrollmentsProgress.filter(
        (e) => e.status === "NOT_COMPLETED"
      ).length;
      const inProgress = totalEnrollments - completed - notCompleted;

      const totalCertificates = enrollmentsProgress.filter(
        (e) => e.hasCertificate
      ).length;

      const pendingOrdersCount = pendingOrders.length;

      setStats({
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalCertificates,
        completedCount: completed,
        inProgressCount: inProgress,
        notCompletedCount: notCompleted,
        pendingOrdersCount,
      });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Không tải được dữ liệu tổng quan."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const {
    totalStudents,
    totalCourses,
    totalEnrollments,
    totalCertificates,
    completedCount,
    inProgressCount,
    notCompletedCount,
    pendingOrdersCount,
  } = stats;

  const percent = (value: number, total: number) =>
    total === 0 ? 0 : (value / total) * 100;

  const totalForProgress =
    completedCount + inProgressCount + notCompletedCount || 1;

  return (
    <div className={styles.page}>
      <p className={styles.greeting}>
        Tổng quan hệ thống: học viên, khóa học, tiến độ học tập và đơn hàng.
      </p>

      {error && <p style={{ color: "#fecaca", fontSize: 13 }}>{error}</p>}

      {/* TOP CARDS */}
      <div className={styles.cardsRow}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Tổng số học viên</span>
          <span className={styles.cardValue}>{totalStudents}</span>
          <span className={styles.cardSub}>
            Số tài khoản student đã đăng ký.
          </span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Tổng số khóa học</span>
          <span className={styles.cardValue}>{totalCourses}</span>
          <span className={styles.cardSub}>
            Các khóa học đang được quản lý trên hệ thống.
          </span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Lượt đăng ký (Enrollment)</span>
          <span className={styles.cardValue}>{totalEnrollments}</span>
          <span className={styles.cardSub}>
            Tổng số lượt học viên tham gia khóa học.
          </span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Chứng chỉ đã cấp</span>
          <span className={styles.cardValue}>{totalCertificates}</span>
          <span className={styles.cardSub}>
            Tổng số chứng chỉ đã được phát hành.
          </span>
        </div>
      </div>

      {/* MAIN */}
      <div className={styles.mainGrid}>
        {/* ENROLLMENT PROGRESS SUMMARY */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Tiến độ học tập</h3>
          <p className={styles.sectionSub}>
            Phân bố trạng thái các enrollment: đang học, đã hoàn thành, không
            hoàn thành.
          </p>

          <div className={styles.progressList}>
            <div className={styles.progressItem}>
              <div className={styles.progressLabelRow}>
                <span className={styles.progressLabel}>Đã hoàn thành</span>
                <span className={styles.progressCount}>
                  {completedCount} (
                  {percent(completedCount, totalForProgress).toFixed(1)}%)
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressInnerCompleted}
                  style={{
                    width: `${percent(completedCount, totalForProgress)}%`,
                  }}
                />
              </div>
            </div>

            <div className={styles.progressItem}>
              <div className={styles.progressLabelRow}>
                <span className={styles.progressLabel}>Đang học</span>
                <span className={styles.progressCount}>
                  {inProgressCount} (
                  {percent(inProgressCount, totalForProgress).toFixed(1)}%)
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressInnerInProgress}
                  style={{
                    width: `${percent(inProgressCount, totalForProgress)}%`,
                  }}
                />
              </div>
            </div>

            <div className={styles.progressItem}>
              <div className={styles.progressLabelRow}>
                <span className={styles.progressLabel}>Không hoàn thành</span>
                <span className={styles.progressCount}>
                  {notCompletedCount} (
                  {percent(notCompletedCount, totalForProgress).toFixed(1)}%)
                </span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressInnerNotCompleted}
                  style={{
                    width: `${percent(notCompletedCount, totalForProgress)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS SUMMARY */}
        <div className={styles.sectionCard}>
          <h3 className={styles.sectionTitle}>Tình hình đơn hàng</h3>
          <p className={styles.sectionSub}>
            Số đơn đang chờ admin duyệt. Chi tiết xử lý ở tab &quot;Quản lý thanh
            toán&quot;.
          </p>

          <div className={styles.ordersSummary}>
            <div className={styles.ordersRow}>
              <span className={styles.ordersLabel}>Đơn chờ duyệt</span>
              <span className={styles.ordersValue}>{pendingOrdersCount}</span>
            </div>
            {/* Sau này có thể thêm thống kê doanh thu, đơn đã duyệt nếu BE hỗ trợ */}
          </div>
        </div>
      </div>

      {loading && (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>Đang tải dữ liệu...</p>
      )}
    </div>
  );
}
