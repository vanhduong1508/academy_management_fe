import { useEffect, useState } from "react";

import {
  getStudentsPageApi,
  deleteStudentApi,
} from "../../api/admin/admin-students.api";
import { getEnrollmentsReadyForCertificateApi } from "../../api/admin/admin-progress.api";
import { getIssuedCertificatesApi } from "../../api/admin/admin-certificates.api";

import type { PageResponse } from "../../types/shared/pagination.types";
import type { AdminStudent } from "../../types/admin/admin-student.types";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";
import type { CertificateResponse } from "../../types/admin/admin-certificate.types";

import styles from "../../styles/AdminStudentsPage.module.css";

type EnrollmentWithCert = EnrollmentProgressResponse & {
  hasCertificate: boolean;
  canIssueCertificate: boolean;
};

export default function StudentManagementPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(5);

  const [studentsPage, setStudentsPage] =
    useState<PageResponse<AdminStudent> | null>(null);

  const [enrollments, setEnrollments] = useState<
    EnrollmentProgressResponse[]
  >([]);
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [detailStudent, setDetailStudent] = useState<AdminStudent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setError(null);
      const data = await getStudentsPageApi(page, size);
      setStudentsPage(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Không tải được danh sách học viên."
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      setLoadingEnrollments(true);
      // LIST enrollment đủ điều kiện (BE chỉ có API này)
      const data = await getEnrollmentsReadyForCertificateApi();
      setEnrollments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  const fetchCertificates = async () => {
    try {
      const data = await getIssuedCertificatesApi();
      setCertificates(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    fetchEnrollments();
    fetchCertificates();
  }, []);

  const handleRefresh = () => {
    fetchStudents();
    fetchEnrollments();
    fetchCertificates();
  };

  const totalPages = studentsPage?.totalPages ?? 0;

  const renderActiveBadge = (s: AdminStudent) => {
    const isActive = s.status === "ACTIVE";
    return isActive ? (
      <span className={styles.badgeActive}>Đang hoạt động</span>
    ) : (
      <span className={styles.badgeInactive}>Đã khóa</span>
    );
  };

  const openDetail = (s: AdminStudent) => {
    setDetailStudent(s);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setDetailStudent(null);
  };

  const handleDeleteStudent = async (student: AdminStudent) => {
    const id = student.id;
    const name = student.fullName || student.studentCode || `ID ${id}`;

    if (!window.confirm(`Bạn có chắc muốn xoá học viên "${name}"?`)) {
      return;
    }

    try {
      setDeletingId(id);
      await deleteStudentApi(id);

      setStudentsPage((prev) =>
        prev
          ? {
              ...prev,
              content: prev.content.filter((s) => s.id !== id),
            }
          : prev
      );

      if (detailStudent && detailStudent.id === id) {
        closeDetail();
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Xoá học viên thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  const detailEnrollments: EnrollmentWithCert[] =
    detailStudent == null
      ? []
      : enrollments
          .filter((e) => e.studentId === detailStudent.id)
          .map((e) => {
            const hasCertificate = certificates.some(
              (c) => c.enrollmentId === e.enrollmentId
            );
            const canIssueCertificate =
              e.eligibleForCertificate && !hasCertificate;

            return {
              ...e,
              hasCertificate,
              canIssueCertificate,
            };
          });

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý học viên</h2>
          <p className={styles.subtitle}>
            Danh sách học viên trong hệ thống. Bấm &quot;👁&quot; để xem chi tiết hồ sơ và
            tiến độ học tập.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className={styles.refreshButton}
          disabled={loadingStudents || loadingEnrollments}
        >
          {loadingStudents || loadingEnrollments ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        {loadingStudents && !studentsPage ? (
          <p className={styles.infoText}>Đang tải danh sách học viên...</p>
        ) : !studentsPage || studentsPage.content.length === 0 ? (
          <p className={styles.infoText}>Chưa có học viên nào.</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Học viên</th>
                  <th className={styles.th}>Mã HV</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={`${styles.th} ${styles.thRight}`}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {studentsPage.content.map((s) => {
                  const id = s.id;
                  const studentCode = s.studentCode ?? "-";
                  const fullName = s.fullName || studentCode;
                  const isDeleting = deletingId === id;

                  return (
                    <tr key={id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.cellMain}>
                          <span className={styles.cellTitle}>{fullName}</span>
                          <span className={styles.cellSub}>ID: {id}</span>
                        </div>
                      </td>
                      <td className={styles.td}>{studentCode}</td>
                      <td className={styles.td}>{renderActiveBadge(s)}</td>
                      <td className={`${styles.td} ${styles.tdRight}`}>
                        <button
                          className={`${styles.actionButton} ${styles.actionView}`}
                          title="Xem chi tiết"
                          onClick={() => openDetail(s)}
                        >
                          👁
                        </button>

                        <button
                          className={`${styles.actionButton} ${styles.actionEdit}`}
                          onClick={() =>
                            alert(
                              "Hiện BE chưa cho phép Admin chỉnh sửa hồ sơ học viên. Khi bạn thêm API update, có thể cắm vào đây."
                            )
                          }
                        >
                          Sửa
                        </button>

                        <button
                          className={`${styles.actionButton} ${styles.actionDelete}`}
                          onClick={() => handleDeleteStudent(s)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Đang xoá..." : "Xoá"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className={styles.pagination}>
              <span>
                Trang {page + 1}/{totalPages || 1}
              </span>
              <button
                className={styles.pageButton}
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
              >
                Trước
              </button>
              <button
                className={styles.pageButton}
                disabled={page + 1 >= totalPages}
                onClick={() =>
                  setPage((p) =>
                    totalPages > 0 ? Math.min(totalPages - 1, p + 1) : p
                  )
                }
              >
                Sau
              </button>
            </div>
          </>
        )}
      </div>

      {/* MODAL XEM CHI TIẾT */}
      {isDetailOpen && detailStudent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.detailTitle}>Thông tin học viên</h3>
              <button
                className={styles.modalCloseButton}
                onClick={closeDetail}
              >
                ✕
              </button>
            </div>

            <div className={styles.modalBody}>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Họ tên: </span>
                {detailStudent.fullName || detailStudent.studentCode}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Mã học viên: </span>
                {detailStudent.studentCode ?? "-"}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Ngày sinh: </span>
                {detailStudent.dob
                  ? new Date(detailStudent.dob).toLocaleDateString()
                  : "-"}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Quê quán: </span>
                {detailStudent.hometown ?? "-"}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>
                  Tỉnh/Thành phố:{" "}
                </span>
                {detailStudent.province ?? "-"}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Trạng thái: </span>
                {detailStudent.status}
              </p>

              <h4 className={styles.detailSectionTitle}>
                Quá trình học ({detailEnrollments.length})
              </h4>

              {loadingEnrollments && enrollments.length === 0 ? (
                <p className={styles.detailEmpty}>
                  Đang tải dữ liệu enrollments...
                </p>
              ) : detailEnrollments.length === 0 ? (
                <p className={styles.detailEmpty}>
                  Học viên hiện chưa đăng ký khóa học nào.
                </p>
              ) : (
                <div className={styles.detailEnrollList}>
                  {detailEnrollments.map((e) => (
                    <div key={e.enrollmentId} className={styles.enrollCard}>
                      <p className={styles.enrollTitle}>{e.courseTitle}</p>
                      <p className={styles.enrollSub}>
                        Course ID: {e.courseId} – Enrollment #{e.enrollmentId}
                      </p>
                      <div className={styles.enrollMeta}>
                        <span>
                          Tiến độ: {e.progressPercentage.toFixed(1)}%
                        </span>
                        <span>
                          {e.hasCertificate
                            ? "Đã cấp chứng chỉ"
                            : e.canIssueCertificate
                            ? "Đủ điều kiện cấp"
                            : "Chưa đủ điều kiện"}
                        </span>
                      </div>
                      <div className={styles.enrollProgressBar}>
                        <div
                          className={styles.enrollProgressInner}
                          style={{ width: `${e.progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.buttonSecondary}
                onClick={closeDetail}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
