import { useEffect, useState } from "react";

import {
  getAllEnrollmentProgressForAdminApi,
} from "../../api/admin/admin-progress.api";

import { getIssuedCertificatesApi } from "../../api/admin/admin-certificates.api";

import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";
import type { CertificateResponse } from "../../types/admin/admin-certificate.types";

import styles from "../../styles/AdminProgressPage.module.css";

export default function EnrollmentAdminPage() {
  const [items, setItems] = useState<EnrollmentProgressResponse[]>([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [progressList, certList] = await Promise.all([
        // ✅ list tất cả enrollments + progress
        getAllEnrollmentProgressForAdminApi(),
        // list chứng chỉ đã cấp
        getIssuedCertificatesApi(),
      ]);

      setItems(Array.isArray(progressList) ? progressList : []);
      setCertificates(Array.isArray(certList) ? certList : []);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Không tải được dữ liệu tiến độ học tập."
      );
      setItems([]);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStatusBadge = (item: EnrollmentProgressResponse) => {
    const base = styles.badge;

    if (item.completionResult === "PASSED") {
      return (
        <span className={`${base} ${styles.badgeStatusCompleted}`}>
          Đã hoàn thành (Đạt)
        </span>
      );
    }
    if (item.completionResult === "FAILED") {
      return (
        <span className={`${base} ${styles.badgeStatusNotCompleted}`}>
          Không đạt
        </span>
      );
    }
    return (
      <span className={`${base} ${styles.badgeStatus}`}>
        Đang học / Chưa xét
      </span>
    );
  };

  const renderCertBadge = (item: EnrollmentProgressResponse) => {
    const base = styles.badge;

    const hasCertificate = certificates.some(
      (c) => c.enrollmentId === item.enrollmentId
    );
    const canIssueCertificate = item.eligibleForCertificate && !hasCertificate;

    if (hasCertificate) {
      return (
        <span className={`${base} ${styles.badgeCertHas}`}>
          Đã cấp chứng chỉ
        </span>
      );
    }
    if (canIssueCertificate) {
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
            Theo dõi tiến độ học tập và trạng thái chứng chỉ của các học viên.
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
        <p className={styles.infoText}>Chưa có enrollment nào.</p>
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
                        Mã HV: {item.studentCode} – Enrollment #{item.enrollmentId}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.cellMain}>
                      <span className={styles.cellTitle}>
                        {item.courseTitle}
                      </span>
                      <span className={styles.cellSub}>
                        Mã khóa: {item.courseCode}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.progressWrapper}>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressInner}
                          style={{ width: `${item.progressPercentage}%` }}
                        />
                      </div>
                      <span className={styles.progressText}>
                        {item.progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>{renderStatusBadge(item)}</td>
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
