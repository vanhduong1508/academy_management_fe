import React, { useEffect, useState } from "react";
import styles from "../../styles/RegistrationManagementPage.module.css";

import { Enrollment } from "../../types/enrollment";
import {
  getAllEnrollments,
  updateEnrollmentResult,
  enrollCourse,
} from "../../services/api/enrollmentApi";

// ---- PAGE CHÍNH ----
const RegistrationManagementPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Modal đăng ký mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [error, setError] = useState("");

  // Fetch danh sách enrollment
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const data = await getAllEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  // ---- Cập nhật kết quả ----
  const handleStatusChange = async (id: number, newStatus: Enrollment["result"]) => {
    try {
      if (newStatus === "PASSED" || newStatus === "FAILED") {
        await updateEnrollmentResult(id, { passed: newStatus === "PASSED" });
      }

      setEnrollments((prev) =>
        prev.map((e) => (e.id === id ? { ...e, result: newStatus } : e))
      );
    } catch (err: any) {
      alert("Cập nhật thất bại: " + err.message);
    }
  };

  // ---- Đăng ký mới ----
  const handleCreateEnrollment = async () => {
    if (!studentId || !courseId) {
      alert("Vui lòng nhập đầy đủ studentId & courseId");
      return;
    }

    try {
      await enrollCourse({
        studentId: Number(studentId),
        courseId: Number(courseId),
      });

      alert("Đăng ký thành công!");

      setIsModalOpen(false);
      setStudentId("");
      setCourseId("");

      fetchEnrollments();
    } catch (err: any) {
      alert("Lỗi đăng ký: " + err.message);
    }
  };

  // ---- Lọc danh sách ----
  const filteredEnrollments = enrollments.filter(
    (e) =>
      e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Quản lý đăng ký khóa học</h1>

      <div className={styles.topBar}>
        {/* SEARCH */}
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm học viên hoặc khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* BUTTON: ĐĂNG KÝ MỚI */}
        <button
          className={styles.addButton}
          onClick={() => setIsModalOpen(true)}
        >
          + Đăng ký mới
        </button>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* TABLE */}
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Học viên</th>
              <th>Khóa học</th>
              <th>Ngày đăng ký</th>
              <th>Kết quả</th>
            </tr>
          </thead>

          <tbody>
            {filteredEnrollments.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center" }}>
                  Không có dữ liệu.
                </td>
              </tr>
            )}

            {filteredEnrollments.map((e) => (
              <tr key={e.id}>
                <td>{e.id}</td>
                <td>
                  {e.studentName} ({e.studentCode})
                </td>
                <td>
                  {e.courseTitle} ({e.courseCode})
                </td>
                <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>

                <td>
                  <select
                    value={e.result || ""}
                    onChange={(ev) =>
                      handleStatusChange(e.id, ev.target.value as Enrollment["result"])
                    }
                  >
                    <option value="">Chưa có</option>
                    <option value="PASSED">PASSED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- MODAL ĐĂNG KÝ MỚI ---------- */}
      {isModalOpen && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modal}>
            <h2>Đăng ký khóa học mới</h2>

            <label>Student ID:</label>
            <input
              type="number"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <label>Course ID:</label>
            <input
              type="number"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />

            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleCreateEnrollment}>
                Xác nhận
              </button>

              <button
                className={styles.cancelButton}
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationManagementPage;
