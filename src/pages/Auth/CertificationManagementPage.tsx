import React, { useEffect, useState } from "react";
import styles from "../../styles/CertificationManagementPage.module.css";
import {
  getAllCertificates,
  createCertificate,
  revokeCertificate,
  getCompletedEnrollments,
  CompletedEnrollment, // Import kiểu dữ liệu
} from "../../services/api/certificateApi"; 

// Kiểu dữ liệu FE - Khớp với CertificateResponse từ Backend
interface CertificateDetail {
  id: number;
  enrollmentId: number;
  certificateCode: string;
  studentName: string;
  courseName: string;
  result: "PASSED" | "FAILED" | "PENDING"; // Kết quả khóa học (Backend)
  notes: string; // Ghi chú (Backend)
  issuedAt: string; // Ngày cấp
  status: "Valid" | "Revoked";
}

// Kiểu dữ liệu cho Form Cấp chứng chỉ
interface CertificateForm {
  enrollmentId: number;
  result: "Đạt" | "Không đạt" | "Chờ xử lý"; // Dùng cho dropdown
  notes: string;
}

const CertificationManagementPage: React.FC = () => {
  const [certificates, setCertificates] = useState<CertificateDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<CertificateForm>({
    enrollmentId: 0,
    result: "Đạt",
    notes: "",
  });
  
  // State lưu danh sách Enrollment đã hoàn thành
  const [completedEnrollments, setCompletedEnrollments] = useState<CompletedEnrollment[]>([]);

  // Hàm chuyển đổi Backend Result sang Display Text
  const mapResultToDisplay = (result: string) => {
    switch (result) {
      case "PASSED":
        return "Đạt";
      case "FAILED":
        return "Không đạt";
      case "PENDING":
      default:
        return "Chờ xử lý";
    }
  };

  // Hàm chuyển đổi Backend Result sang Style Class
  const mapResultToStyle = (result: string) => {
    switch (result) {
      case "PASSED":
        return "passed";
      case "FAILED":
        return "failed";
      case "PENDING":
      default:
        return "pending";
    }
  };

  // 1. Tải danh sách Enrollment đã hoàn thành
  const loadCompletedEnrollments = async () => {
    try {
        const data = await getCompletedEnrollments();
        setCompletedEnrollments(data);
    } catch (err) {
        console.error("Lỗi load danh sách Enrollment đã hoàn thành:", err);
    }
  }

  // 2. Tải danh sách Chứng chỉ
  const loadCertificates = async () => {
    try {
      const data = await getAllCertificates();
      
      const mappedData: CertificateDetail[] = data.map((cert: any) => ({
        ...cert,
        // Format ngày tháng từ YYYY-MM-DD sang định dạng hiển thị
        issuedAt: cert.issuedAt
          ? new Date(cert.issuedAt).toLocaleDateString("vi-VN")
          : "N/A",
        result: cert.result || "PENDING", 
      }));
      setCertificates(mappedData);
    } catch (err) {
      console.error("Lỗi load chứng chỉ:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
    loadCompletedEnrollments(); 
  }, []);

  // 3. Tạo chứng chỉ mới
  const handleCreate = async () => {
    if (!formData.enrollmentId) {
      alert("Vui lòng chọn Học viên/Enrollment!");
      return;
    }

    try {
      // Giả định chỉ cấp chứng chỉ khi kết quả là "Đạt"
      const requestStatus = formData.result === "Đạt" ? "Valid" : "Revoked"; 
      
      await createCertificate({
        enrollmentId: Number(formData.enrollmentId),
        status: requestStatus, 
        notes: formData.notes,
      });

      alert("Cấp chứng chỉ thành công!");
      setShowForm(false);
      setFormData({ enrollmentId: 0, result: "Đạt", notes: "" });
      loadCertificates();
    } catch (err) {
      // Xử lý lỗi từ Backend (ví dụ: Học viên chưa hoàn thành)
      alert("Không thể cấp chứng chỉ! Kiểm tra console để biết chi tiết lỗi.");
      console.error("Lỗi cấp chứng chỉ:", err);
    }
  };

  // 4. Thu hồi
  const handleRevoke = async (id: number) => {
    if (!window.confirm("Thu hồi chứng chỉ này?")) return;

    try {
      await revokeCertificate(id);
      loadCertificates();
    } catch (err) {
      alert("Lỗi revoke!");
      console.error("Lỗi thu hồi:", err);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  // Thống kê theo kết quả khóa học
  const total = certificates.length;
  const passed = certificates.filter((c) => c.result === "PASSED").length;
  const failed = certificates.filter((c) => c.result === "FAILED").length;
  const pending = certificates.filter((c) => c.result === "PENDING").length;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Chứng chỉ</h1>

      {/* MINI STATS */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} data-type="total">
          <p className={styles.statLabel}>Tổng chứng chỉ</p>
          <div className={styles.statValue}>📄 {total}</div>
        </div>
        <div className={styles.statCard} data-type="passed">
          <p className={styles.statLabel}>Đạt</p>
          <div className={styles.statValue}>🧑‍🎓 {passed}</div>
        </div>
        <div className={styles.statCard} data-type="failed">
          <p className={styles.statLabel}>Không đạt</p>
          <div className={styles.statValue}>❗ {failed}</div>
        </div>
        <div className={styles.statCard} data-type="pending">
          <p className={styles.statLabel}>Chờ xử lý</p>
          <div className={styles.statValue}>⏳ {pending}</div>
        </div>
      </div>

      {/* FORM CẤP CHỨNG CHỈ MODAL */}
      {showForm && (
        <div className={styles.formModal}>
          <div className={styles.formBox}>
            <h3 className={styles.formTitle}>Cấp chứng chỉ</h3>
            
            <label>Chọn học viên đã **hoàn thành** khóa học</label>
            <select
              value={formData.enrollmentId}
              onChange={(e) => setFormData({ ...formData, enrollmentId: Number(e.target.value) })}
            >
              <option value={0}>Chọn học viên...</option>
              {completedEnrollments.map((enrollment) => (
                  <option key={enrollment.id} value={enrollment.id}>
                      {enrollment.studentName} - {enrollment.courseName} (ID: {enrollment.id})
                  </option>
              ))}
              
            </select>

            <label>Kết quả</label>
            <select
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value as "Đạt" | "Không đạt" | "Chờ xử lý" })}
            >
              <option value="Đạt">Đạt</option>
              <option value="Không đạt">Không đạt</option>
              <option value="Chờ xử lý">Chờ xử lý</option>
            </select>

            <label>Ghi chú (tùy chọn)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Ghi chú về kết quả học tập..."
            ></textarea>

            <div className={styles.formActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowForm(false)}
              >
                Hủy
              </button>
              <button onClick={handleCreate} className={styles.submitBtn}
                      disabled={formData.enrollmentId === 0}> 
                Cấp chứng chỉ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h2 className={styles.sectionTitle}>Quản lý chứng chỉ</h2>
          <button className={styles.issueButton} onClick={() => setShowForm(true)}>
            🧑‍🎓 Cấp chứng chỉ
          </button>
        </div>

        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Mã chứng chỉ</th>
              <th>Học viên</th>
              <th>Khóa học</th>
              <th>Kết quả</th>
              <th>Ngày cấp</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.certificateCode}</td>
                <td>{cert.studentName}</td>
                <td>{cert.courseName}</td>

                <td>
                  <span
                    className={styles.resultBadge}
                    data-result={mapResultToStyle(cert.result)}
                  >
                    {mapResultToDisplay(cert.result)}
                  </span>
                </td>

                <td>📅 {cert.issuedAt}</td>
                <td className={styles.noteCell}>{cert.notes}</td>

                <td className={styles.actions}>
                  <button className={styles.downloadBtn} title="Tải xuống">
                    ⬇️
                  </button>
                  {cert.status === "Valid" && (
                    <button
                      className={styles.revokeBtn}
                      onClick={() => handleRevoke(cert.id)}
                      title="Thu hồi"
                    >
                      ❌
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