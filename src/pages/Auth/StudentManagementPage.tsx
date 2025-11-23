import React, { useState, useEffect } from "react";
import styles from "../../styles/StudentManagementPage.module.css";
import {
  getAllStudents,
  deleteStudent,
  updateStudent,
  createStudent,
} from "../../services/api/studentApi";
import { Student } from "../../types/student";

interface FormData {
  fullName: string;
  dob: string;
  hometown: string;
  province: string;
  status: string;
}

const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dob: "",
    hometown: "",
    province: "",
    status: "ACTIVE",
  });

  // Fetch students
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Format date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    return dateStr.split("T")[0];
  };

  // Filter students by search
  const filteredStudents = students.filter(
    (student) =>
      student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(e.target.value);

  // Open add modal
  const handleAddStudent = () => {
    setIsAddMode(true);
    setEditingStudent(null);
    setFormData({
      fullName: "",
      dob: "",
      hometown: "",
      province: "",
      status: "ACTIVE",
    });
  };

  // Open edit modal
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsAddMode(false);
    setFormData({
      fullName: student.fullName,
      dob: student.dob.split("T")[0],
      hometown: student.hometown,
      province: student.province,
      status: student.status,
    });
  };

  // Save student (create/update)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault(); // prevent form submit default
    if (!formData.fullName || !formData.dob) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      if (isAddMode) {
        await createStudent(formData as any);
        alert("Thêm học viên thành công!");
      } else if (editingStudent) {
        await updateStudent(editingStudent.id, formData as any);
        alert("Cập nhật học viên thành công!");
      }
      await fetchStudents();
      setEditingStudent(null);
      setIsAddMode(false);
    } catch (err: any) {
      alert("Lỗi khi lưu học viên: " + err.message);
    }
  };

  // Delete student
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault(); // prevent default behavior
    if (!window.confirm(`Bạn có chắc muốn xóa học viên ID ${id}?`)) return;
    try {
      await deleteStudent(id);
      alert("Xóa học viên thành công!");
      await fetchStudents();
    } catch (err: any) {
      alert("Lỗi khi xóa học viên: " + err.message);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Học viên</h1>
        <p>Đang tải dữ liệu học viên...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Học viên</h1>
        <p className={styles.error}>Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Quản lý Học viên</h1>

      {/* Header */}
      <div className={styles.headerBar}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc tên học viên..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton} onClick={handleAddStudent}>
          + Thêm học viên
        </button>
      </div>

      {/* Table */}
      <div className={styles.tableContainer}>
        <h2 className={styles.sectionTitle}>Danh sách học viên</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Mã học viên</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Quê quán</th>
              <th>Tỉnh thường trú</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td>{student.code}</td>
                  <td>{student.fullName}</td>
                  <td>{formatDate(student.dob)}</td>
                  <td>{student.hometown}</td>
                  <td>{student.province}</td>
                  <td>{student.status}</td>
                  <td className={styles.actions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => handleEdit(student)}
                    >
                      ✏️
                    </button>
                    <button
                      className={styles.actionButton}
                      onClick={(e) => handleDelete(e, student.id)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.noData}>
                  Không tìm thấy học viên phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {(editingStudent || isAddMode) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{isAddMode ? "Thêm học viên" : "Cập nhật học viên"}</h2>
            <form onSubmit={handleSaveStudent}>
              <label>Họ và tên</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <label>Ngày sinh</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) =>
                  setFormData({ ...formData, dob: e.target.value })
                }
              />

              <label>Quê quán</label>
              <input
                type="text"
                value={formData.hometown}
                onChange={(e) =>
                  setFormData({ ...formData, hometown: e.target.value })
                }
              />

              <label>Tỉnh thường trú</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
              />

              <label>Trạng thái</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              />

              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => {
                    setEditingStudent(null);
                    setIsAddMode(false);
                  }}
                >
                  Hủy
                </button>
                <button type="submit">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagementPage;
