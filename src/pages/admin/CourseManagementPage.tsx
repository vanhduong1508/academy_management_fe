// src/pages/admin/CourseManagementPage.tsx
import { useEffect, useState } from "react";
import {
  getAdminCoursesPageApi,
  createAdminCourseApi,
  updateAdminCourseApi,
  deleteAdminCourseApi,
  type CourseCreatePayload,
  type CourseUpdatePayload,
} from "../../api/admin/admin-courses.api";
import type { Course, PageResponse } from "../../types/models/course.types";
import styles from "../../styles/AdminCoursesPage.module.css";

type Mode = "create" | "edit";

interface FormState {
  title: string;
  description: string;
  price: string; // string để dễ nhập, gửi lên thì parseFloat
}

export default function CourseManagementPage() {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [coursesPage, setCoursesPage] = useState<PageResponse<Course> | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Mode>("create");
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    price: "",
  });

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
  }, [page]);

  const handleOpenCreate = () => {
    setModalMode("create");
    setEditingCourse(null);
    setForm({
      title: "",
      description: "",
      price: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setModalMode("edit");
    setEditingCourse(course);
    setForm({
      title: (course as any).title ?? "",
      description: (course as any).description ?? "",
      price:
        (course as any).price !== undefined &&
        (course as any).price !== null
          ? String((course as any).price)
          : "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (saving) return;
    setIsModalOpen(false);
  };

  const handleChangeField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      alert("Vui lòng nhập tên khóa học");
      return;
    }

    const priceNumber =
      form.price.trim() === "" ? undefined : Number(form.price);

    const basePayload: CourseCreatePayload | CourseUpdatePayload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: isNaN(priceNumber as number) ? undefined : priceNumber,
    };

    try {
      setSaving(true);
      if (modalMode === "create") {
        await createAdminCourseApi(basePayload as CourseCreatePayload);
      } else if (modalMode === "edit" && editingCourse) {
        await updateAdminCourseApi((editingCourse as any).id, basePayload);
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
      await deleteAdminCourseApi(courseId);
      await fetchCourses();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Xoá khóa học thất bại");
    } finally {
      setDeletingId(null);
    }
  };

  const totalPages = coursesPage?.totalPages ?? 0;

  const renderStatusBadge = (course: Course) => {
    // tuỳ theo BE: isActive / status / published
    const isActive =
      (course as any).status === "ACTIVE" ||
      (course as any).isActive === true ||
      (course as any).published === true;

    const className = isActive
      ? `${styles.badgeStatus} ${styles.badgeActive}`
      : `${styles.badgeStatus} ${styles.badgeInactive}`;

    return (
      <span className={className}>
        {isActive ? "Đang mở" : "Đã ẩn"}
      </span>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý khóa học</h2>
          <p className={styles.subtitle}>
            Tạo, chỉnh sửa và xoá khóa học. Lộ trình chi tiết (chương / bài học)
            sẽ được quản lý ở trang &quot;Lộ trình khóa học&quot; riêng.
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
        {loading && !coursesPage ? (
          <p className={styles.infoText}>Đang tải danh sách khóa học...</p>
        ) : !coursesPage || coursesPage.content.length === 0 ? (
          <p className={styles.infoText}>Chưa có khóa học nào.</p>
        ) : (
          <>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Khóa học</th>
                  <th className={styles.th}>Giá</th>
                  <th className={styles.th}>Trạng thái</th>
                  <th className={styles.thRight}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {coursesPage.content.map((course) => (
                  <tr key={(course as any).id} className={styles.tr}>
                    <td className={styles.td}>
                      <div className={styles.cellMain}>
                        <span className={styles.cellTitle}>
                          {(course as any).title}
                        </span>
                        <span className={styles.cellSub}>
                          ID: {(course as any).id}
                        </span>
                      </div>
                    </td>
                    <td className={styles.td}>
                      {(course as any).price != null
                        ? `${(course as any).price.toLocaleString?.() ?? (course as any).price} đ`
                        : "-"}
                    </td>
                    <td className={styles.td}>{renderStatusBadge(course)}</td>
                    <td className={styles.tdRight}>
                      <button
                        className={`${styles.actionButton} ${styles.actionEdit}`}
                        onClick={() => handleOpenEdit(course)}
                      >
                        Sửa
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.actionDelete}`}
                        disabled={deletingId === (course as any).id}
                        onClick={() =>
                          handleDelete((course as any).id as number)
                        }
                      >
                        {deletingId === (course as any).id
                          ? "Đang xoá..."
                          : "Xoá"}
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
                  onChange={(e) =>
                    handleChangeField("title", e.target.value)
                  }
                  placeholder="Ví dụ: Lập trình Java từ cơ bản đến nâng cao"
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Mô tả</label>
                <textarea
                  className={styles.modalTextarea}
                  value={form.description}
                  onChange={(e) =>
                    handleChangeField("description", e.target.value)
                  }
                  placeholder="Mô tả ngắn gọn nội dung và mục tiêu khóa học..."
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Học phí (VNĐ)</label>
                <input
                  className={styles.modalInput}
                  value={form.price}
                  onChange={(e) =>
                    handleChangeField("price", e.target.value)
                  }
                  placeholder="Ví dụ: 1500000"
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
    </div>
  );
}
