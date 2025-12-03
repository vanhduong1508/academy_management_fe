// src/pages/student/CourseListPage.tsx
import React, { useEffect, useState } from "react";
import { getStudentCoursesPageApi } from "../../api/student/student.courses.api";
import type { Course, PageResponse } from "../../types/models/course.types";
import { useAppSelector } from "../../redux/hooks";
import { createOrderApi } from "../../api/student/student-orders.api";

const CourseListPage: React.FC = () => {
  const [pageData, setPageData] = useState<PageResponse<Course> | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector((state) => state.auth);

  const fetchCourses = async (page = 0) => {
    setLoading(true);
    try {
      const data = await getStudentCoursesPageApi(page, 8);
      setPageData(data);
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
      await createOrderApi({
        studentId: user.studentId,
        courseId: course.id,
        paymentMethod: "BANKING",
        amount: 0
      });
      alert("Đã tạo đơn đăng ký khóa học. Vui lòng chờ admin duyệt!");
    } catch (e: any) {
      alert(
        e?.response?.data?.message ||
          "Tạo đơn hàng thất bại. Vui lòng thử lại sau."
      );
    }
  };

  if (loading && !pageData) return <div>Đang tải khóa học...</div>;

  return (
    <div>
      <h2>Danh sách khóa học</h2>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 24 }}>
        {pageData?.content.map((course) => (
          <div
            key={course.id}
            style={{ border: "1px solid #eee", padding: 16, borderRadius: 8 }}
          >
            <h3>{course.title}</h3>
            <p>Mã khóa học: {course.code}</p>
            <p>Giá: {course.price} VND</p>
            <button onClick={() => handleEnroll(course)}>Đăng ký khóa học</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseListPage;
