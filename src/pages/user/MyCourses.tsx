// src/pages/user/MyCourses.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyEnrollmentsApi } from "../../api/student/enrollment.api";
import type { EnrollmentResponse } from "../../types/student/enrollment.types";
import styles from "../../styles/user/UserEnrollment.module.css";

export default function MyCourses() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyEnrollmentsApi();
      setEnrollments(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được danh sách khóa học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleContinueLearning = (enrollment: EnrollmentResponse) => {
    navigate(`/student/learning/${enrollment.courseId}`, {
      state: { enrollmentId: enrollment.id },
    });
  };

  const renderStatusBadge = (enrollment: EnrollmentResponse) => {
    if (enrollment.status === "COMPLETED") {
      return <span className={`${styles.badge} ${styles.badgeCompleted}`}>Hoàn thành</span>;
    }
    if (enrollment.status === "NOT_COMPLETED") {
      return <span className={`${styles.badge} ${styles.badgeNotCompleted}`}>Chưa hoàn thành</span>;
    }
    return <span className={`${styles.badge} ${styles.badgeEnrolled}`}>Đang học</span>;
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Khóa học của tôi</h2>
          <p className={styles.subtitle}>
            Danh sách các khóa học bạn đã đăng ký và đang theo học.
          </p>
        </div>
        <button
          className={styles.button}
          onClick={fetchEnrollments}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        {loading && enrollments.length === 0 ? (
          <p className={styles.infoText}>Đang tải danh sách khóa học...</p>
        ) : enrollments.length === 0 ? (
          <p className={styles.infoText}>Bạn chưa đăng ký khóa học nào.</p>
        ) : (
          <div className={styles.enrollmentGrid}>
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className={styles.enrollmentCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{enrollment.courseTitle}</h3>
                  {renderStatusBadge(enrollment)}
                </div>
                <p className={styles.cardSub}>
                  Mã khóa: {enrollment.courseCode}
                </p>
                <p className={styles.cardSub}>
                  Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString("vi-VN")}
                </p>

                {enrollment.progressPercentage != null && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                      <span>Tiến độ học tập</span>
                      <span className={styles.progressPercentage}>
                        {enrollment.progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className={styles.progressBar}>
                      <div
                        className={styles.progressInner}
                        style={{ width: `${enrollment.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                {enrollment.certificateCode && (
                  <div className={styles.certificateBadge}>
                    ✓ Đã nhận chứng chỉ: {enrollment.certificateCode}
                  </div>
                )}

                <div className={styles.cardActions}>
                  {enrollment.status === "ENROLLED" && (
                    <button
                      className={styles.actionButton}
                      onClick={() => handleContinueLearning(enrollment)}
                    >
                      Tiếp tục học
                    </button>
                  )}
                  {enrollment.status === "COMPLETED" && (
                    <button
                      className={styles.actionButton}
                      onClick={() => navigate("/student/certificates")}
                    >
                      Xem chứng chỉ
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

