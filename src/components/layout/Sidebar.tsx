import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onLogout: () => void;
}

const ICON_BASE_PATH = '/images/';

// Components Icon sử dụng ảnh
const DashboardIcon = () => <img src={`${ICON_BASE_PATH}dashboard.png`} alt="Dashboard Icon" className={styles.navIcon} />;
const StudentIcon = () => <img src={`${ICON_BASE_PATH}people.png`} alt="Student Icon" className={styles.navIcon} />;
const CourseIcon = () => <img src={`${ICON_BASE_PATH}book.png`} alt="Course Icon" className={styles.navIcon} />;
const RegistrationIcon = () => <img src={`${ICON_BASE_PATH}mortarboard.png`} alt="Registration Icon" className={styles.navIcon} />;
const CertIcon = () => <img src={`${ICON_BASE_PATH}award.png`} alt="Certificate Icon" className={styles.navIcon} />;
const StatsIcon = () => <img src={`${ICON_BASE_PATH}bar-chart.png`} alt="Statistics Icon" className={styles.navIcon} />;

// Cấu trúc menu sử dụng components Icon
const navItems = [
    { name: 'Tổng quan', path: '/dashboard', icon: <DashboardIcon /> },
    { name: 'Học viên', path: '/students', icon: <StudentIcon /> },
    { name: 'Khóa học', path: '/courses', icon: <CourseIcon /> },
    { name: 'Đăng ký', path: '/register-management', icon: <RegistrationIcon /> },
    { name: 'Chứng chỉ', path: '/certificates', icon: <CertIcon /> }, 
    { name: 'Thống kê', path: '/statistics', icon: <StatsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
    const LogoSVG = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          
            <path d="M4 19.5V14a2 2 0 0 1 2-2h4M12 12V2.5l5 2.5v7l-5 2.5zM12 21.5l5-2.5v-7l-5-2.5zM7 16l-3.5 1.75M16 16l3.5 1.75M12 7.5v9"/>
        </svg>
    );

    const UserAvatarSVG = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
    );

    const LogoutSVG = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>
        </svg>
    );

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <span className={styles.logoIcon}>
                    <LogoSVG />
                </span>
                Quản lý dạy học
            </div>
            
            {/* NAVIGATION SECTION */}
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
            
            {/* BOTTOM SECTION - USER PROFILE & LOGOUT */}
            <div className={styles.bottomContainer}>
                {/* 1. User Profile (Dương Việt Anh) */}
                <div className={styles.userProfile}>
                    <span className={styles.userAvatar}>
                        <UserAvatarSVG />
                    </span>
                    Dương Việt Anh
                </div>

                {/* 2. Logout Button */}
                <div 
                    className={styles.logoutButton}
                    onClick={onLogout}
                >
                    <span className={styles.logoutIcon}>
                        <LogoutSVG />
                    </span>
                    Đăng xuất
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;