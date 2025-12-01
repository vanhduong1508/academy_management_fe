// /src/components/layout/Sidebar.tsx

import React from 'react';
import { NavLink } from 'react-router-dom';
import { UserRole } from '../../types';
// import styles from './Sidebar.module.css'; // Cần tạo file CSS Modules tương ứng

interface SidebarProps {
    role: UserRole;
}

// Định nghĩa cấu trúc Menu cho Admin
const adminMenuItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Quản lý Khóa học', path: '/admin/courses' },
    { name: 'Duyệt Đơn hàng', path: '/admin/orders/pending' },
    { name: 'Quản lý Người dùng', path: '/admin/users' },
    { name: 'Cấp Chứng chỉ', path: '/admin/certificates/eligible' },
];

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
    // Hiện tại chỉ tập trung vào Admin, có thể mở rộng cho Student sau
    const menuItems = role === 'admin' ? adminMenuItems : [];

    return (
        // Sử dụng style inline tạm thời hoặc CSS Module
        <div style={{ 
            width: '240px', 
            backgroundColor: '#343a40', 
            color: 'white', 
            padding: '20px 0', 
            flexShrink: 0
        }}>
            <h3 style={{ padding: '0 20px', marginBottom: '30px' }}>Admin Menu</h3>
            
            <nav>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            {/* Sử dụng NavLink để highlight link đang active */}
                            <NavLink
                                to={item.path}
                                // Sử dụng hàm style để highlight link active
                                style={({ isActive }) => ({
                                    display: 'block',
                                    padding: '10px 20px',
                                    textDecoration: 'none',
                                    color: 'white',
                                    backgroundColor: isActive ? '#007bff' : 'transparent',
                                    fontWeight: isActive ? 'bold' : 'normal',
                                })}
                                end={item.path === '/admin'} // Đảm bảo chỉ highlight Dashboard khi ở chính xác path đó
                            >
                                {item.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;