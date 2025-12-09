import { useEffect, useState } from "react";
import {
  getAllEnrollmentsProgressApi,
  updateCompletionResultApi,
  type CompletionResult,
} from "../../api/admin/admin-enrollments.api";
import {
  issueCertificateApi,
  getCertificateHistoryApi,
} from "../../api/admin/admin-certificates.api";
import type {
  CertificateResponse,
  CertificateResult,
} from "../../types/admin/admin-certificate.types";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";
import styles from "../../styles/AdminCertificatesPage.module.css";

type EnrollmentRow = EnrollmentProgressResponse & {
  selectedResult: CertificateResult;
};

export default function CertificatePage() {
  const [tab, setTab] = useState<"manage" | "history">("manage");

  // === Manage tab ===
  const [items, setItems] = useState<EnrollmentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<number | null>(null);

  // === History tab ===
  const [historyItems, setHistoryItems] = useState<CertificateResponse[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [historySize] = useState(10);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyKeyword, setHistoryKeyword] = useState("");
  const [historyResultFilter, setHistoryResultFilter] =
    useState<CertificateResult | "">("");

  // === Fetch Manage Data ===
  const fetchManageData = async () => {
    try {
      setLoading(true);
      const data = await getAllEnrollmentsProgressApi();
      const mapped: EnrollmentRow[] = data.map((x) => ({
        ...x,
        selectedResult: "PASS",
      }));
      setItems(mapped);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // === Fetch History Data with Pagination & Filter ===
  const fetchHistoryData = async () => {
    try {
      setHistoryLoading(true);
      const data = await getCertificateHistoryApi(
        historyPage,
        historySize,
        historyKeyword,
        historyResultFilter || undefined,
      );
      setHistoryItems(data.content);
      setHistoryTotal(data.totalElements);
    } catch (err: any) {
      console.error(err);
      setHistoryError("Không tải được lịch sử chứng chỉ.");
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (tab === "manage") fetchManageData();
    else fetchHistoryData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, historyPage, historyKeyword, historyResultFilter]);

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

    const completionResult: CompletionResult =
      target.selectedResult === "PASS" ? "PASSED" : "FAILED";

    await updateCompletionResultApi(enrollmentId, { result: completionResult });


    if (target.selectedResult === "PASS") {
      await issueCertificateApi(enrollmentId, { result: target.selectedResult });
    }

    setItems((prev) => prev.filter((x) => x.enrollmentId !== enrollmentId));

    const newHistoryItem: CertificateResponse = {
      enrollmentId: target.enrollmentId,
      studentId: target.studentId,
      studentName: target.studentName,
      courseId: target.courseId,
      courseTitle: target.courseTitle,
      result: target.selectedResult,
      issuedAt: new Date().toISOString(),
      studentCode: "",
      courseCode: "",
      certificateCode: ""
    };

    // Nếu đang ở tab history và đang ở trang đầu tiên (page 0), thêm trực tiếp
    if (tab === "history" && historyPage === 0) {
      setHistoryItems((prev) => [newHistoryItem, ...prev]);
    }
    setHistoryTotal((prev) => prev + 1);

  } catch (err: any) {
    console.error(err);
    alert(err?.response?.data?.message || "Cập nhật / cấp chứng chỉ thất bại");
  } finally {
    setActionId(null);
  }
};

const translateResultForHistory = (result: CertificateResult) => {
  switch (result) {
    case "NOT_REVIEWED":
      return "Chưa duyệt";
    case "PASS":
      return "Đạt";
    case "FAIL":
      return "Không đạt";
    default:
      return result;
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

  const totalPages = Math.ceil(historyTotal / historySize);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Quản lý chứng chỉ</h2>
        <div className={styles.tabGroup}>
          <button
            className={`${styles.tabButton} ${tab === "manage" ? styles.tabActive : ""}`}
            onClick={() => setTab("manage")}
          >
            Cấp chứng chỉ
          </button>
          <button
            className={`${styles.tabButton} ${tab === "history" ? styles.tabActive : ""}`}
            onClick={() => setTab("history")}
          >
            Lịch sử chứng chỉ
          </button>
        </div>
      </div>

      {/* === Manage Tab === */}
      {tab === "manage" && (
        <>
          {loading ? (
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
        </>
      )}

      {/* === History Tab === */}
      {tab === "history" && (
        <>
          <div className={styles.filterRow}>
            <input
              type="text"
              placeholder="Tìm kiếm học viên hoặc khóa học..."
              value={historyKeyword}
              onChange={(e) => {
                setHistoryKeyword(e.target.value);
                setHistoryPage(0);
              }}
              className={styles.inputFilter}
            />
            <select
              value={historyResultFilter}
              onChange={(e) => {
                setHistoryResultFilter(e.target.value as CertificateResult | "");
                setHistoryPage(0);
              }}
              className={styles.selectFilter}
            >
              <option value="">Tất cả kết quả</option>
              <option value="PASS">Đạt</option>
              <option value="FAIL">Không đạt</option>
            </select>
          </div>

          {historyLoading ? (
            <p className={styles.infoText}>Đang tải dữ liệu...</p>
          ) : historyError ? (
            <p className={styles.error}>{historyError}</p>
          ) : historyItems.length === 0 ? (
            <p className={styles.infoText}>Hiện chưa có chứng chỉ nào được cấp.</p>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.th}>Học viên</th>
                      <th className={styles.th}>Khóa học</th>
                      <th className={styles.th}>Kết quả</th>
                      <th className={styles.th}>Ngày cấp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyItems.map((item) => (
                      <tr key={item.enrollmentId} className={styles.tr}>
                        <td className={styles.td}>{item.studentName}</td>
                        <td className={styles.td}>{item.courseTitle}</td>
                        <td className={styles.td}>{translateResultForHistory(item.result)}</td>
                        <td className={styles.td}>
                          {new Date(item.issuedAt).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className={styles.pagination}>
                <button
                  onClick={() => setHistoryPage((p) => Math.max(0, p - 1))}
                  disabled={historyPage === 0}
                >
                  {"<"}
                </button>
                <span>
                  {historyPage + 1} / {totalPages}
                </span>
                <button
                  onClick={() => setHistoryPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={historyPage + 1 >= totalPages}
                >
                  {">"}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
