import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các Layout và Pages cần thiết
import AdminLayout from '../../components/layout/AdminLayout'; 
import OrderApproval from './OrderApproval';
// Giả định bạn có component DashboardPage
import DashboardPage from './DashboardPage'; 
import CourseManagement from './CourseManagement';
import CourseContentManagementPage from './CourseContentManagementPage';


const AdminRoutes: React.FC = () => {
    return (
        <Routes>
            {/* FIX: Route cha định nghĩa AdminLayout. 
                      Các Route con sẽ được render bên trong Outlet của AdminLayout. */}
            <Route path="/" element={<AdminLayout />}>
                
                {/* 1. Trang Dashboard (Route Index: /admin) */}
                <Route index element={<DashboardPage />} /> 

                {/* 2. Quản lý Đơn hàng (/admin/orders/pending) */}
                <Route path="orders/pending" element={<OrderApproval />} />
                
                {/* 3. Quản lý Khóa học (/admin/courses) */}
                <Route path="courses" element={<CourseManagement />} />
                <Route 
                    path="courses/:courseId/content" 
                    element={<CourseContentManagementPage />} 
                />
                
                {/* Thêm các Route Admin khác (users, v.v.) vào đây */}
                <Route path="users" element={<h2>Quản lý Người dùng</h2>} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;