// src/pages/admin/CourseManagementPage.tsx
import { useEffect, useState } from "react";

import {
  getAdminCoursesPageApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
} from "../../api/admin/admin-courses.api";

import {
  getCourseStructureApi,
} from "../../api/admin/admin-course-structure.api";

import type {
  CourseResponse,
  CourseCreatePayload,
  CourseUpdatePayload,
  CourseStructureResponse,
  ChapterResponse,
  LessonResponse,
} from "../../types/admin/admin-course.types";
import type { PageResponse } from "../../types/shared/pagination.types";

import styles from "../../styles/AdminCoursesPage.module.css";

type Mode = "create" | "edit";

interface FormState {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  price: string;
}

const normalizeDateInput = (value?: string | null): string => {
  if (!value) return "";
  return value.slice(0, 10); // "2025-12-04T00:00:00" -> "2025-12-04"
};

export default function CourseManagementPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [coursesPage, setCoursesPage] =
    useState<PageResponse<CourseResponse> | null>(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Mode>("create");
  const [editingCourse, setEditingCourse] = useState<CourseResponse | null>(
    null
  );
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    price: "",
  });

  // ====== VIEW DETAIL MODAL (course + chapters + lessons) ======
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingCourse, setViewingCourse] = useState<CourseResponse | null>(
    null
  );
  const [structure, setStructure] = useState<CourseStructureResponse | null>(
    null
  );
  const [structureLoading, setStructureLoading] = useState(false);
  const [structureError, setStructureError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAdminCoursesPageApi(page, size);
      setCoursesPage(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Không tải được danh sách khóa học."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingCourse(null);
    setForm({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      price: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: CourseResponse) => {
    setModalMode("edit");
    setEditingCourse(course);
    setForm({
      title: course.title ?? "",
      description: course.content ?? "",
      startDate: normalizeDateInput(course.startDate),
      endDate: normalizeDateInput(course.endDate),
      price: course.price != null ? String(course.price) : "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const handleChangeField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Vui lòng nhập tên khóa học");
      return;
    }

    if (!form.startDate || !form.endDate) {
      alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc");
      return;
    }

    if (form.startDate > form.endDate) {
      alert("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
      return;
    }

    const trimmedContent = form.description.trim();

    try {
      setSaving(true);

      if (modalMode === "create") {
        const priceNumber = Number(form.price);
        if (Number.isNaN(priceNumber) || priceNumber <= 0) {
          alert("Vui lòng nhập giá khóa học hợp lệ (> 0)");
          setSaving(false);
          return;
        }

        const payload: CourseCreatePayload = {
          title: form.title.trim(),
          content: trimmedContent,
          price: priceNumber,
          startDate: form.startDate,
          endDate: form.endDate,
        };

        await createCourseApi(payload);
      } else if (modalMode === "edit" && editingCourse) {
        const payload: CourseUpdatePayload = {
          title: form.title.trim(),
          content: trimmedContent,
          startDate: form.startDate,
          endDate: form.endDate,
        };

        await updateCourseApi(editingCourse.id, payload);
      }

      setIsModalOpen(false);
      await fetchCourses();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Lưu khóa học thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (courseId: number) => {
    if (!window.confirm("Bạn có chắc muốn xoá (soft delete) khóa học này?"))
      return;
    try {
      setDeletingId(courseId);
      await deleteCourseApi(courseId);
      await fetchCourses();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Xoá khóa học thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  // ====== XEM CHI TIẾT: GỌI getCourseStructureApi ======
  const handleOpenView = async (course: CourseResponse) => {
    setViewingCourse(course);
    setIsViewModalOpen(true);

    setStructure(null);
    setStructureError(null);

    try {
      setStructureLoading(true);
      const data = await getCourseStructureApi(course.id);
      setStructure(data);
    } catch (err: any) {
      console.error(err);
      setStructureError(
        err?.response?.data?.message || "Không tải được lộ trình khóa học."
      );
    } finally {
      setStructureLoading(false);
    }
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingCourse(null);
    setStructure(null);
    setStructureError(null);
  };

  const courses: CourseResponse[] = coursesPage?.content ?? [];
  const totalPages = coursesPage?.totalPages ?? 1;

  const renderStatusBadge = (course: CourseResponse) => {
    const isActive = course.status === "ACTIVE";
    const className = isActive
      ? `${styles.badgeStatus} ${styles.badgeActive}`
      : `${styles.badgeStatus} ${styles.badgeInactive}`;

    return <span className={className}>{isActive ? "Đang mở" : "Đã ẩn"}</span>;
  };

  const renderChapter = (chapter: ChapterResponse) => {
    const lessons: LessonResponse[] = chapter.lessons ?? [];

    return (
      <div key={chapter.id} className={styles.chapterBlock}>
        <div className={styles.chapterHeader}>
          <span className={styles.chapterIndex}>
            Chương {chapter.orderIndex}
          </span>
          <span className={styles.chapterTitle}>{chapter.title}</span>
        </div>
        {lessons.length > 0 ? (
          <ul className={styles.lessonList}>
            {lessons.map((lesson) => (
              <li key={lesson.id} className={styles.lessonItem}>
                <span className={styles.lessonIndex}>
                  Bài {lesson.orderIndex}:
                </span>
                <span className={styles.lessonTitle}>{lesson.title}</span>
                {lesson.urlVid && (
                  <span className={styles.lessonDuration}>
                    {" "}
                    – Video: {lesson.urlVid}
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.lessonEmpty}>Chưa có bài học nào.</p>
        )}
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý khóa học</h2>
          <p className={styles.subtitle}>
            Tạo, chỉnh sửa và xoá khóa học. Có thể xem nhanh lộ trình (chương /
            bài học) ở popup chi tiết.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={`${styles.button} ${styles.buttonPrimary}`}
            onClick={handleOpenCreate}
          >
            + Thêm khóa học
          </button>
          <button
            className={styles.button}
            onClick={fetchCourses}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Tải lại"}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        {loading && coursesPage == null ? (
          <p className={styles.infoText}>Đang tải danh sách khóa học...</p>
        ) : courses.length === 0 ? (
          <p className={styles.infoText}>Chưa có khóa học nào.</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Khóa học</th>
                  <th className={styles.th}>Thời gian</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={styles.thRight}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.cellMain}>
                        <span className={styles.cellTitle}>{course.title}</span>
                        <span className={styles.cellSub}>
                          ID: {course.id} – Mã: {course.code}
                        </span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.cellSub}>
                        {course.startDate
                          ? normalizeDateInput(course.startDate)
                          : "?"}{" "}
                        →{" "}
                        {course.endDate
                          ? normalizeDateInput(course.endDate)
                          : "?"}
                      </div>
                    </td>
                    <td className={styles.td}>{renderStatusBadge(course)}</td>
                    <td className={styles.tdRight}>
                      <button
                        className={`${styles.actionButton} ${styles.actionView}`}
                        onClick={() => handleOpenView(course)}
                      >
                        👁 Xem
                      </button>

                      <button
                        className={`${styles.actionButton} ${styles.actionEdit}`}
                        onClick={() => handleOpenEdit(course)}
                      >
                        Sửa
                      </button>

                      <button
                        className={`${styles.actionButton} ${styles.actionDelete}`}
                        disabled={deletingId === course.id}
                        onClick={() => handleDelete(course.id)}
                      >
                        {deletingId === course.id ? "Đang xoá..." : "Xoá"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* PAGINATION */}
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

      {/* MODAL CREATE/EDIT */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              {modalMode === "create" ? "Thêm khóa học" : "Chỉnh sửa khóa học"}
            </h3>

            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Tên khóa học</label>
                <input
                  className={styles.modalInput}
                  value={form.title}
                  onChange={(e) => handleChangeField("title", e.target.value)}
                  placeholder="Ví dụ: Lập trình Java từ cơ bản đến nâng cao"
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Mô tả / Nội dung</label>
                <textarea
                  className={styles.modalTextarea}
                  value={form.description}
                  onChange={(e) =>
                    handleChangeField("description", e.target.value)
                  }
                  placeholder="Mô tả ngắn gọn nội dung và mục tiêu khóa học..."
                />
              </div>

              <div className={styles.modalFieldGroup}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Ngày bắt đầu</label>
                  <input
                    type="date"
                    className={styles.modalInput}
                    value={form.startDate}
                    onChange={(e) =>
                      handleChangeField("startDate", e.target.value)
                    }
                  />
                </div>

                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Ngày kết thúc</label>
                  <input
                    type="date"
                    className={styles.modalInput}
                    value={form.endDate}
                    onChange={(e) =>
                      handleChangeField("endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Học phí (VNĐ)</label>
                <input
                  type="number"
                  className={styles.modalInput}
                  value={form.price}
                  onChange={(e) => handleChangeField("price", e.target.value)}
                  placeholder="Ví dụ: 1500000"
                  disabled={modalMode === "edit"}
                />
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.button}
                onClick={handleCloseModal}
                disabled={saving}
              >
                Hủy
              </button>
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving
                  ? "Đang lưu..."
                  : modalMode === "create"
                  ? "Tạo mới"
                  : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW COURSE DETAIL + STRUCTURE */}
      {isViewModalOpen && viewingCourse && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Chi tiết khóa học</h3>

            <div className={styles.modalBody}>
              <p>
                <strong>Tên khóa học:</strong> {viewingCourse.title}
              </p>
              <p>
                <strong>Mã khóa:</strong> {viewingCourse.code}
              </p>
              <p>
                <strong>ID:</strong> {viewingCourse.id}
              </p>
              <p>
                <strong>Trạng thái:</strong>{" "}
                {viewingCourse.status === "ACTIVE" ? "Đang mở" : "Đã ẩn"}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {viewingCourse.startDate
                  ? normalizeDateInput(viewingCourse.startDate)
                  : "?"}{" "}
                →{" "}
                {viewingCourse.endDate
                  ? normalizeDateInput(viewingCourse.endDate)
                  : "?"}
              </p>
              <p>
                <strong>Học phí:</strong>{" "}
                {viewingCourse.price != null
                  ? viewingCourse.price.toLocaleString("vi-VN") + " VNĐ"
                  : "Chưa đặt"}
              </p>
              <p>
                <strong>Mô tả:</strong>
              </p>
              <p>
                {viewingCourse.content && viewingCourse.content.trim().length > 0
                  ? viewingCourse.content
                  : "Chưa có mô tả chi tiết."}
              </p>

              <hr className={styles.sectionDivider} />

              <h4 className={styles.sectionTitle}>Lộ trình khóa học</h4>

              {structureLoading ? (
                <p className={styles.infoText}>Đang tải lộ trình khóa học...</p>
              ) : structureError ? (
                <p className={styles.error}>{structureError}</p>
              ) : !structure || structure.chapters.length === 0 ? (
                <p className={styles.infoText}>
                  Khóa học này chưa có chương / bài học.
                </p>
              ) : (
                <div className={styles.structureWrapper}>
                  {structure.chapters.map((chapter) => renderChapter(chapter))}
                </div>
              )}
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.button}
                onClick={handleCloseViewModal}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
