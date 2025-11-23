// src/pages/Auth/CourseManagementPage.tsx

import React, { useState } from 'react';
import styles from '../../styles/CourseManagementPage.module.css';

// Dữ liệu giả định cho bảng khóa học
const courseData = [
  { id: 'KH001', name: 'Khóa học lập trình Web Frontend', startDate: '15/1/2024', endDate: '15/4/2024', status: 'Đã kết thúc', content: 'Học HTML, CSS, JavaScript, React và các công nghệ frontend hiện đại' },
  { id: 'KH002', name: 'Khóa học Backend Development', startDate: '1/3/2024', endDate: '1/9/2024', status: 'Đã kết thúc', content: 'Học NodeJS, Express, MongoDB và xây dựng API' },
  { id: 'KH003', name: 'Khóa học Data Science', startDate: '1/1/2025', endDate: '1/4/2025', status: 'Sắp diễn ra', content: 'Học Python, Pandas, Numpy, Machine Learning' },
  { id: 'KH004', name: 'Khóa học UX/UI Design', startDate: '1/12/2025', endDate: '1/3/2026', status: 'Sắp diễn ra', content: 'Thiết kế giao diện người dùng, trải nghiệm người dùng, Figma' },
  { id: 'KH005', name: 'Khóa học Mobile Development', startDate: '1/10/2025', endDate: '1/1/2026', status: 'Đang diễn ra', content: 'Phát triển ứng dụng di động với React Native' },
];

// Định nghĩa trạng thái lọc
type CourseStatus = 'Tất cả' | 'Sắp diễn ra' | 'Đang diễn ra' | 'Đã kết thúc';

const statusCounts = {
    'Tất cả': courseData.length,
    'Sắp diễn ra': courseData.filter(c => c.status === 'Sắp diễn ra').length,
    'Đang diễn ra': courseData.filter(c => c.status === 'Đang diễn ra').length,
    'Đã kết thúc': courseData.filter(c => c.status === 'Đã kết thúc').length,
};


const CourseManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState<CourseStatus>('Tất cả');

  // Logic lọc theo trạng thái và tìm kiếm
  const filteredCourses = courseData
    .filter(course => activeStatus === 'Tất cả' || course.status === activeStatus)
    .filter(course => 
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  // Hành động giả định
  const handleAddCourse = () => {
    alert('Chức năng Thêm khóa học đang được phát triển...');
  };
  const handleEdit = (id: string) => {
    alert(`Chỉnh sửa khóa học: ${id}`);
  };
  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khóa học ${id}?`)) {
      alert(`Đã xóa khóa học: ${id} (Mock UI)`);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Tiêu đề trang */}
      <h1 className={styles.pageTitle}>Khóa học</h1>
      
      {/* --- Khu vực Tìm kiếm và Thêm mới --- */}
      <div className={styles.topBar}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã khóa, tên, hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        {/* Nút Thêm mới */}
        <button className={styles.addButton} onClick={handleAddCourse}>
          + Thêm khóa học
        </button>
      </div>

      {/* --- Lọc theo trạng thái --- */}
      <div className={styles.statusFilter}>
        <h3 className={styles.filterTitle}>Lọc theo trạng thái:</h3>
        <div className={styles.statusButtons}>
          {(['Tất cả', 'Sắp diễn ra', 'Đang diễn ra', 'Đã kết thúc'] as CourseStatus[]).map(status => (
            <button
              key={status}
              className={`${styles.statusButton} ${activeStatus === status ? styles.activeStatus : ''}`}
              onClick={() => setActiveStatus(status)}
            >
              {status} <span>{statusCounts[status]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- Bảng dữ liệu Khóa học --- */}
      <div className={styles.tableContainer}>
        <h2 className={styles.sectionTitle}>Quản lý khóa học</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Mã khóa</th>
              <th>Tên khóa học</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Trạng thái</th>
              <th>Nội dung</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>{course.startDate}</td>
                <td>{course.endDate}</td>
                <td className={styles.statusCell}>
                    <span className={styles.statusBadge} data-status={course.status.replace(/\s/g, '-')}>
                        {course.status}
                    </span>
                </td>
                <td className={styles.contentCell}>{course.content}</td>
                <td className={styles.actions}>
                  <span 
                    className={styles.actionIcon} 
                    onClick={() => handleEdit(course.id)}
                  >
                    ✏️
                  </span>
                  <span 
                    className={styles.actionIcon} 
                    onClick={() => handleDelete(course.id)}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
            {filteredCourses.length === 0 && (
              <tr>
                <td colSpan={7} className={styles.noData}>Không tìm thấy khóa học nào khớp với điều kiện lọc.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default CourseManagementPage;