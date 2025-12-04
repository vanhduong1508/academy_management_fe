import React, { useEffect, useState } from "react";
import { getStudentCoursesPageApi } from "../../api/student/student.courses.api";
import type { Course, PageResponse } from "../../types/models/course.types";
import { useAppSelector } from "../../redux/hooks";
import { createOrderApi } from "../../api/student/student-orders.api";
import styles from "../../styles/CourseListPage.module.css";

const CourseListPage = () => {
  const [pageData, setPageData] = useState<PageResponse<Course> | null>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);

  const { user } = useAppSelector((state) => state.auth);

  const fetchCourses = async (pageIndex = 0) => {
    setLoading(true);
    try {
      const data = await getStudentCoursesPageApi(pageIndex, 8);
      setPageData(data);
      setPage(pageIndex);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(0);
  }, []);

  const handleEnroll = async (course: Course) => {
    if (!user?.studentId) {
      alert("Bạn chưa có thông tin học viên.");
      return;
    }

    try {
      const res = await createOrderApi({
        studentId: user.studentId,
        courseId: course.id,
        paymentMethod: "BANKING",
        amount: 0,
      });

      alert("Đã gửi yêu cầu đăng ký khóa học. Vui lòng chờ admin duyệt!");
    } catch (e: any) {
      alert(
        e?.response?.data?.message ||
          "Tạo đơn hàng thất bại. Vui lòng thử lại sau."
      );
    }
  };

  if (loading && !pageData) {
    return <div className={styles.loading}>Đang tải khóa học...</div>;
  }

  return (
    <div className={styles.coursePageContainer}>
      <h2 className={styles.coursePageTitle}>Danh sách khóa học</h2>

      <div className={styles.courseGrid}>
        {pageData?.content.map((course) => (
          <div key={course.id} className={styles.courseCard}>
            <h3 className={styles.courseTitle}>{course.title}</h3>

            <p className={styles.courseInfo}>
              <span>Mã khóa học:</span> <b>{course.code}</b>
            </p>

            <p className={styles.courseInfo}>
              <span>Giá:</span>{" "}
              <b>{course.price !== null ? `${course.price} VND` : "Miễn phí"}</b>
            </p>

            <button
              onClick={() => handleEnroll(course)}
              className={styles.enrollBtn}
            >
              Đăng ký khóa học
            </button>
          </div>
        ))}
      </div>

      {pageData && pageData.totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <button
            disabled={page === 0}
            onClick={() => fetchCourses(page - 1)}
            className={styles.paginationBtn}
          >
            Trang trước
          </button>

          <span className={styles.pageNumber}>
            {page + 1} / {pageData.totalPages}
          </span>

          <button
            disabled={page + 1 >= pageData.totalPages}
            onClick={() => fetchCourses(page + 1)}
            className={styles.paginationBtn}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
};

export default CourseListPage;
