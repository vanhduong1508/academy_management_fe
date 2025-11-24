import React, { useEffect, useState } from "react";
import styles from "../../styles/CourseManagementPage.module.css";
import { courseApi } from "../../services/api/courseApi";
import { Course, CourseCreateRequest, CourseUpdateRequest } from "../../types/course";

// Convert status từ backend -> UI theo ngày
const calculateStatus = (startDate: string, endDate: string): string => {
  const now = new Date().getTime();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (now < start) return "Sắp diễn ra";
  if (now >= start && now <= end) return "Đang diễn ra";
  return "Đã kết thúc";
};

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

  // Fetch all courses
  const loadCourses = async () => {
    try {
      const data = await courseApi.getAll();
      // Gán trạng thái động
      setCourses(
        data.map((c) => ({
          ...c,
          status: calculateStatus(c.startDate, c.endDate),
        }))
      );
    } catch (err) {
      console.error("Lỗi tải danh sách khóa học", err);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  // Tính statusCounts động
  const statusCounts: { [key: string]: number } = {
    "Tất cả": courses.length,
    "Sắp diễn ra": courses.filter((c) => c.status === "Sắp diễn ra").length,
    "Đang diễn ra": courses.filter((c) => c.status === "Đang diễn ra").length,
    "Đã kết thúc": courses.filter((c) => c.status === "Đã kết thúc").length,
  };

  // Filter courses
  const filteredCourses = courses
    .filter((c) => activeStatus === "Tất cả" || c.status === activeStatus)
    .filter(
      (c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khóa học này?")) return;
    try {
      await courseApi.delete(id);
      alert("Xóa thành công!");
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
          <span className={styles.searchIcon}>🔍</span>
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
          {Object.keys(statusCounts).map((status) => (
            <button
              key={status}
              className={`${styles.statusButton} ${
                activeStatus === status ? styles.activeStatus : ""
              }`}
              onClick={() => setActiveStatus(status)}
            >
              {status} <span>{statusCounts[status]}</span>
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
            {filteredCourses.map((c) => (
              <tr key={c.id}>
                <td>{c.code}</td>
                <td>{c.title}</td>
                <td>{c.startDate}</td>
                <td>{c.endDate}</td>
                <td>
                  <span className={styles.statusBadge} data-status={c.status}>
                    {c.status}
                  </span>
                </td>
                <td>{c.content}</td>
                <td className={styles.actions}>
                  <span className={styles.actionIcon} onClick={() => openEditModal(c)}>
                    ✏️
                  </span>
                  <span className={styles.actionIcon} onClick={() => handleDelete(c.id!)}>
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.noData}>
                  Không có khóa học nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
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
