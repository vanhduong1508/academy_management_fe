// src/pages/admin/DashboardPage.tsx
import { useEffect, useState } from "react";

import { getStudentsPageApi } from "../../api/admin/admin-students.api";
import { getAdminCoursesPageApi } from "../../api/admin/admin-courses.api";
import { getPendingOrdersApi } from "../../api/admin/admin-orders.api";
import { getIssuedCertificatesApi } from "../../api/admin/admin-certificates.api";
import { getAllEnrollmentProgressForAdminApi } from "../../api/admin/admin-progress.api";

import type { PageResponse } from "../../types/shared/pagination.types";
import type { AdminStudent } from "../../types/admin/admin-student.types";
import type { CourseResponse } from "../../types/admin/admin-course.types";
import type { Order } from "../../types/admin/admin-order.types";
import type { CertificateResponse } from "../../types/admin/admin-certificate.types";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";

import styles from "../../styles/AdminDashboardPage.module.css";

export default function DashboardPage() {
  const [studentsPage, setStudentsPage] =
    useState<PageResponse<AdminStudent> | null>(null);
  const [coursesPage, setCoursesPage] =
    useState<PageResponse<CourseResponse> | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [allProgress, setAllProgress] = useState<EnrollmentProgressResponse[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [students, courses, orders, certs, progressList] =
        await Promise.all([
          getStudentsPageApi(0, 50),
          getAdminCoursesPageApi(0, 50),
          getPendingOrdersApi(),
          getIssuedCertificatesApi(),
          getAllEnrollmentProgressForAdminApi(),
        ]);

      setStudentsPage(students);
      setCoursesPage(courses);
      setPendingOrders(orders);
      setCertificates(certs);
      setAllProgress(progressList);
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

  // ====== DERIVED DATA ======
  const totalStudents =
    studentsPage?.totalElements ?? studentsPage?.content.length ?? 0;
  const totalCourses =
    coursesPage?.totalElements ?? coursesPage?.content.length ?? 0;
  const totalCertificates = certificates.length;
  const pendingOrdersCount = pendingOrders.length;

  const totalEnrollments = allProgress.length;
  // Ở đây dùng progressPercentage === 100 thay vì status
  const completedEnrollments = allProgress.filter(
    (e) => e.progressPercentage === 100
  ).length;
  const inProgressEnrollments = totalEnrollments - completedEnrollments;

  const recentStudents = studentsPage?.content.slice(0, 5) ?? [];
  const recentCourses = coursesPage?.content.slice(0, 5) ?? [];
  const recentCertificates = certificates.slice(0, 10);

  const courseStats = buildCourseStats(allProgress);

  return (
    <div className={styles.page}>
      {/* HEADER */}
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Tổng quan hệ thống</h2>
          <p className={styles.subtitle}>
            Học viên, khóa học, tiến độ học tập, chứng chỉ và đơn hàng chờ duyệt.
          </p>
        </div>
        <button
          onClick={fetchDashboard}
          className={styles.refreshButton}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {/* ====== HÀNG 1: STAT CARDS ====== */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Tổng số học viên</p>
          <p className={styles.statValue}>{totalStudents}</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Tổng số khóa học</p>
          <p className={styles.statValue}>{totalCourses}</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Tổng số enrollment</p>
          <p className={styles.statValue}>{totalEnrollments}</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Đang học</p>
          <p className={styles.statValue}>{inProgressEnrollments}</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Đã hoàn thành</p>
          <p className={styles.statValue}>{completedEnrollments}</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Chứng chỉ đã cấp</p>
          <p className={styles.statValue}>{totalCertificates}</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Đơn hàng chờ duyệt</p>
          <p className={styles.statValue}>{pendingOrdersCount}</p>
        </div>
      </div>

      {/* ====== HÀNG 2: ĐƠN HÀNG & CHỨNG CHỈ ====== */}
      <section className={styles.section}>
        <div className={styles.twoColumns}>
          {/* ĐƠN HÀNG CHỜ DUYỆT */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Đơn hàng chờ duyệt</h3>
              <span className={styles.badge}>{pendingOrdersCount}</span>
            </div>
            <div className={styles.cardBody}>
              {pendingOrders.length === 0 ? (
                <p>Hiện không có đơn hàng nào đang chờ duyệt.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Học viên</th>
                      <th>Khóa học</th>
                      <th>Số tiền</th>
                      <th>Ngày tạo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingOrders.map((order: any) => (
                      <tr key={order.id}>
                        <td>{order.code || order.id}</td>
                        <td>{order.studentName || order.student?.fullName}</td>
                        <td>{order.courseTitle || order.course?.title}</td>
                        <td>{order.totalAmount ?? order.amount}</td>
                        <td>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* CHỨNG CHỈ MỚI CẤP GẦN ĐÂY */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Chứng chỉ mới cấp gần đây</h3>
              <span className={styles.badge}>{recentCertificates.length}</span>
            </div>
            <div className={styles.cardBody}>
              {recentCertificates.length === 0 ? (
                <p>Chưa có chứng chỉ nào được cấp.</p>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Mã chứng chỉ</th>
                      <th>Học viên</th>
                      <th>Khóa học</th>
                      <th>Kết quả</th>
                      <th>Ngày cấp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCertificates.map((c) => (
                      <tr key={c.id}>
                        {/* bỏ c.code vì type không có */}
                        <td>{c.certificateCode || c.id}</td>
                        <td>{c.studentName}</td>
                        <td>{c.courseTitle}</td>
                        <td>{c.result}</td>
                        <td>
                          {c.issuedAt
                            ? new Date(c.issuedAt).toLocaleString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====== HÀNG 3: TÌNH HÌNH HỌC TẬP (THEO KHÓA) ====== */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Tình hình hoàn thành theo khóa học</h3>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            {courseStats.length === 0 ? (
              <p>Chưa có enrollment nào.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Khóa học</th>
                    <th>Đang học</th>
                    <th>Đã hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {courseStats.map((c) => (
                    <tr key={c.courseId}>
                      <td>{c.courseTitle}</td>

                      <td>{c.inProgress}</td>
                      <td>{c.completed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.twoColumns}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Học viên mới</h3>
            </div>
            <div className={styles.cardBody}>
              {recentStudents.length === 0 ? (
                <p>Chưa có học viên nào.</p>
              ) : (
                <ul className={styles.simpleList}>
                  {recentStudents.map((s: any) => (
                    <li key={s.id} className={styles.simpleListItem}>
                      <div className={styles.simpleListMain}>
                        {s.fullName || s.name}
                      </div>
                      <div className={styles.simpleListSub}>
                        {(s.code || s.studentCode) && (
                          <>
                            {s.code || s.studentCode}
                          </>
                        )}
                        {s.email}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* KHÓA HỌC MỚI */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Khóa học mới</h3>
            </div>
            <div className={styles.cardBody}>
              {recentCourses.length === 0 ? (
                <p>Chưa có khóa học nào.</p>
              ) : (
                <ul className={styles.simpleList}>
                  {recentCourses.map((c: any) => (
                    <li key={c.id} className={styles.simpleListItem}>
                      <div className={styles.simpleListMain}>{c.title}</div>
                      <div className={styles.simpleListSub}>
                        {c.code}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


function buildCourseStats(allProgress: EnrollmentProgressResponse[]) {
  const map = new Map<
    number,
    {
      courseId: number;
      courseCode: string;
      courseTitle: string;
      completed: number;
      inProgress: number;
    }
  >();

  for (const e of allProgress) {
    if (!map.has(e.courseId)) {
      map.set(e.courseId, {
        courseId: e.courseId,
        courseCode: e.courseCode,
        courseTitle: e.courseTitle,
        completed: 0,
        inProgress: 0,
      });
    }
    const item = map.get(e.courseId)!;

    if (e.progressPercentage === 100) {
      item.completed += 1;
    } else {
      item.inProgress += 1;
    }
  }

  return Array.from(map.values());
}
