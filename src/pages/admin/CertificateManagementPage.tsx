import { useEffect, useState } from "react";
import {
  getAllEnrollmentsProgressApi,
  updateCompletionResultApi,
  type CompletionResult,
} from "../../api/admin/admin-enrollments.api";
import { issueCertificateApi } from "../../api/admin/admin-certificates.api";
import type { CertificateResult } from "../../types/admin/admin-certificate.types";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";
import styles from "../../styles/AdminCertificatesPage.module.css";
type EnrollmentRow = EnrollmentProgressResponse & {
  selectedResult: CertificateResult;
};

export default function CertificateManagementPage() {
  const [items, setItems] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data: EnrollmentProgressResponse[] =
        await getAllEnrollmentsProgressApi();

      const mapped: EnrollmentRow[] = data.map((x) => ({
        ...x,
        selectedResult: "PASS",
      }));

      setItems(mapped);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Không tải được danh sách học viên đủ điều kiện cấp chứng chỉ."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChangeResult = (
    enrollmentId: number,
    result: CertificateResult
  ) => {
    setItems((prev) =>
      prev.map((item) =>
        item.enrollmentId === enrollmentId
          ? { ...item, selectedResult: result }
          : item
      )
    );
  };

  const handleIssue = async (enrollmentId: number) => {
    const target = items.find((x) => x.enrollmentId === enrollmentId);
    if (!target) return;

    try {
      setActionId(enrollmentId);

      // 1) Cập nhật completionResult trong Enrollment
      const completionResult: CompletionResult =
        target.selectedResult === "PASS" ? "PASSED" : "FAILED";

      await updateCompletionResultApi(enrollmentId, {
        result: completionResult,
      });

      if (target.selectedResult === "PASS") {
        await issueCertificateApi(enrollmentId, {
          result: target.selectedResult, // "PASS"
        });
      }

      await fetchData();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Cập nhật / cấp chứng chỉ thất bại");
    } finally {
      setActionId(null);
    }
  };

  const renderEligibilityBadge = (item: EnrollmentProgressResponse) => {
    const isReadyForCertificate =
      item.eligibleForCertificate &&
      (item.completionResult === null ||
        item.completionResult === "NOT_REVIEWED");

    if (!isReadyForCertificate) {
      return (
        <span className={`${styles.badge} ${styles.badgeNotEnough}`}>
          Chưa đủ điều kiện
        </span>
      );
    }

    return (
      <span className={`${styles.badge} ${styles.badgeEligible}`}>
        Đủ điều kiện
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý chứng chỉ</h2>
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
          Hiện chưa có học viên nào đủ điều kiện hoặc cần cấp chứng chỉ.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Học viên</th>
                <th className={styles.th}>Khóa học</th>
                <th className={styles.th}>Tiến độ</th>
                <th className={styles.th}>Điều kiện</th>
                <th className={styles.thRight}>Cấp chứng chỉ</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isActing = actionId === item.enrollmentId;
                return (
                  <tr key={item.enrollmentId} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.cellMain}>
                        <span className={styles.cellTitle}>
                          {item.studentName}
                        </span>
                        <span className={styles.cellSub}>
                          ID: {item.studentId} – Enrollment #{item.enrollmentId}
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
                            style={{ width: `${item.progressPercentage}%` }}
                          />
                        </div>
                        <span className={styles.cellSub}>
                          {item.progressPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      {renderEligibilityBadge(item)}
                    </td>
                    <td className={styles.tdRight}>
                      <select
                        value={item.selectedResult}
                        onChange={(e) =>
                          handleChangeResult(
                            item.enrollmentId,
                            e.target.value as CertificateResult
                          )
                        }
                        className={styles.resultSelect}
                        disabled={isActing}
                      >
                        <option value="PASS">Đạt</option>
                        <option value="FAIL">Không đạt</option>
                      </select>
                      <button
                        onClick={() => handleIssue(item.enrollmentId)}
                        disabled={isActing}
                        className={`${styles.actionButton} ${styles.actionIssue}`}
                      >
                        {isActing ? "Đang xử lý..." : "Cập nhật kết quả"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
