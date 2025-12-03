// src/pages/admin/StudentManagementPage.tsx
import { useEffect, useState } from "react";
import { getStudentsPageApi } from "../../api/admin/admin-users.api";
import { getAllEnrollmentsProgressApi } from "../../api/admin/admin-enrollments.api";
import type { Student } from "../../types/models/user.types";
import type { PageResponse } from "../../types/models/course.types";
import type { EnrollmentCompletion } from "../../types/models/enrollment.types";
import styles from "../../styles/AdminStudentsPage.module.css";

export default function StudentManagementPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [studentsPage, setStudentsPage] = useState<PageResponse<Student> | null>(
    null
  );
  const [enrollments, setEnrollments] = useState<EnrollmentCompletion[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoadingStudents(true);
      setError(null);
      const data = await getStudentsPageApi(page, size);
      setStudentsPage(data);
      // nếu chưa chọn ai, set default là thằng đầu tiên của trang
      if (!selectedStudent && data.content.length > 0) {
        setSelectedStudent(data.content[0]);
      }
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
      const data = await getAllEnrollmentsProgressApi();
      setEnrollments(data);
    } catch (err: any) {
      console.error(err);
      // không cần error riêng, vì đây chỉ là extra info
    } finally {
      setLoadingEnrollments(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleRefresh = () => {
    fetchStudents();
    fetchEnrollments();
  };

  const totalPages = studentsPage?.totalPages ?? 0;

  const renderActiveBadge = (s: Student) => {
    const isActive =
      (s as any).isActive ?? (s as any).status === "ACTIVE" ?? true;
    return isActive ? (
      <span className={styles.badgeActive}>Đang hoạt động</span>
    ) : (
      <span className={styles.badgeInactive}>Đã khóa</span>
    );
  };

  const selectedEnrollments = selectedStudent
    ? enrollments.filter((e) => e.studentId === (selectedStudent as any).id)
    : [];

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý học viên</h2>
          <p className={styles.subtitle}>
            Danh sách học viên đã đăng ký hệ thống. Bấm &quot;Xem chi tiết&quot; để xem
            thông tin cá nhân và quá trình học tập của học viên.
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

      <div className={styles.layout}>
        {/* BẢNG HỌC VIÊN */}
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
                    <th className={styles.th}>Email</th>
                    <th className={styles.th}>Trạng thái</th>
                    <th className={styles.thRight}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {studentsPage.content.map((s) => (
                    <tr key={(s as any).id} className={styles.tr}>
                      <td className={styles.td}>
                        <div className={styles.cellMain}>
                          <span className={styles.cellTitle}>
                            {(s as any).fullName ?? (s as any).username}
                          </span>
                          <span className={styles.cellSub}>
                            ID: {(s as any).id}
                          </span>
                        </div>
                      </td>
                      <td className={styles.td}>
                        {(s as any).email ?? "-"}
                      </td>
                      <td className={styles.td}>{renderActiveBadge(s)}</td>
                      <td className={styles.tdRight}>
                        <button
                          className={styles.viewButton}
                          onClick={() => setSelectedStudent(s)}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PAGINATION */}
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

        {/* PANEL CHI TIẾT */}
        <div className={styles.detailPanel}>
          {!selectedStudent ? (
            <p className={styles.detailEmpty}>
              Chọn một học viên ở bảng bên trái để xem chi tiết.
            </p>
          ) : (
            <>
              <h3 className={styles.detailTitle}>Thông tin học viên</h3>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Họ tên: </span>
                {(selectedStudent as any).fullName ??
                  (selectedStudent as any).username}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Email: </span>
                {(selectedStudent as any).email ?? "-"}
              </p>
              {"phone" in (selectedStudent as any) && (
                <p className={styles.detailField}>
                  <span className={styles.detailFieldLabel}>SĐT: </span>
                  {(selectedStudent as any).phone ?? "-"}
                </p>
              )}

              <h4 className={styles.detailSectionTitle}>
                Quá trình học ({selectedEnrollments.length})
              </h4>

              {loadingEnrollments && enrollments.length === 0 ? (
                <p className={styles.detailEmpty}>Đang tải dữ liệu enrollments...</p>
              ) : selectedEnrollments.length === 0 ? (
                <p className={styles.detailEmpty}>
                  Học viên hiện chưa đăng ký khóa học nào.
                </p>
              ) : (
                <div className={styles.detailEnrollList}>
                  {selectedEnrollments.map((e) => (
                    <div
                      key={e.enrollmentId}
                      className={styles.enrollCard}
                    >
                      <p className={styles.enrollTitle}>{e.courseTitle}</p>
                      <p className={styles.enrollSub}>
                        Course ID: {e.courseId} – Enrollment #{e.enrollmentId}
                      </p>
                      <div className={styles.enrollMeta}>
                        <span>
                          Tiến độ: {e.progressPercent.toFixed(1)}%
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
                          style={{ width: `${e.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
