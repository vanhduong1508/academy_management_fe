import { useEffect, useState } from 'react';
import {
  getEnrollmentsPageApi,
  getCompletionStatusApi,
  updateCompletionStatusApi,
  issueCertificateApi,
} from '../../api/enrollment.api';

import type { Enrollment } from '../../types/models/enrollment.types';
import styles from '../../styles/layout.module.css';
import componentStyles from '../../styles/components.module.css';

const EnrollmentAdminPage = () => {
  const [data, setData] = useState<Enrollment[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // ===== LOAD PAGE =====
  const load = async (p = 0) => {
    setLoading(true);
    try {
      const res = await getEnrollmentsPageApi(p, 10);
      setData(res.content);
      setPage(res.number);
      setTotalPages(res.totalPages);
    } catch (e: any) {
      setMessage(e.response?.data?.message || 'Lỗi tải enrollments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(0);
  }, []);

  // ===== ĐÁNH DẤU HOÀN THÀNH =====
  const handleCompletion = async (enrollmentId: number) => {
    try {
      await updateCompletionStatusApi(enrollmentId, { completed: true });
      setMessage('Đã đánh dấu hoàn thành, chờ cấp chứng chỉ.');
      load(page);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Không thể cập nhật hoàn thành.');
    }
  };

  // ===== CẤP CHỨNG CHỈ =====
  const handleCert = async (enrollmentId: number, passed: boolean) => {
    try {
      await issueCertificateApi(enrollmentId, { passed });
      setMessage('Đã chấm kết quả và cấp chứng chỉ');
      load(page);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Cấp chứng chỉ thất bại.');
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Quản lý Enrollment & Chứng chỉ</h1>

      {loading && <p>Đang tải...</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Học viên</th>
            <th>Khoá học</th>
            <th>Ngày ghi danh</th>
            <th>Trạng thái</th>
            <th>Kết quả</th>
            <th>Chứng chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {data.map((e) => (
            <tr key={e.id}>
              <td>{e.studentName}</td>
              <td>{e.courseTitle}</td>
              <td>{new Date(e.enrolledAt).toLocaleDateString()}</td>
              <td>{e.status || '—'}</td>
              <td>{e.result || 'Chưa có'}</td>
              <td>{e.certificateNo || '—'}</td>

              <td>
                {/* BUTTON: Đánh dấu hoàn thành */}
                <button
                  className={componentStyles.primaryButton}
                  onClick={() => handleCompletion(e.id)}
                >
                  Hoàn thành 100%
                </button>

                {/* BUTTON: Cấp chứng chỉ */}
                <button
                  className={componentStyles.primaryButton}
                  style={{ marginLeft: 4 }}
                  onClick={() => handleCert(e.id, true)}
                >
                  Đạt + Cấp chứng chỉ
                </button>

                <button
                  className={componentStyles.dangerButton}
                  style={{ marginLeft: 4 }}
                  onClick={() => handleCert(e.id, false)}
                >
                  Không đạt
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PHÂN TRANG */}
      <div style={{ marginTop: 12 }}>
        <button disabled={page === 0} onClick={() => load(page - 1)}>
          Trang trước
        </button>

        <span style={{ margin: '0 10px' }}>
          {page + 1} / {totalPages}
        </span>

        <button disabled={page + 1 >= totalPages} onClick={() => load(page + 1)}>
          Trang sau
        </button>
      </div>
    </div>
  );
};

export default EnrollmentAdminPage;
