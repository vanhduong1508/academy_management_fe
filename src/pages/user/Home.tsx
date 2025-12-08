import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyEnrollmentsApi } from "../../api/student/enrollment.api";
import { getMyOrdersApi } from "../../api/student/order.api";
import { getMyCertificatesApi } from "../../api/student/certificate.api";
import { getMyProfileApi } from "../../api/student/student.api";

import type { EnrollmentResponse } from "../../types/student/enrollment.types";
import type { OrderResponse } from "../../types/student/order.types";
import type { CertificateResponse } from "../../types/student/certificate.types";

import styles from "../../styles/user/UserDashboard.module.css";

export default function Home() {
  const navigate = useNavigate();
  
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const [enrolls, ordersData, certs] = await Promise.all([
        getMyEnrollmentsApi(),
        getMyOrdersApi(),
        getMyCertificatesApi(),
      ]);

      setEnrollments(enrolls);
      setOrders(ordersData);
      setCertificates(certs);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const activeEnrollments = enrollments.filter(
    (e) => e.status === "ENROLLED"
  );
  const completedCourses = enrollments.filter(
    (e) => e.status === "COMPLETED"
  );
  const pendingOrders = orders.filter(
    (o) => o.paymentStatus === "PENDING" && o.approvalStatus === "PENDING"
  );

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Bảng điều khiển</h2>
          <p className={styles.subtitle}>
            Tổng quan về khóa học, đơn hàng và chứng chỉ của bạn.
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
        <div
          className={styles.statCard}
          onClick={() => navigate("/student/my-courses")}
          style={{ cursor: "pointer" }}
        >
          <p className={styles.statLabel}>Khóa học đang học</p>
          <p className={styles.statValue}>{activeEnrollments.length}</p>
        </div>

        <div
          className={styles.statCard}
          onClick={() => navigate("/student/my-courses")}
          style={{ cursor: "pointer" }}
        >
          <p className={styles.statLabel}>Khóa học đã hoàn thành</p>
          <p className={styles.statValue}>{completedCourses.length}</p>
        </div>

        <div
          className={styles.statCard}
          onClick={() => navigate("/student/orders")}
          style={{ cursor: "pointer" }}
        >
          <p className={styles.statLabel}>Đơn hàng chờ thanh toán</p>
          <p className={styles.statValue}>{pendingOrders.length}</p>
        </div>

        <div
          className={styles.statCard}
          onClick={() => navigate("/student/certificates")}
          style={{ cursor: "pointer" }}
        >
          <p className={styles.statLabel}>Chứng chỉ đã nhận</p>
          <p className={styles.statValue}>{certificates.length}</p>
        </div>
      </div>

      {/* Recent Enrollments */}
      {activeEnrollments.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Khóa học đang học</h3>
          <div className={styles.cardList}>
            {activeEnrollments.slice(0, 3).map((enrollment) => (
              <div
                key={enrollment.id}
                className={styles.card}
                onClick={() =>
                  navigate(`/student/learning/${enrollment.courseId}`, {
                    state: { enrollmentId: enrollment.id },
                  })
                }
              >
                <h4 className={styles.cardTitle}>{enrollment.courseTitle}</h4>
                {enrollment.progressPercentage != null && (
                  <>
                    <p className={styles.cardSub}>
                      Tiến độ: {enrollment.progressPercentage.toFixed(1)}%
                    </p>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressInner}
                        style={{
                          width: `${enrollment.progressPercentage}%`,
                        }}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

