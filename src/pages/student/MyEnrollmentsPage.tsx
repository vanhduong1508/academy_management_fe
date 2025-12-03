// src/pages/student/MyEnrollmentsPage.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { getMyEnrollmentsApi } from "../../api/student/student-orders.api";
import type { Enrollment } from "../../types/models/enrollment.types";
import { useNavigate } from "react-router-dom";

const MyEnrollmentsPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentId) return;
      const data = await getMyEnrollmentsApi(user.studentId);
      setEnrollments(data);
    };
    fetchData();
  }, [user?.studentId]);

  return (
    <div>
      <h2>Khóa học của tôi</h2>
      <table style={{ width: "100%", marginTop: 16 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Khóa học</th>
            <th>Trạng thái</th>
            <th>Chứng chỉ</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {enrollments.map((e) => (
            <tr key={e.id}>
              <td>{e.id}</td>
              <td>{e.courseTitle}</td>
              <td>{e.result}</td>
              <td>{e.certificateNo || "-"}</td>
              <td>
                <button
                  onClick={() =>
                    navigate(`/student/my-courses/${e.id}/progress`)
                  }
                >
                  Xem tiến độ
                </button>
              </td>
            </tr>
          ))}
          {enrollments.length === 0 && (
            <tr>
              <td colSpan={5}>Bạn chưa có khóa học nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyEnrollmentsPage;
