// src/components/layout/Header.tsx (Cập nhật)

import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      
      {/* Tiêu đề cố định của hệ thống (phía trái) */}
      <h1 className={styles.systemTitle}>Hệ thống quản lý trung tâm dạy học</h1>
    </header>
  );
};

export default Header;