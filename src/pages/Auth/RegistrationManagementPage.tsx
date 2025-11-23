// src/pages/Auth/RegistrationManagementPage.tsx

import React, { useEffect, useState } from 'react';
import styles from './RegistrationManagementPage.module.css';
import { Enrollment } from '../../types/enrollment';
import { getAllEnrollments, updateEnrollmentResult } from '../../services/api/enrollmentApi';

// Trạng thái hiển thị
const statusOptions = ['Đang học', 'Chờ duyệt', 'Hoàn thành', 'Đã hủy'] as const;
const actionOptions = ['Đang học', 'Hoàn thành'] as const;

const RegistrationManagementPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch danh sách enrollment từ backend
  const fetchEnrollments = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllEnrollments();
      setEnrollments(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Lỗi khi tải danh sách enrollment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleStatusChange = async (id: number, newStatus: Enrollment['result']) => {
    // Mock update hoặc gọi backend update nếu có API
    try {
      // Ví dụ: update enrollment result nếu trạng thái là "PASSED" hoặc "FAILED"
      if (newStatus === 'PASSED' || newStatus === 'FAILED') {
        await updateEnrollmentResult(id, { passed: newStatus === 'PASSED' });
      }
      setEnrollments(prev =>
        prev.map(e => (e.id === id ? { ...e, result: newStatus } : e))
      );
    } catch (err: any) {
      console.error(err);
      alert(`Không thể cập nhật trạng thái enrollment: ${err.message || err}`);
    }
  };

  // Lọc enrollment theo searchTerm
  const filteredEnrollments = enrollments.filter(e =>
    e.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.studentCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Quản lý đăng ký khóa học</h1>

      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm học viên, mã học viên hoặc khóa học..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className={styles.tableContainer}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Học viên</th>
              <th>Khóa học</th>
              <th>Ngày đăng ký</th>
              <th>Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.length === 0 && !loading && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center' }}>
                  Không tìm thấy enrollment nào.
                </td>
              </tr>
            )}

            {filteredEnrollments.map(enrollment => ( 
              <tr key={enrollment.id}>
                <td>{enrollment.id}</td>
                <td>{enrollment.studentName} ({enrollment.studentCode})</td>
                <td>{enrollment.courseTitle} ({enrollment.courseCode})</td>
                <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                <td>
                  <select
                    value={enrollment.result || ''}
                    onChange={e => handleStatusChange(enrollment.id, e.target.value as Enrollment['result'])}
                  >
                    <option value="">Chưa có kết quả</option>
                    <option value="PASSED">PASSED</option>
                    <option value="FAILED">FAILED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegistrationManagementPage;