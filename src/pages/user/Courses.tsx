import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCoursesApi } from "../../api/student/course.api";
import type { CoursePageResponse, CourseResponse } from "../../types/student/course.types";
import styles from "../../styles/user/UserCourseList.module.css";

const normalizeDateInput = (value?: string | null): string => {
  if (!value) return "-";
  return value.slice(0, 10);
};

const Courses = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [coursesPage, setCoursesPage] = useState<CoursePageResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCoursesApi(page, size);
      setCoursesPage(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được danh sách khóa học.");
    } finally {
      setLoading(false);
    }
  };

  const courses: CourseResponse[] = coursesPage?.content ?? [];
  const totalPages = coursesPage?.totalPages ?? 1;

  const renderStatusBadge = (course: CourseResponse) => {
    const isActive = course.status === "ACTIVE";
    const className = isActive ? `${styles.badgeStatus} ${styles.badgeActive}` : `${styles.badgeStatus} ${styles.badgeInactive}`;
    return <span className={className}>{isActive ? "Đang mở" : "Đã ẩn"}</span>;
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Danh sách khóa học</h2>
          <p className={styles.subtitle}>Xem và đăng ký các khóa học có sẵn trong hệ thống.</p>
        </div>
        <button className={styles.button} onClick={fetchCourses} disabled={loading}>{loading ? "Đang tải..." : "Tải lại"}</button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        {loading && coursesPage == null ? (
          <p className={styles.infoText}>Đang tải danh sách khóa học...</p>
        ) : courses.length === 0 ? (
          <p className={styles.infoText}>Chưa có khóa học nào.</p>
        ) : (
          <>
            <div className={styles.courseGrid}>
              {courses.map((course) => (
                <div key={course.id} className={styles.courseCard} onClick={() => navigate(`/student/courses/${course.id}`)}>
                  <div className={styles.courseCardHeader}>
                    <h3 className={styles.courseCardTitle}>{course.title}</h3>
                    {renderStatusBadge(course)}
                  </div>
                  <p className={styles.courseCardCode}>Mã: {course.code}</p>
                  <p className={styles.courseCardContent}>{course.content?.slice(0, 150) || "Chưa có mô tả"}...</p>
                  <div className={styles.courseCardMeta}>
                    <span>{normalizeDateInput(course.startDate)} → {normalizeDateInput(course.endDate)}</span>
                    <span className={styles.coursePrice}>{Number(course.price || 0).toLocaleString("vi-VN")} VNĐ</span>
                  </div>
                  <button className={styles.courseCardButton} onClick={(e) => { e.stopPropagation(); navigate(`/student/courses/${course.id}`); }}>Xem chi tiết</button>
                </div>
              ))}
            </div>

            {/* PAGINATION */}
            <div className={styles.pagination}>
              <span>Trang {(coursesPage?.number ?? page) + 1}/{totalPages || 1}</span>
              <button className={styles.pageButton} disabled={page === 0 || coursesPage?.first} onClick={() => setPage((p) => Math.max(0, p - 1))}>Trước</button>
              <button className={styles.pageButton} disabled={page + 1 >= totalPages || coursesPage?.last} onClick={() => setPage((p) => totalPages > 0 ? Math.min(totalPages - 1, p + 1) : p)}>Sau</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Courses;