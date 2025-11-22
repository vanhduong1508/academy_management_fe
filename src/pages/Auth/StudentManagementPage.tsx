// src/pages/Auth/StudentManagementPage.tsx

import React, { useState } from 'react';
import styles from './StudentManagementPage.module.css';

// Dữ liệu giả định cho bảng
const studentData = [
  { id: 'HV001', name: 'Nguyễn Văn An', dob: '15/3/1995', district: 'Hà Nội', province: 'Hà Nội' },
  { id: 'HV002', name: 'Trần Thị Bình', dob: '22/7/1998', district: 'Hải Phòng', province: 'Hải Phòng' },
  { id: 'HV003', name: 'Lê Văn Cường', dob: '10/12/1996', district: 'Đà Nẵng', province: 'Đà Nẵng' },
  { id: 'HV004', name: 'Phạm Thị Dung', dob: '8/5/1997', district: 'Hồ Chí Minh', province: 'Hồ Chí Minh' },
];

const StudentManagementPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Hàm lọc dữ liệu theo thanh tìm kiếm (chỉ cho UI mock)
  const filteredStudents = studentData.filter(student =>
    student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Hành động giả định
  const handleAddStudent = () => {
    alert('Chức năng Thêm học viên đang được phát triển...');
  };
  const handleEdit = (id: string) => {
    alert(`Chỉnh sửa học viên: ${id}`);
  };
  const handleDelete = (id: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa học viên ${id}?`)) {
      alert(`Đã xóa học viên: ${id} (Mock UI)`);
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Tiêu đề trang */}
      <h1 className={styles.pageTitle}>Học viên</h1>
      
      {/* Khu vực Tìm kiếm và Thêm mới */}
      <div className={styles.headerBar}>
        <div className={styles.searchContainer}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã học viên hoặc tên..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        
        {/* Nút Thêm mới */}
        <button className={styles.addButton} onClick={handleAddStudent}>
          + Thêm học viên
        </button>
      </div>

      {/* Bảng dữ liệu học viên */}
      <div className={styles.tableContainer}>
        <h2 className={styles.sectionTitle}>Quản lý học viên</h2>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Mã học viên</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Quê quán</th>
              <th>Tỉnh thường trú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.dob}</td>
                <td>{student.district}</td>
                <td>{student.province}</td>
                <td className={styles.actions}>
                  <span 
                    className={styles.actionIcon} 
                    onClick={() => handleEdit(student.id)}
                  >
                    ✏️
                  </span>
                  <span 
                    className={styles.actionIcon} 
                    onClick={() => handleDelete(student.id)}
                  >
                    🗑️
                  </span>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.noData}>Không tìm thấy học viên nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default StudentManagementPage;