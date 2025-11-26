// src/pages/StudentManagementPage.tsx
import React, { useEffect, useState } from "react";
import styles from "../../styles/StudentManagementPage.module.css";
import {
  getStudentsPage,
  deleteStudent,
  updateStudent,
  createStudent,
  PageResponse,
} from "../../services/api/studentApi";
import { Student } from "../../types/student";
import { StudentCreateRequest, StudentUpdateRequest } from "../../types/studentRequest";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

interface FormData {
  fullName: string;
  dob: string; // yyyy-MM-dd
  hometown?: string;
  province?: string;
}

const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  // Modal state
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    dob: "",
    hometown: "",
    province: "",
  });

  // Fetch students
  const fetchStudents = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data: PageResponse<Student> = await getStudentsPage(page, pageSize);
      setStudents(data.content);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Format date (dob is yyyy-MM-dd already)
  const formatDate = (dateStr?: string | null) => dateStr || "";

  // Filter students by search (search by studentCode or fullName)
  const filteredStudents = students.filter((student) =>
    (student.studentCode || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (student.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
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
    });
  };

  // Open edit modal
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsAddMode(false);
    setFormData({
      fullName: student.fullName,
      dob: student.dob,
      hometown: student.hometown || "",
      province: student.province || "",
    });
  };

  // Save student (create/update)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.dob) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
      return;
    }

    try {
      if (isAddMode) {
        const payload: StudentCreateRequest = { ...formData };
        await createStudent(payload);
        alert("Thêm học viên thành công!");
      } else if (editingStudent) {
        const payload: StudentUpdateRequest = { ...formData };
        await updateStudent(editingStudent.id, payload);
        alert("Cập nhật học viên thành công!");
      }
      setEditingStudent(null);
      setIsAddMode(false);
      fetchStudents();
    } catch (err: any) {
      alert("Lỗi khi lưu học viên: " + (err.message || err));
    }
  };

  // Delete student
  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (!window.confirm(`Bạn có chắc muốn xóa học viên ID ${id}?`)) return;
    try {
      await deleteStudent(id);
      alert("Xóa học viên thành công!");
      fetchStudents();
    } catch (err: any) {
      alert("Lỗi khi xóa học viên: " + (err.message || err));
    }
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>Lỗi: {error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Quản lý Học viên</h1>

      {/* Header */}
      <div className={styles.headerBar}>
        <div className={styles.searchContainer}>
          <CiSearch className={styles.searchIcon} />
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
                  <td>{student.studentCode}</td>
                  <td>{student.fullName}</td>
                  <td>{formatDate(student.dob)}</td>
                  <td>{student.hometown}</td>
                  <td>{student.province}</td>
                  <td>{student.status}</td>
                  <td className={styles.actions}>
                    <button onClick={() => handleEdit(student)} title="Chỉnh sửa">
                      <AiOutlineEdit />
                    </button>
                    <button onClick={(e) => handleDelete(e, student.id)} title="Xóa">
                      <AiOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>Không tìm thấy học viên phù hợp.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>Prev</button>
          <span>Page {page + 1} / {totalPages}</span>
          <button disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
        </div>
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
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
              <label>Ngày sinh</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                required
              />
              <label>Quê quán</label>
              <input
                type="text"
                value={formData.hometown}
                onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
              />
              <label>Tỉnh thường trú</label>
              <input
                type="text"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              />
              <div className={styles.modalActions}>
                <button type="button" onClick={() => { setEditingStudent(null); setIsAddMode(false); }}>
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
