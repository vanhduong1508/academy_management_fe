import React, { useEffect, useState } from "react";
import { courseApi } from "../../services/api/courseApi";
import {
  getAllEnrollments,
  updateEnrollmentResult,
  Enrollment,
  UpdateResultPayload,
} from "../../services/api/enrollmentApi";
import { Course } from "../../types/course";

const RegistrationManagementPage: React.FC = () => {
  // State khóa học
  const [courseData, setCourseData] = useState<{ courses: Course[]; totalPages: number }>({
    courses: [],
    totalPages: 0,
  });

  // State enrollment
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" = tất cả

  // Load courses từ BE
  const loadCourses = async () => {
    try {
      const data = await courseApi.getAll(page, size, search, statusFilter);
      setCourseData(data);
    } catch (err) {
      console.error("Lỗi tải danh sách khóa học:", err);
    }
  };

  // Load enrollments từ BE
  const loadEnrollments = async () => {
    try {
      const data = await getAllEnrollments(page, size);
      setEnrollments(data.content);
    } catch (err) {
      console.error("Lỗi tải danh sách đăng ký:", err);
    }
  };

  // Cập nhật kết quả PASS/FAIL
  const handleUpdateResult = async (enrollmentId: number, passed: boolean) => {
    const payload: UpdateResultPayload = { passed };
    try {
      await updateEnrollmentResult(enrollmentId, payload);
      // reload enrollments
      loadEnrollments();
    } catch (err) {
      console.error("Lỗi cập nhật kết quả:", err);
    }
  };

  // useEffect reload khi search/status/page thay đổi
  useEffect(() => {
    loadCourses();
    loadEnrollments();
  }, [page, search, statusFilter]);

  // Lọc khóa học đang diễn ra
  const now = new Date();
  const activeCourses = courseData.courses.filter(
    (c: Course) =>
      c.status === "ACTIVE" &&
      new Date(c.startDate) <= now &&
      now <= new Date(c.endDate)
  );

  // Pagination buttons
  const pages = Array.from({ length: courseData.totalPages }, (_, i) => i);

  return (
    <div>
      <h1>Quản lý đăng ký khóa học</h1>

      {/* Search + filter */}
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm khóa học..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </div>

      {/* Course table */}
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Mã</th>
            <th>Tên khóa học</th>
            <th>Trạng thái</th>
            <th>Bắt đầu</th>
            <th>Kết thúc</th>
            <th>Học viên đã đăng ký</th>
          </tr>
        </thead>
        <tbody>
          {courseData.courses.map((course) => {
            const courseEnrollments = enrollments.filter((e) => e.courseId === course.id);
            return (
              <tr key={course.id}>
                <td>{course.code}</td>
                <td>{course.title}</td>
                <td>{course.status}</td>
                <td>{course.startDate}</td>
                <td>{course.endDate}</td>
                <td>
                  {courseEnrollments.length === 0
                    ? "Chưa có học viên"
                    : courseEnrollments.map((e) => (
                        <div key={e.id}>
                          {e.studentName} - {e.result || "Chưa có kết quả"}{" "}
                          <button
                            onClick={() =>
                              handleUpdateResult(e.id, e.result !== "PASS")
                            }
                          >
                            {e.result === "PASS" ? "Set FAIL" : "Set PASS"}
                          </button>
                        </div>
                      ))}
                </td>
              </tr>
            );
          })}
          {courseData.courses.length === 0 && (
            <tr>
              <td colSpan={6}>Không có khóa học nào.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        {pages.map((p) => (
          <button key={p} onClick={() => setPage(p)} disabled={p === page}>
            {p + 1}
          </button>
        ))}
      </div>

      {/* Khóa học đang diễn ra */}
      <h2>Khóa học đang diễn ra</h2>
      <ul>
        {activeCourses.map((c) => (
          <li key={c.id}>
            {c.title} ({c.startDate} - {c.endDate})
          </li>
        ))}
        {activeCourses.length === 0 && <li>Không có khóa học nào đang diễn ra.</li>}
      </ul>
    </div>
  );
};

export default RegistrationManagementPage;
