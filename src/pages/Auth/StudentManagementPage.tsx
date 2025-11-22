// src/pages/Auth/StudentManagementPage.tsx

import React, { useState, useEffect } from 'react';
import styles from './StudentManagementPage.module.css';

// 1. IMPORT CÁC THÀNH PHẦN TỪ SERVICE VÀ TYPES
import { getAllStudents } from '../../services/api/studentApi'; 
import { Student } from '../../types/student'; 

const StudentManagementPage: React.FC = () => {
  // 2. STATE QUẢN LÝ DỮ LIỆU VÀ TRẠNG THÁI
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- 3. LOGIC TẢI DỮ LIỆU TỪ API ---
  useEffect(() => {
    const fetchStudents = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getAllStudents();
        setStudents(data);
      } catch (err: any) {
        // Lấy thông báo lỗi từ hàm getAllStudents đã throw
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, []); // Chỉ chạy một lần khi component mount

  // --- 4. HÀM LỌC DỮ LIỆU ---
  // Lọc dữ liệu dựa trên mã học viên (code) và họ tên (fullName) từ API
  const filteredStudents = students.filter(student =>
    student.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // --- 5. HÀNH ĐỘNG THAO TÁC (Cần gọi API thực tế) ---
  
  const handleAddStudent = () => {
    // Chức năng mở modal thêm mới học viên...
    alert('Chức năng Thêm học viên đang được phát triển...');
  };
  
  const handleEdit = (id: number) => { 
    // Chức năng mở modal chỉnh sửa và tải dữ liệu học viên theo ID
    alert(`Chức năng Chỉnh sửa học viên ID: ${id} đang được phát triển...`);
  };
  
  const handleDelete = async (id: number) => { 
    if (window.confirm(`Bạn có chắc chắn muốn xóa học viên ID ${id} không?`)) {
      alert(`Đang xóa học viên: ${id} (Cần gọi API DELETE)`);
      // Thêm logic gọi API DELETE/students/{id} ở đây
      
      // Sau khi xóa thành công, cập nhật lại UI:
      // try {
      //   await deleteStudentApi(id); 
      //   setStudents(students.filter(s => s.id !== id));
      // } catch (e) {
      //   alert("Xóa thất bại!");
      // }
    }
  };

  // --- 6. HIỂN THỊ TRẠNG THÁI LOADING VÀ ERROR ---
  if (isLoading) {
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Học viên</h1>
            <p>Đang tải dữ liệu học viên...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Học viên</h1>
            <p className={styles.error}>Lỗi: {error}</p>
        </div>
    );
  }

  // --- 7. RENDER GIAO DIỆN CHÍNH ---
  return (
    <div className={styles.container}>
      
      {/* Tiêu đề trang */}
      <h1 className={styles.pageTitle}>Quản lý Học viên</h1>
      
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
        <h2 className={styles.sectionTitle}>Danh sách học viên</h2>
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
            {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                    // Dùng student.id từ API làm key
                    <tr key={student.id}> 
                      <td>{student.code}</td> {/* Mã học viên */}
                      <td>{student.fullName}</td> {/* Họ tên */}
                      <td>{student.dob}</td> {/* Ngày sinh (chú ý format nếu cần) */}
                      <td>{student.hometown}</td> {/* Quê quán */}
                      <td>{student.province}</td> {/* Tỉnh thường trú */}
                      <td className={styles.actions}>
                        <span 
                          className={styles.actionIcon} 
                          onClick={() => handleEdit(student.id)} // Truyền ID (number)
                        >
                          ✏️
                        </span>
                        <span 
                          className={styles.actionIcon} 
                          onClick={() => handleDelete(student.id)} // Truyền ID (number)
                        >
                          🗑️
                        </span>
                      </td>
                    </tr>
                ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.noData}>
                    {/* Hiển thị thông báo khi không tìm thấy kết quả */}
                    {students.length > 0 ? "Không tìm thấy học viên phù hợp với từ khóa." : "Hiện chưa có dữ liệu học viên nào."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentManagementPage;