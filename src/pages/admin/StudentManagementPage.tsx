// src/pages/admin/StudentManagementPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  getStudentsPageApi,
  deleteStudentApi,
  getCourseOfStudent,
} from "../../api/admin/admin-students.api";
import { getEnrollmentsReadyForCertificateApi } from "../../api/admin/admin-progress.api";
import { getIssuedCertificatesApi } from "../../api/admin/admin-certificates.api";

import type { PageResponse } from "../../types/shared/pagination.types";
import type { AdminStudent } from "../../types/admin/admin-student.types";
import type { EnrollmentProgressResponse } from "../../types/admin/admin-progress.types";
import type { CertificateResponse } from "../../types/admin/admin-certificate.types";

import styles from "../../styles/AdminStudentsPage.module.css";

export default function StudentManagementPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(5);

  const [studentsPage, setStudentsPage] =
    useState<PageResponse<AdminStudent> | null>(null);

  const enrollmentsRef = useRef<EnrollmentProgressResponse[]>([]);
  const certificatesRef = useRef<CertificateResponse[]>([]);

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingMeta, setLoadingMeta] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [studentCourses, setStudentCourses] = useState<
    EnrollmentProgressResponse[]
  >([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const [detailStudent, setDetailStudent] = useState<AdminStudent | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const fetchMeta = async () => {
    try {
      setLoadingMeta(true);
      const [enrollments, certificates] = await Promise.all([
        getEnrollmentsReadyForCertificateApi(),
        getIssuedCertificatesApi(),
      ]);
      enrollmentsRef.current = enrollments;
      certificatesRef.current = certificates;
    } catch (err) {
      console.error("fetchMeta", err);
    } finally {
      setLoadingMeta(false);
    }
  };

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

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // fetch meta once on mount
  useEffect(() => {
    fetchMeta();
  }, []);

  // manual refresh that tries to be minimal
  const handleRefresh = async () => {
    await Promise.all([fetchStudents(), fetchMeta()]);
  };

  // debounce user search input to reduce renders / filtering cost
  useEffect(() => {
    const t = setTimeout(
      () => setDebouncedSearch(searchText.trim().toLowerCase()),
      300
    );
    return () => clearTimeout(t);
  }, [searchText]);

  const totalPages = studentsPage?.totalPages ?? 0;

  const openDetail = async (s: AdminStudent) => {
    setDetailStudent(s);
    setIsDetailOpen(true);
    setLoadingCourses(true);

    try {
      const courses = await getCourseOfStudent(s.id);
      setStudentCourses(Array.isArray(courses) ? courses : []);
    } catch (err) {
      console.error("Load student courses failed", err);
      setStudentCourses([]);
    } finally {
      setLoadingCourses(false);
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setDetailStudent(null);
  };

  const handleDeleteStudent = async (student: AdminStudent) => {
    const id = student.id;
    const name = student.fullName || student.studentCode || `ID ${id}`;

    if (!window.confirm(`Bạn có chắc muốn xoá học viên "${name}"?`)) return;

    try {
      setDeletingId(id);
      await deleteStudentApi(id);
      setStudentsPage((prev) =>
        prev
          ? { ...prev, content: prev.content.filter((s) => s.id !== id) }
          : prev
      );

      if (detailStudent && detailStudent.id === id) closeDetail();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Xoá học viên thất bại");
    } finally {
      setDeletingId(null);
    }
  };
  const filteredStudents = useMemo(() => {
    const list = studentsPage?.content ?? [];
    const q = debouncedSearch;

    return list.filter((s) => {
      if (!q) return true;
      const hay = `${s.fullName ?? ""} ${s.studentCode ?? ""} ${
        s.id
      }`.toLowerCase();
      return hay.includes(q);
    });
  }, [studentsPage, debouncedSearch]);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý học viên</h2>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            className={styles.searchInput}
            placeholder="Tìm theo tên, mã, id..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            onClick={handleRefresh}
            className={styles.refreshButton}
            disabled={loadingStudents || loadingMeta}
          >
            {loadingStudents || loadingMeta ? "Đang tải..." : "Tải lại"}
          </button>
        </div>
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
                  <th className={styles.th}>Số điện thoại</th>
                  <th className={styles.th}>Email</th>
                  <th className={`${styles.th}`}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
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
                      <th className={styles.td}>{s.phone}</th>
                      <th className={styles.td}>{s.email}</th>
                      <td className={`${styles.td}`}>
                        <button
                          className={`${styles.actionButton} ${styles.actionView}`}
                          title="Xem chi tiết"
                          onClick={() => openDetail(s)}
                        >
                          Xem chi tiết
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

      {isDetailOpen && detailStudent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3 className={styles.detailTitle}>Thông tin học viên</h3>
              <button className={styles.modalCloseButton} onClick={closeDetail}>
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
                <span className={styles.detailFieldLabel}>Số điện thoại: </span>
                {detailStudent.phone ?? "-"}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>Email: </span>
                {detailStudent.email ?? "-"}
              </p>
              <p className={styles.detailField}>
                <span className={styles.detailFieldLabel}>
                  Tỉnh/Thành phố:{" "}
                </span>
                {detailStudent.province ?? "-"}
              </p>

              <h4 className={styles.detailSectionTitle}>
                {" "}
                Danh sách khóa học ({studentCourses.length})
              </h4>

              {loadingCourses ? (
                <p className={styles.detailEmpty}>
                  Đang tải danh sách khóa học...
                </p>
              ) : studentCourses.length === 0 ? (
                <p className={styles.detailEmpty}>
                  Học viên chưa đăng ký khóa học nào.
                </p>
              ) : (
                <div className={styles.detailEnrollList}>
                  {studentCourses.map((e) => (
                    <div key={e.enrollmentId} className={styles.enrollCard}>
                      <p className={styles.enrollTitle}>{e.courseTitle}</p>

                      <p className={styles.enrollSub}>
                        Course ID: {e.courseId} – Enrollment #{e.enrollmentId}
                      </p>

                      <div className={styles.enrollMeta}>
                        <span>
                          Tiến độ: {e.progressPercentage?.toFixed(1) ?? 0}%
                        </span>
                        <span
                          data-eligible={e.eligibleForCertificate ? "true" : "false"}
                        >
                          {e.eligibleForCertificate
                            ? "Đủ điều kiện cấp chứng chỉ"
                            : "Chưa đủ điều kiện"}
                        </span>
                      </div>

                      <div className={styles.enrollProgressBar}>
                        <div
                          className={styles.enrollProgressInner}
                          style={{ width: `${e.progressPercentage ?? 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.buttonSecondary} onClick={closeDetail}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

