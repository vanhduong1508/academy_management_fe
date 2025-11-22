// src/pages/Auth/CertificationManagementPage.tsx

import React, { useState } from 'react';
import styles from './CertificationManagementPage.module.css';

// Định nghĩa types cho dữ liệu
interface Certificate {
    id: string;
    student: string;
    course: string;
    result: 'Đạt' | 'Không đạt';
    issueDate: string;
    note: string;
}

// Dữ liệu giả định
const initialCertificates: Certificate[] = [
  { id: 'CC001', student: 'Nguyễn Văn An', course: 'Khóa học Lập trình Web Frontend', result: 'Đạt', issueDate: '20/4/2024', note: 'Hoàn thành xuất sắc khóa học' },
  { id: 'CC002', student: 'Trần Thị Bình', course: 'Khóa học Lập trình Web Frontend', result: 'Không đạt', issueDate: '20/4/2024', note: 'Cần cải thiện kỹ năng JavaScript' },
];

const CertificationManagementPage: React.FC = () => {
  const [certificates, setCertificates] = useState(initialCertificates);
  
  // Tính toán số liệu thống kê cho Mini-Cards
  const totalCertificates = certificates.length;
  const passedCertificates = certificates.filter(c => c.result === 'Đạt').length;
  const failedCertificates = certificates.filter(c => c.result === 'Không đạt').length;
  const pendingCertificates = 0; // Giả định không có trạng thái "Chờ xử lý" trong mock data này

  const handleResultChange = (id: string, newResult: Certificate['result']) => {
    setCertificates(prev => 
      prev.map(cert => (cert.id === id ? { ...cert, result: newResult } : cert))
    );
    alert(`Cập nhật kết quả chứng chỉ ${id} thành: ${newResult} (Mock UI)`);
  };
  
  const handleIssueCertificate = () => {
    alert('Chức năng Cấp chứng chỉ mới đang được phát triển...');
  };
  
  const handleDownload = (id: string) => {
    alert(`Đã tải xuống chứng chỉ: ${id} (Mock UI)`);
  };

  return (
    <div className={styles.container}>
      
      {/* Tiêu đề trang */}
      <h1 className={styles.pageTitle}>Chứng chỉ</h1>
      
      {/* --- Mini Stat Cards --- */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard} data-type="total">
          <p className={styles.statLabel}>Tổng chứng chỉ</p>
          <div className={styles.statValue}>
            <span className={styles.icon}>📄</span>
            {totalCertificates}
          </div>
        </div>
        <div className={styles.statCard} data-type="passed">
          <p className={styles.statLabel}>Đạt</p>
          <div className={styles.statValue}>
            <span className={styles.icon}>🧑‍🎓</span>
            {passedCertificates}
          </div>
        </div>
        <div className={styles.statCard} data-type="failed">
          <p className={styles.statLabel}>Không đạt</p>
          <div className={styles.statValue}>
            <span className={styles.icon}>❗</span>
            {failedCertificates}
          </div>
        </div>
        <div className={styles.statCard} data-type="pending">
          <p className={styles.statLabel}>Chờ xử lý</p>
          <div className={styles.statValue}>
            <span className={styles.icon}>🕒</span>
            {pendingCertificates}
          </div>
        </div>
      </div>

      {/* --- Bảng Quản lý Chứng chỉ --- */}
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
            <h2 className={styles.sectionTitle}>Quản lý chứng chỉ</h2>
            {/* Nút Cấp chứng chỉ */}
            <button className={styles.issueButton} onClick={handleIssueCertificate}>
                + Cấp chứng chỉ
            </button>
        </div>
        
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>Mã chứng chỉ</th>
              <th>Học viên</th>
              <th>Khóa học</th>
              <th>Kết quả</th>
              <th>Ngày cấp</th>
              <th>Ghi chú</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((cert) => (
              <tr key={cert.id}>
                <td>{cert.id}</td>
                <td><span className={styles.studentIcon}>👤</span> {cert.student}</td>
                <td><span className={styles.courseIcon}>📚</span> {cert.course}</td>
                
                {/* Cột Kết quả (Dropdown) */}
                <td className={styles.resultCell}>
                    <span 
                        className={styles.resultBadge} 
                        data-result={cert.result === 'Đạt' ? 'passed' : 'failed'}
                    >
                        {cert.result}
                    </span>
                    <select 
                        value={cert.result} 
                        onChange={(e) => handleResultChange(cert.id, e.target.value as Certificate['result'])}
                        className={styles.resultSelect}
                    >
                        <option value="Đạt">Đạt</option>
                        <option value="Không đạt">Không đạt</option>
                    </select>
                </td>
                
                <td>📅 {cert.issueDate}</td>
                <td className={styles.noteCell}>{cert.note}</td>
                <td className={styles.actions}>
                  <span 
                    className={styles.actionIcon} 
                    onClick={() => handleDownload(cert.id)}
                  >
                    ⬇️
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default CertificationManagementPage;