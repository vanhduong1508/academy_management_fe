import { useEffect, useState } from "react";

import { getStudentsPageApi } from "../../api/admin/admin-students.api";
import { getAdminCoursesPageApi } from "../../api/admin/admin-courses.api";
import { getPendingOrdersApi } from "../../api/admin/admin-orders.api";
import { getIssuedCertificatesApi } from "../../api/admin/admin-certificates.api";

import type { PageResponse } from "../../types/shared/pagination.types";
import type { AdminStudent } from "../../types/admin/admin-student.types";
import type { CourseResponse } from "../../types/admin/admin-course.types";
import type { Order } from "../../types/admin/admin-order.types";
import type { CertificateResponse } from "../../types/admin/admin-certificate.types";

import styles from "../../styles/AdminDashboardPage.module.css";

export default function DashboardPage() {
  const [studentsPage, setStudentsPage] =
    useState<PageResponse<AdminStudent> | null>(null);
  const [coursesPage, setCoursesPage] =
    useState<PageResponse<CourseResponse> | null>(null);
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [students, courses, orders, certs] = await Promise.all([
        getStudentsPageApi(0, 100),         // lấy tối đa 100 học viên
        getAdminCoursesPageApi(0, 100),     // tối đa 100 khóa
        getPendingOrdersApi(),              // list pending orders
        getIssuedCertificatesApi(),         // list certificates đã cấp
      ]);

      setStudentsPage(students);
      setCoursesPage(courses);
      setPendingOrders(orders);
      setCertificates(certs);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được dữ liệu tổng quan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const totalStudents = studentsPage?.content.length ?? 0;
  const totalCourses = coursesPage?.content.length ?? 0;
  const totalCertificates = certificates.length;
  const pendingOrdersCount = pendingOrders.length;

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Tổng quan hệ thống</h2>
          <p className={styles.subtitle}>
            Số lượng học viên, khóa học, chứng chỉ đã cấp và đơn hàng chờ duyệt.
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
          <p className={styles.statLabel}>Chứng chỉ đã cấp</p>
          <p className={styles.statValue}>{totalCertificates}</p>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Đơn hàng chờ duyệt</p>
          <p className={styles.statValue}>{pendingOrdersCount}</p>
        </div>
      </div>
    </div>
  );
}
