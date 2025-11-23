// src/pages/Auth/RegistrationManagementPage.tsx

import React, { useState } from 'react';
import styles from '../../styles/RegistrationManagementPage.module.css';

// Định nghĩa types cho dữ liệu và trạng thái
interface Registration {
    id: string;
    student: string;
    course: string;
    date: string;
    status: 'Đang học' | 'Chờ duyệt' | 'Hoàn thành' | 'Đã hủy';
    action: 'Đang học' | 'Hoàn thành';
}

// Dữ liệu giả định
const initialRegistrations: Registration[] = [
  { id: 'DK004', student: 'Phạm Thị Dung', course: 'Khóa học Backend Development', date: '28/2/2024', status: 'Đang học', action: 'Đang học' },
  { id: 'DK003', student: 'Lê Văn Cường', course: 'Khóa học Backend Development', date: '25/2/2024', status: 'Đang học', action: 'Đang học' },
  { id: 'DK002', student: 'Trần Thị Bình', course: 'Khóa học Lập trình Web Frontend', date: '12/1/2024', status: 'Hoàn thành', action: 'Hoàn thành' },
  { id: 'DK001', student: 'Nguyễn Văn An', course: 'Khóa học Lập trình Web Frontend', date: '10/1/2024', status: 'Hoàn thành', action: 'Hoàn thành' },
];

const RegistrationManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [registrations, setRegistrations] = useState(initialRegistrations);
  
  // Các lựa chọn cho dropdown Trạng thái và Thao tác
  const statusOptions = ['Đang học', 'Chờ duyệt', 'Hoàn thành', 'Đã hủy'];
  const actionOptions = ['Đang học', 'Hoàn thành'];
  
  const handleStatusChange = (id: string, newStatus: Registration['status']) => {
    setRegistrations(prev => 
      prev.map(reg => (reg.id === id ? { ...reg, status: newStatus } : reg))
    );
    alert(`Cập nhật trạng thái ĐK ${id} thành: ${newStatus} (Mock UI)`);
  };

  const handleActionChange = (id: string, newAction: Registration['action']) => {
    setRegistrations(prev => 
      prev.map(reg => (reg.id === id ? { ...reg, action: newAction } : reg))
    );
    alert(`Cập nhật thao tác ĐK ${id} thành: ${newAction} (Mock UI)`);
  };
  
  const handleAddRegistration = () => {
    alert('Chức năng Đăng ký học viên mới đang được phát triển...');
  };

  const filteredRegistrations = registrations.filter(reg =>
    reg.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reg.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      
      {/* Tiêu đề trang */}
      <h1 className={styles.pageTitle}>Đăng ký</h1>
      
      {/* --- Khu vực Tìm kiếm và Thêm mới --- */}
      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đăng ký, học viên hoặc khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        {/* Nút Thêm mới */}
        <button className={styles.addButton} onClick={handleAddRegistration}>
          + Đăng ký học viên
        </button>
      </div>

      {/* --- Bảng dữ liệu Đăng ký --- */}
      <div className={styles.tableContainer}>
        <h2 className={styles.sectionTitle}>Quản lý đăng ký khóa học</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Mã đăng ký</th>
              <th>Học viên</th>
              <th>Khóa học</th>
              <th>Ngày đăng ký</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredRegistrations.map((reg) => (
              <tr key={reg.id}>
                <td>{reg.id}</td>
                <td className={styles.studentCell}>👤 {reg.student}</td>
                <td className={styles.courseCell}>📚 {reg.course}</td>
                <td>📅 {reg.date}</td>
                
                {/* Cột Trạng thái (Dropdown) */}
                <td>
                  <select 
                    value={reg.status} 
                    onChange={(e) => handleStatusChange(reg.id, e.target.value as Registration['status'])}
                    className={`${styles.statusSelect} ${styles[reg.status.replace(/\s/g, '').toLowerCase()]}`}
                  >
                    {statusOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
                
                {/* Cột Thao tác (Dropdown) */}
                <td>
                  <select 
                    value={reg.action} 
                    onChange={(e) => handleActionChange(reg.id, e.target.value as Registration['action'])}
                    className={styles.actionSelect}
                  >
                    {actionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredRegistrations.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.noData}>Không tìm thấy đăng ký nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default RegistrationManagementPage;