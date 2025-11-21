// src/components/layout/Header.tsx

import React from 'react';
import { useLocation } from 'react-router-dom'; // Dùng để lấy đường dẫn hiện tại
import styles from './Header.module.css';

// Hàm đơn giản để chuyển path thành tiêu đề thân thiện
const getPageTitle = (pathname: string): string => {
  const parts = pathname.split('/').filter(p => p);
  if (parts.length === 0) return 'Dashboard';
  
  // Chuyển từ 'users' thành 'Quản lý người dùng'
  const lastPart = parts[parts.length - 1];
  switch(lastPart) {
    case 'dashboard': return 'Bảng Điều Khiển';
    case 'users': return 'Quản lý Người Dùng';
    case 'courses': return 'Quản lý Khóa Học';
    case 'students': return 'Quản lý Học Viên';
    case 'settings': return 'Cài Đặt Hệ Thống';
    default: return 'Trang Chi Tiết';
  }
};

const Header: React.FC = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  
  return (
    <header className={styles.header}>
      
      {/* Tên trang hiện tại */}
      <h1 className={styles.pageTitle}>{pageTitle}</h1>
      
      {/* Khu vực thông tin người dùng và thông báo */}
      <div className={styles.userSection}>
        <span className={styles.notificationIcon}>🔔</span>
        <span className={styles.username}>Xin chào, **Admin**</span>
        <div className={styles.avatar}>A</div>
      </div>
    </header>
  );
};

export default Header;