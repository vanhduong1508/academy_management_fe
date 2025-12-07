import { useEffect, useState } from "react";
import { getMyCertificatesApi } from "../../api/student/certificate.api";
import type { CertificateResponse } from "../../types/student/certificate.types";
import styles from "../../styles/user/UserCertificateList.module.css";

const normalizeDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export default function MyCertificates() {
  const [certificates, setCertificates] = useState<CertificateResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyCertificatesApi();
      setCertificates(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được danh sách chứng chỉ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Chứng chỉ của tôi</h2>
          <p className={styles.subtitle}>
            Danh sách các chứng chỉ bạn đã nhận sau khi hoàn thành khóa học.
          </p>
        </div>
        <button
          className={styles.button}
          onClick={fetchCertificates}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        {loading && certificates.length === 0 ? (
          <p className={styles.infoText}>Đang tải danh sách chứng chỉ...</p>
        ) : certificates.length === 0 ? (
          <p className={styles.infoText}>
            Bạn chưa có chứng chỉ nào. Hoàn thành khóa học để nhận chứng chỉ.
          </p>
        ) : (
          <div className={styles.certificateGrid}>
            {certificates.map((cert) => (
              <div key={cert.enrollmentId} className={styles.certificateCard}>
                <div className={styles.certificateHeader}>
                  <h3 className={styles.certificateTitle}>{cert.courseTitle}</h3>
                  <span className={styles.certificateBadge}>
                    ✓ {cert.result === "PASS" ? "Đạt" : "Không đạt"}
                  </span>
                </div>
                <div className={styles.certificateBody}>
                  <p className={styles.certificateField}>
                    <span className={styles.fieldLabel}>Học viên:</span>
                    <span>{cert.studentName}</span>
                  </p>
                  <p className={styles.certificateField}>
                    <span className={styles.fieldLabel}>Mã học viên:</span>
                    <span>{cert.studentCode}</span>
                  </p>
                  <p className={styles.certificateField}>
                    <span className={styles.fieldLabel}>Mã khóa học:</span>
                    <span>{cert.courseCode}</span>
                  </p>
                  <p className={styles.certificateField}>
                    <span className={styles.fieldLabel}>Ngày cấp:</span>
                    <span>{normalizeDate(cert.issuedAt)}</span>
                  </p>
                  {cert.certificateCode && (
                    <p className={styles.certificateField}>
                      <span className={styles.fieldLabel}>Mã chứng chỉ:</span>
                      <span className={styles.certificateCode}>
                        {cert.certificateCode}
                      </span>
                    </p>
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

