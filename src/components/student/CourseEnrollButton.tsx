// src/components/student/CourseEnrollButton.tsx
import { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { createOrderApi } from '../../api/order.api';
import type { OrderCreatePayload } from '../../types/models/order.types';

type Props = {
  courseId: number;
  courseTitle: string;
};

const DEFAULT_AMOUNT = 100000; // tạm, sau sync với course.price nếu bạn thêm

const CourseEnrollButton: React.FC<Props> = ({ courseId, courseTitle }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const studentId = useAppSelector((state) => state.auth.user?.id);

  const handleClick = async () => {
    if (!studentId) {
      setMessage('Bạn cần đăng nhập với tài khoản học viên để đăng ký khoá học.');
      return;
    }

    const payload: OrderCreatePayload = {
      studentId,
      courseId,
      amount: DEFAULT_AMOUNT,
      paymentMethod: 'CASH',
    };

    setLoading(true);
    setMessage(null);

    try {
      await createOrderApi(payload);
      setMessage(`Đã tạo đơn đăng ký cho khoá "${courseTitle}". Vui lòng chờ Admin duyệt.`);
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Không thể tạo đơn đăng ký. Thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: 8 }}>
      <button
        disabled={loading}
        onClick={handleClick}
        style={{ padding: '6px 12px', borderRadius: 4 }}
      >
        {loading ? 'Đang xử lý...' : 'Đăng ký / Thanh toán'}
      </button>
      {message && <p style={{ marginTop: 4, fontSize: 12 }}>{message}</p>}
    </div>
  );
};

export default CourseEnrollButton;
