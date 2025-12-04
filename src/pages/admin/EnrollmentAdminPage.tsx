// src/pages/admin/EnrollmentAdminPage.tsx
import { useEffect, useState } from "react";
import { getAllEnrollmentsProgressApi } from "../../api/admin/admin-enrollments.api";
import type { EnrollmentCompletion } from "../../types/models/enrollment.types";
import styles from "../../styles/AdminProgressPage.module.css";

export default function EnrollmentAdminPage() {
  const [items, setItems] = useState<EnrollmentCompletion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllEnrollmentsProgressApi();
      setItems(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Không tải được dữ liệu tiến độ học tập."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStatusBadge = (status: EnrollmentCompletion["status"]) => {
    const base = styles.badge;
    if (status === "COMPLETED") {
      return (
        <span className={`${base} ${styles.badgeStatusCompleted}`}>
          Đã hoàn thành
        </span>
      );
    }
    if (status === "NOT_COMPLETED") {
      return (
        <span className={`${base} ${styles.badgeStatusNotCompleted}`}>
          Không hoàn thành
        </span>
      );
    }
    return (
      <span className={`${base} ${styles.badgeStatus}`}>
        Đang học
      </span>
    );
  };

  const renderCertBadge = (item: EnrollmentCompletion) => {
    const base = styles.badge;
    if (item.hasCertificate) {
      return (
        <span className={`${base} ${styles.badgeCertHas}`}>
          Đã cấp chứng chỉ
        </span>
      );
    }
    if (item.canIssueCertificate) {
      return (
        <span className={`${base} ${styles.badgeCertReady}`}>
          Đủ điều kiện cấp
        </span>
      );
    }
    return (
      <span className={`${base} ${styles.badgeCert}`}>
        Chưa đủ điều kiện
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý quá trình học</h2>
          <p className={styles.subtitle}>
            Theo dõi tiến độ học tập và trạng thái chứng chỉ của các học viên
            trong hệ thống. Tab này chỉ hiển thị dữ liệu tổng quan, không thao
            tác cấp chứng chỉ trực tiếp.
          </p>
        </div>
        <button
          onClick={fetchData}
          className={styles.refreshButton}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && items.length === 0 ? (
        <p className={styles.infoText}>Đang tải dữ liệu...</p>
      ) : items.length === 0 ? (
        <p className={styles.infoText}>
          Chưa có dữ liệu enrollments nào.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Học viên</th>
                <th className={styles.th}>Khóa học</th>
                <th className={styles.th}>Tiến độ</th>
                <th className={styles.th}>Trạng thái</th>
                <th className={styles.th}>Chứng chỉ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.enrollmentId} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.cellMain}>
                      <span className={styles.cellTitle}>
                        {item.studentName}
                      </span>
                      <span className={styles.cellSub}>
                        ID: {item.studentId} – {item.studentName}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.cellMain}>
                      <span className={styles.cellTitle}>
                        {item.courseTitle}
                      </span>
                      <span className={styles.cellSub}>
                        Course ID: {item.courseId}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressInner}
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>
                        {item.progressPercent.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className={styles.td}>{renderCertBadge(item)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
