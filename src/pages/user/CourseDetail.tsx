import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseByIdApi, getCourseStructureApi } from "../../api/student/course.api";
import { createOrderApi, getMyOrdersApi } from "../../api/student/order.api";
import type { CourseResponse, CourseStructureResponse } from "../../types/student/course.types";
import styles from "../../styles/user/UserCourseDetail.module.css";

const normalizeDate = (date?: string | null) => (date ? date.slice(0, 10) : "-");

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [structure, setStructure] = useState<CourseStructureResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  const fetchCourseData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      const courseId = Number(id);

      const [courseData, structureData, orders] = await Promise.all([
        getCourseByIdApi(courseId),
        getCourseStructureApi(courseId).catch(() => null),
        getMyOrdersApi(),
      ]);

      setCourse(courseData);
      setStructure(structureData);

      setAlreadyEnrolled(
        orders.some(
          (o) =>
            o.courseId === courseId &&
            (o.approvalStatus === "APPROVED" || o.approvalStatus === "PENDING")
        )
      );
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không tải được thông tin khóa học.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleEnroll = async () => {
    if (!course || !id) {
      alert("Không thể đăng ký.");
      return;
    }

    if (alreadyEnrolled) {
      alert("Bạn đã đăng ký khóa học này rồi!");
      return;
    }

    if (course.status !== "ACTIVE") {
      alert("Khóa học hiện không khả dụng.");
      return;
    }

    const confirmEnroll = window.confirm(
      `Bạn có muốn đăng ký khóa học "${course.title}"?`
    );
    if (!confirmEnroll) return;

    setCreatingOrder(true);

    try {
      await createOrderApi({ courseId: Number(id) });
      alert("Đăng ký thành công! Vui lòng kiểm tra đơn hàng.");
      navigate("/student/orders");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Không thể đăng ký.");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading)
    return (
      <div className={styles.page}>
        <p className={styles.infoText}>Đang tải...</p>
      </div>
    );

  if (error || !course)
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || "Không tìm thấy khóa học."}</p>
        <button
          className={styles.button}
          onClick={() => navigate("/student/courses")}
        >
          Quay lại
        </button>
      </div>
    );

  return (
    <div className={styles.page}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/student/courses")}
      >
        ← Quay lại
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.code}>Mã: {course.code}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Mô tả khóa học</h2>
            <p className={styles.description}>
              {course.content || "Chưa có mô tả."}
            </p>
          </section>

          {structure?.chapters?.length ? (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Lộ trình học</h2>

              <div className={styles.structureWrapper}>
                {structure.chapters.map((chapter, idx) => (
                  <div key={chapter.id} className={styles.chapterBlock}>
                    <div className={styles.chapterHeader}>
                      <span>Chương {idx + 1}</span>
                      <span>{chapter.title}</span>
                    </div>

                    {chapter.lessons?.length ? (
                      <ul className={styles.lessonList}>
                        {chapter.lessons.map((lesson, lIdx) => (
                          <li key={lesson.id} className={styles.lessonItem}>
                            <span>Bài {lIdx + 1}:</span>
                            <span> {lesson.title}</span>
                            {lesson.type && <span> – {lesson.type}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.lessonEmpty}>Chưa có bài học.</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.priceCard}>
            <p className={styles.priceLabel}>Học phí</p>
            <p className={styles.priceValue}>
              {course.price.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          <div className={styles.infoCard}>
            <p>
              <strong>Thời gian:</strong> {normalizeDate(course.startDate)} →{' '}
              {normalizeDate(course.endDate)}
            </p>
            <p>
              <strong>Trạng thái:</strong>{' '}
              {course.status === "ACTIVE" ? "Đang mở" : "Đã ẩn"}
            </p>
          </div>

          <button
            className={`${styles.enrollButton} ${
              course.status !== "ACTIVE" || alreadyEnrolled
                ? styles.enrollButtonDisabled
                : ""
            }`}
            onClick={handleEnroll}
            disabled={creatingOrder || course.status !== "ACTIVE" || alreadyEnrolled}
          >
            {alreadyEnrolled
              ? "Đã đăng ký"
              : creatingOrder
              ? "Đang xử lý..."
              : "Đăng ký ngay"}
          </button>
        </aside>
      </div>
    </div>
  );
};

export default CourseDetail;
