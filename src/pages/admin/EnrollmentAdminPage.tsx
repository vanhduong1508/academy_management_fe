// src/pages/admin/EnrollmentAdminPage.tsx
import React, { useEffect, useMemo, useState } from "react";

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

  const [searchText, setSearchText] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterCertStatus, setFilterCertStatus] = useState<
    "all" | "has" | "ready" | "none"
  >("all");

  const [page, setPage] = useState(0);
  const [pageSize] = useState(5);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchText.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [searchText]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [progressList, certList] = await Promise.all([
        getAllEnrollmentProgressForAdminApi(),
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


  const certEnrollmentSet = useMemo(() => {
    const s = new Set<number>();
    for (const c of certificates) {
      if (typeof c.enrollmentId === "number") s.add(c.enrollmentId);
    }
    return s;
  }, [certificates]);

  const itemsWithCert = useMemo(() => {
    return items.map((it) => {
      const hasCertificate = certEnrollmentSet.has(it.enrollmentId);
      const canIssueCertificate = it.eligibleForCertificate && !hasCertificate;
      return { ...it, hasCertificate, canIssueCertificate };
    });
  }, [items, certEnrollmentSet]);

  const filtered = useMemo(() => {
    const q = debouncedSearch;
    return itemsWithCert.filter((it) => {
      if (filterCertStatus === "has" && !it.hasCertificate) return false;
      if (filterCertStatus === "ready" && !it.canIssueCertificate) return false;
      if (filterCertStatus === "none" && (it.hasCertificate || it.canIssueCertificate)) return false;

      if (!q) return true;
      const hay = `${it.studentName ?? ""} ${it.studentCode ?? ""} ${it.courseTitle ?? ""} ${it.courseCode ?? ""} ${it.enrollmentId}`.toLowerCase();
      return hay.includes(q);
    });
  }, [itemsWithCert, debouncedSearch, filterCertStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page >= totalPages) setPage(Math.max(0, totalPages - 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  const paginated = useMemo(() => {
    const start = page * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  const renderStatusBadge = (item: EnrollmentProgressResponse & { hasCertificate?: boolean; canIssueCertificate?: boolean; }) => {
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

  const renderCertBadge = (it: { enrollmentId: number; eligibleForCertificate?: boolean; hasCertificate?: boolean; canIssueCertificate?: boolean; }) => {
    const base = styles.badge;

    const hasCertificate = !!it.hasCertificate;
    const canIssueCertificate = !!it.canIssueCertificate;

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
        </div>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            className={styles.searchInput}
            placeholder="Tìm: tên học viên, mã, khóa, id..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <select
            className={styles.select}
            value={filterCertStatus}
            onChange={(e) => setFilterCertStatus(e.target.value as any)}
          >
            <option value="all">Tất cả</option>
            <option value="has">Đã có chứng chỉ</option>
            <option value="ready">Đủ điều kiện cấp</option>
            <option value="none">Chưa tham gia / chưa đủ điều kiện</option>
          </select>

          <button
            onClick={fetchData}
            className={styles.refreshButton}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Tải lại"}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && items.length === 0 ? (
        <p className={styles.infoText}>Đang tải dữ liệu...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.infoText}>Không tìm thấy học viên nào đang học.</p>
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
              {paginated.map((item) => (
                <tr key={item.enrollmentId} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.cellMain}>
                      <span className={styles.cellTitle}>
                        {item.studentName}
                      </span>
                      <span className={styles.cellSub}>
                        Mã HV: {item.studentId}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <div className={styles.cellMain}>
                      <span className={styles.cellTitle}>
                        {item.courseTitle}
                      </span>
                      <span className={styles.cellSub}>
                        Mã khóa: {item.courseId}
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

          {/* pagination controls */}
          <div className={styles.pagination} style={{ marginTop: 12 }}>
            <span>
              Trang {page + 1}/{totalPages}
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
                setPage((p) => (totalPages > 0 ? Math.min(totalPages - 1, p + 1) : p))
              }
            >
              Sau
            </button>
            <span style={{ marginLeft: 12, color: "var(--muted)" }}>
              {filtered.length} kết quả
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
