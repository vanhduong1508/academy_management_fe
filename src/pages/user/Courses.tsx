import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCoursesApi } from "../../api/student/course.api";
import type { CoursePageResponse, CourseResponse } from "../../types/student/course.types";
import styles from "../../styles/user/UserCourseList.module.css";

const normalizeDate = (value?: string | null) => (value ? value.slice(0, 10) : "-");

const Courses = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const size = 10;

  const [coursesPage, setCoursesPage] = useState<CoursePageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllCoursesApi(page, size);
      setCoursesPage(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Không tải được danh sách khóa học.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const courses = useMemo(
    () => coursesPage?.content ?? [],
    [coursesPage?.content]
  );

  const totalPages = coursesPage?.totalPages ?? 1;
  const currentPage = coursesPage?.number ?? page;

  const onClickCourse = (id: number) => navigate(`/student/courses/${id}`);

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Danh sách khóa học</h2>
          <p className={styles.subtitle}>
            Xem và đăng ký các khóa học có sẵn trong hệ thống.
          </p>
        </div>

        <button className={styles.button} onClick={fetchCourses} disabled={loading}>
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && !coursesPage && (
        <p className={styles.infoText}>Đang tải danh sách khóa học...</p>
      )}

      {!loading && courses.length === 0 && (
        <p className={styles.infoText}>Chưa có khóa học nào.</p>
      )}

      {!loading && courses.length > 0 && (
        <>
          <div className={styles.courseGrid}>
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onClick={onClickCourse} />
            ))}
          </div>

          <div className={styles.pagination}>
            <span>
              Trang {currentPage + 1}/{totalPages}
            </span>

            <button
              className={styles.pageButton}
              disabled={currentPage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Trước
            </button>

            <button
              className={styles.pageButton}
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;


interface CourseCardProps {
  course: CourseResponse;
  onClick: (id: number) => void;
}

const CourseCard = ({ course, onClick }: CourseCardProps) => {
  const goToDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick(course.id);
  };

  return (
    <div className={styles.courseCard} onClick={() => onClick(course.id)}>
      <div className={styles.courseCardHeader}>
        <h3 className={styles.courseCardTitle}>{course.title}</h3>
        <StatusBadge status={course.status} />
      </div>

      <p className={styles.courseCardCode}>Mã: {course.code}</p>

      <p className={styles.courseCardContent}>
        {course.content?.slice(0, 150) || "Chưa có mô tả"}...
      </p>

      <div className={styles.courseCardMeta}>
        <span>{normalizeDate(course.startDate)} → {normalizeDate(course.endDate)}</span>
        <span className={styles.coursePrice}>
          {course.price.toLocaleString("vi-VN")} VNĐ
        </span>
      </div>

      <button className={styles.courseCardButton} onClick={goToDetail}>
        Xem chi tiết
      </button>
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={
        isActive
          ? `${styles.badgeStatus} ${styles.badgeActive}`
          : `${styles.badgeStatus} ${styles.badgeInactive}`
      }
    >
      {isActive ? "Đang mở" : "Đã ẩn"}
    </span>
  );
};
