// src/components/layout/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onLogout: () => void; // Thêm prop onLogout
}

// Cấu trúc menu
const navItems = [
  { name: 'Tổng quan', path: '/dashboard', icon: '🏠' },
  { name: 'Học viên', path: '/students', icon: '🧑‍🎓' },
  { name: 'Khóa học', path: '/courses', icon: '📚' },
  { name: 'Đăng ký', path: '/register-management', icon: '📝' },
  { name: 'Thống kê', path: '/statistics', icon: '📊' },
];

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <p>Hệ thống quản lý</p> 
      </div>
      
      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                end={item.path === '/dashboard'}
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* Nút Đăng xuất và Cài đặt (góc dưới cùng) */}
      <div className={styles.bottomMenu}>
        <div className={styles.menuItem}>
          <span className={styles.icon}>⚙️</span> Cài đặt
        </div>
        <div 
          className={`${styles.menuItem} ${styles.logout}`}
          onClick={onLogout} // GỌI HÀM onLogout KHI CLICK
        >
          <span className={styles.icon}>⬅️</span> Đăng xuất
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;