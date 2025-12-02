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
            <Route path="/" element={<AdminLayout />}>
                <Route index element={<DashboardPage />} /> 
                <Route path="orders/pending" element={<OrderApproval />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="courses/:courseId/content" element={<CourseContentManagementPage />} />
                <Route path="users" element={<h2>Quản lý Người dùng</h2>} />
            </Route>
        </Routes>
    );
};

export default AdminRoutes;