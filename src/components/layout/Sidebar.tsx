// src/components/layout/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom'; // Dùng NavLink để highlight mục đang active
import styles from './Sidebar.module.css';

// Định nghĩa cấu trúc menu
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
  { name: 'Quản lý người dùng', path: '/users', icon: '👥' },
  { name: 'Quản lý khóa học', path: '/courses', icon: '📚' },
  { name: 'Quản lý học viên', path: '/students', icon: '👨‍🎓' },
  { name: 'Cài đặt hệ thống', path: '/settings', icon: '⚙️' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <p>Academy **Admin**</p> 
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
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {/* Nút Đăng xuất ở dưới cùng */}
      <div className={styles.logoutSection}>
        <button onClick={() => console.log('Đang đăng xuất...')}>
          ➡️ Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;