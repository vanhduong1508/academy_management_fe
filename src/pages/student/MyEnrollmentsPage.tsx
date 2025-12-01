// src/pages/student/MyEnrollmentsPage.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchMyEnrollments } from '../../redux/slices/order.slice';
import styles from '../../styles/layout.module.css';

const MyEnrollmentsPage = () => {
  const dispatch = useAppDispatch();
  const { myEnrollments, loading, error } = useAppSelector((s) => s.orders);
  const studentId = useAppSelector((s) => s.auth.user?.id);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchMyEnrollments(studentId));
    }
  }, [dispatch, studentId]);

  if (!studentId) {
    return <p>Bạn cần đăng nhập bằng tài khoản học viên để xem danh sách khóa học.</p>;
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Khóa học của tôi</h1>

      {loading && <p>Đang tải...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && myEnrollments.length === 0 && <p>Chưa có khóa học nào được ghi danh.</p>}

      {myEnrollments.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mã khóa</th>
              <th>Tên khóa</th>
              <th>Ngày ghi danh</th>
              <th>Trạng thái</th>
              <th>Kết quả</th>
              <th>Số chứng chỉ</th>
            </tr>
          </thead>
          <tbody>
            {myEnrollments.map((e) => (
              <tr key={e.id}>
                <td>{e.courseCode}</td>
                <td>{e.courseTitle}</td>
                <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                <td>{e.result || 'Đang học / Chờ duyệt'}</td>
                <td>{e.certificateNo || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyEnrollmentsPage;
