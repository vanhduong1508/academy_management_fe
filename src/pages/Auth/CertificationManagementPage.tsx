import React, { useEffect, useState } from "react";
import styles from "../../styles/CertificationManagementPage.module.css";
import {
  getAllCertificates,
  createCertificate,
  revokeCertificate,
} from "../../services/api/certificateApi";

// Kiểu dữ liệu FE
interface Certificate {
  id: number;
  enrollmentId: number;
  certificateCode: string;
  issuedDate: string;
  status: "Valid" | "Revoked";
}

const CertificationManagementPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState("");

  // Load danh sách
  const loadCertificates = async () => {
    try {
      const data = await getAllCertificates();
      setCertificates(data);
    } catch (err) {
      console.error("Lỗi load chứng chỉ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // Tạo chứng chỉ mới
  const handleCreate = async () => {
    if (!enrollmentId) {
      alert("Vui lòng nhập enrollmentId!");
      return;
    }

    try {
      await createCertificate({
        enrollmentId: Number(enrollmentId),
        status: "Valid",
      });

      alert("Cấp chứng chỉ thành công!");
      setShowForm(false);
      setEnrollmentId("");
      loadCertificates();
    } catch (err) {
      alert("Không thể cấp chứng chỉ!");
    }
  };

  // Thu hồi
  const handleRevoke = async (id: number) => {
    if (!window.confirm("Thu hồi chứng chỉ này?")) return;

    try {
      await revokeCertificate(id);
      loadCertificates();
    } catch (err) {
      alert("Lỗi revoke!");
    }
  };

  if (loading) return <p>Đang tải...</p>;

  const total = certificates.length;
  const valid = certificates.filter((c) => c.status === "Valid").length;
  const revoked = certificates.filter((c) => c.status === "Revoked").length;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Chứng chỉ</h1>

      {/* MINI STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <p className={styles.statLabel}>Tổng chứng chỉ</p>
          <div className={styles.statValue}>📄 {total}</div>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Hợp lệ</p>
          <div className={styles.statValue}>🧑‍🎓 {valid}</div>
        </div>

        <div className={styles.statCard}>
          <p className={styles.statLabel}>Đã thu hồi</p>
          <div className={styles.statValue}>❗ {revoked}</div>
        </div>
      </div>

      {/* FORM CẤP CHỨNG CHỈ */}
      {showForm && (
        <div className={styles.formModal}>
          <div className={styles.formBox}>
            <h3>Cấp chứng chỉ</h3>

            <label>Enrollment ID</label>
            <input
              type="number"
              value={enrollmentId}
              onChange={(e) => setEnrollmentId(e.target.value)}
              placeholder="Nhập ID enrollment..."
            />

            <div className={styles.formActions}>
              <button onClick={handleCreate} className={styles.submitBtn}>
                Cấp chứng chỉ
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2>Quản lý chứng chỉ</h2>
          <button className={styles.issueButton} onClick={() => setShowForm(true)}>
            + Cấp chứng chỉ
          </button>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Mã chứng chỉ</th>
              <th>Enrollment</th>
              <th>Ngày cấp</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>

          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.id}</td>
                <td>{cert.certificateCode}</td>
                <td>{cert.enrollmentId}</td>
                <td>📅 {cert.issuedDate}</td>

                <td>
                  <span
                    className={styles.resultBadge}
                    data-result={cert.status === "Valid" ? "passed" : "failed"}
                  >
                    {cert.status}
                  </span>
                </td>

                <td>
                  {cert.status === "Valid" && (
                    <button
                      className={styles.revokeBtn}
                      onClick={() => handleRevoke(cert.id)}
                    >
                      Thu hồi
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CertificationManagementPage;
