// src/components/layout/MainLayout.tsx

import React from 'react';
import Sidebar from './Sidebar'; // Sẽ tạo sau
import Header from './Header';   // Sẽ tạo sau
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode; // Nội dung của trang hiện tại (Dashboard, Users, v.v.)
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={styles.container}>
      
      {/* 1. Sidebar */}
      <Sidebar />
      
      {/* Khối chứa Header và Nội dung chính */}
      <div className={styles.mainContentArea}>
        
        {/* 2. Header */}
        <Header />
        
        {/* 3. Nội dung chính của trang */}
        <main className={styles.pageContent}>
          {children}
        </main>
        
      </div>
      
    </div>
  );
};

export default MainLayout;