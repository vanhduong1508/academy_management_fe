import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseByIdApi, getCourseStructureApi } from "../../api/student/course.api";
import { createOrderApi } from "../../api/student/order.api";
import type { CourseResponse, CourseStructureResponse } from "../../types/student/course.types";
import styles from "../../styles/user/UserCourseDetail.module.css";

const normalizeDateInput = (value?: string | null): string => {
  if (!value) return "-";
  return value.slice(0, 10);
};

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseResponse | null>(null);
  const [structure, setStructure] = useState<CourseStructureResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchCourseData(Number(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCourseData = async (courseId: number) => {
    try {
      setLoading(true);
      setError(null);
      const [courseData, structureData] = await Promise.all([
        getCourseByIdApi(courseId),
        getCourseStructureApi(courseId).catch(() => null), // Structure có thể không có
      ]);
      setCourse(courseData);
      setStructure(structureData);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được thông tin khóa học.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!course || !id) return;

    if (course.status !== "ACTIVE") {
      alert("Khóa học này hiện không khả dụng.");
      return;
    }

    if (!window.confirm(`Bạn có chắc muốn đăng ký khóa học "${course.title}"?`)) {
      return;
    }

    try {
      setCreatingOrder(true);
      await createOrderApi({ courseId: Number(id) });
      alert("Đăng ký thành công! Vui lòng thanh toán để kích hoạt khóa học.");
      navigate("/student/orders");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setCreatingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.infoText}>Đang tải thông tin khóa học...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || "Không tìm thấy khóa học."}</p>
        <button
          className={styles.button}
          onClick={() => navigate("/student/courses")}
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

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
        <p className={styles.code}>Mã khóa học: {course.code}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Mô tả khóa học</h2>
            <p className={styles.description}>
              {course.content || "Chưa có mô tả chi tiết."}
            </p>
          </div>

          {structure && structure.chapters.length > 0 && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Lộ trình khóa học</h2>
              <div className={styles.structureWrapper}>
                {structure.chapters.map((chapter, chapterIndex) => (
                  <div key={chapter.id} className={styles.chapterBlock}>
                    <div className={styles.chapterHeader}>
                      <span className={styles.chapterIndex}>
                        Chương {chapterIndex + 1}
                      </span>
                      <span className={styles.chapterTitle}>{chapter.title}</span>
                    </div>
                    {chapter.lessons.length > 0 ? (
                      <ul className={styles.lessonList}>
                        {chapter.lessons.map((lesson, lessonIndex) => (
                          <li key={lesson.id} className={styles.lessonItem}>
                            <span className={styles.lessonIndex}>
                              Bài {lessonIndex + 1}:
                            </span>
                            <span className={styles.lessonTitle}>{lesson.title}</span>
                            {lesson.type && (
                              <span className={styles.lessonType}>
                                {" "}
                                – {lesson.type}
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={styles.lessonEmpty}>Chưa có bài học nào.</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.priceCard}>
            <p className={styles.priceLabel}>Học phí</p>
            <p className={styles.priceValue}>
              {course.price?.toLocaleString("vi-VN")} VNĐ
            </p>
          </div>

          <div className={styles.infoCard}>
            <p className={styles.infoRow}>
              <span className={styles.infoLabel}>Thời gian:</span>
              <span>
                {normalizeDateInput(course.startDate)} →{" "}
                {normalizeDateInput(course.endDate)}
              </span>
            </p>
            <p className={styles.infoRow}>
              <span className={styles.infoLabel}>Trạng thái:</span>
              <span>
                {course.status === "ACTIVE" ? "Đang mở" : "Đã ẩn"}
              </span>
            </p>
          </div>

          <button
            className={`${styles.enrollButton} ${
              course.status !== "ACTIVE" ? styles.enrollButtonDisabled : ""
            }`}
            onClick={handleEnroll}
            disabled={creatingOrder || course.status !== "ACTIVE"}
          >
            {creatingOrder ? "Đang xử lý..." : "Đăng ký ngay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
