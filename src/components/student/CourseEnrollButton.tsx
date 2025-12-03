// src/components/student/CourseEnrollButton.tsx
import React, { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { createOrderApi } from "../../api/student/student-orders.api";
import type { OrderCreatePayload } from "../../types/models/order.types";

type Props = {
  courseId: number;
};

const CourseEnrollButton: React.FC<Props> = ({ courseId }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!user) {
      alert("Bạn cần đăng nhập trước.");
      return;
    }
    if (user.role !== "STUDENT") {
      alert("Chỉ tài khoản học viên mới đăng ký khóa học.");
      return;
    }
    if (!user.studentId) {
      alert("Không tìm thấy studentId trong tài khoản. Kiểm tra lại BE.");
      return;
    }

    const payload: OrderCreatePayload = {
      studentId: user.studentId,
      courseId,
      amount: 0
    };

    try {
      setLoading(true);
      await createOrderApi(payload);
      alert("Đã tạo đơn hàng. Vui lòng chờ admin duyệt.");
    } catch (err: any) {
      console.error(err);
      alert(
        err?.response?.data?.message ||
          "Tạo đơn hàng thất bại. Thử lại sau nhé."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleEnroll} disabled={loading}>
      {loading ? "Đang xử lý..." : "Đăng ký / Mua khóa học"}
    </button>
  );
};

export default CourseEnrollButton;
