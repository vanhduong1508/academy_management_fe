// src/components/layout/MainLayout.tsx

import React from 'react';
import Sidebar from './Sidebar'; 
import Header from './Header';   
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  children: React.ReactNode; 
  onLogout: () => void; // Thêm prop onLogout
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
  return (
    <div className={styles.container}>
      
      {/* Sidebar - TRUYỀN PROP onLogout */}
      <Sidebar onLogout={onLogout} />
      
      <div className={styles.mainContentArea}>
        
        {/* Header (Header lớn màu tím) */}
        <Header />
        
        {/* Nội dung chính của trang */}
        <main className={styles.pageContent}>
          {children}
        </main>
        
      </div>
      
    </div>
  );
};

export default MainLayout;