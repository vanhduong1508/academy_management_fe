import React, { useEffect, useState } from "react";
import styles from "../../styles/CourseManagementPage.module.css";
import { courseApi } from "../../services/api/courseApi";
import { Course, CourseCreateRequest, CourseUpdateRequest } from "../../types/course";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

const CourseManagementPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatus, setActiveStatus] = useState("Tất cả");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editCourseId, setEditCourseId] = useState<number | null>(null);
  const [formData, setFormData] = useState<CourseCreateRequest>({
    title: "",
    startDate: "",
    endDate: "",
    content: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  // Load courses từ BE
  const loadCourses = async () => {
    try {
      const res = await courseApi.getAll(
        page,
        pageSize,
        searchTerm,
        activeStatus === "Tất cả" ? "" : activeStatus
      );
      setCourses(res.courses);
      setTotalPages(res.totalPages);

      // Nếu page hiện tại vượt quá tổng số trang, reset về page 0
      if (page >= res.totalPages && res.totalPages > 0) {
        setPage(0);
      }
    } catch (err) {
      console.error("Lỗi tải danh sách khóa học", err);
    }
  };

  // Reset page về 0 khi search hoặc status thay đổi
  useEffect(() => {
    setPage(0);
  }, [searchTerm, activeStatus]);

  useEffect(() => {
    loadCourses();
  }, [page, searchTerm, activeStatus]);

  // Modal handlers
  const openCreateModal = () => {
    setEditCourseId(null);
    setFormData({ title: "", startDate: "", endDate: "", content: "" });
    setShowModal(true);
  };

  const openEditModal = (course: Course) => {
    setEditCourseId(course.id);
    setFormData({
      title: course.title,
      startDate: course.startDate,
      endDate: course.endDate,
      content: course.content,
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      if (editCourseId === null) {
        await courseApi.create(formData);
        alert("Thêm khóa học thành công!");
      } else {
        await courseApi.update(editCourseId, formData as CourseUpdateRequest);
        alert("Cập nhật khóa học thành công!");
      }
      setShowModal(false);
      loadCourses();
    } catch (err: any) {
      alert(err.response?.data?.message || "Lỗi xử lý yêu cầu");
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) return;
    try {
      await courseApi.delete(id);
      alert("Khóa học đã được đánh dấu INACTIVE!");
      loadCourses();
    } catch (err) {
      alert("Xóa thất bại!");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Quản lý khóa học</h1>

      {/* SEARCH + ADD */}
      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}><CiSearch /></span>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã, tên hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        <button className={styles.addButton} onClick={openCreateModal}>
          + Thêm khóa học
        </button>
      </div>

      {/* STATUS FILTER */}
      <div className={styles.statusFilter}>
        <h3 className={styles.filterTitle}>Lọc theo trạng thái:</h3>
        <div className={styles.statusButtons}>
          {["Tất cả", "ACTIVE", "INACTIVE"].map((status) => (
            <button
              key={status}
              className={`${styles.statusButton} ${activeStatus === status ? styles.activeStatus : ""}`}
              onClick={() => setActiveStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Mã</th>
              <th>Tên khóa học</th>
              <th>Bắt đầu</th>
              <th>Kết thúc</th>
              <th>Trạng thái</th>
              <th>Nội dung</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? courses.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.title}</td>
                <td>{c.startDate}</td>
                <td>{c.endDate}</td>
                <td>{c.status}</td>
                <td>{c.content}</td>
                <td className={styles.actions}>
                  <span className={styles.actionIcon} onClick={() => openEditModal(c)}>
                    <AiOutlineEdit size={20} />
                  </span>
                  <span className={styles.actionIcon} onClick={() => handleDelete(c.id)}>
                    <AiOutlineDelete size={20} />
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className={styles.noData}>
                  Không có khóa học nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              className={idx === page ? styles.activePage : ""}
              onClick={() => setPage(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>{editCourseId ? "Cập nhật khóa học" : "Thêm khóa học mới"}</h2>

            <label>Tiêu đề khóa học</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <label>Ngày bắt đầu</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />

            <label>Ngày kết thúc</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />

            <label>Nội dung khóa học</label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />

            <div className={styles.modalActions}>
              <button className={styles.saveBtn} onClick={handleSubmit}>
                {editCourseId ? "Cập nhật" : "Thêm mới"}
              </button>
              <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagementPage;
