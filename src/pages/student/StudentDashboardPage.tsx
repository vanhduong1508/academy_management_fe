// src/pages/student/StudentDashboardPage.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { getMyEnrollmentsApi } from "../../api/student/student-orders.api";
import type { Enrollment } from "../../types/models/enrollment.types";

const StudentDashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentId) return;
      const data = await getMyEnrollmentsApi(user.studentId);
      setEnrollments(data);
    };
    fetchData();
  }, [user?.studentId]);

  const total = enrollments.length;
  const completed = enrollments.filter((e) => e.result === "Dat").length;

  return (
    <div>
      <h2>Xin chào, {user?.fullName || user?.username}</h2>
      <p>Đây là tổng quan nhanh về việc học của bạn.</p>

      <div style={{ display: "flex", gap: 16, marginTop: 24 }}>
        <div>
          <h3>Tổng số khóa đăng ký</h3>
          <p>{total}</p>
        </div>
        <div>
          <h3>Khóa đã hoàn thành</h3>
          <p>{completed}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;
