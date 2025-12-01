// src/App.tsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import các component layout và page
import AdminLayout from './components/layout/AdminLayout'; 
import DashboardPage from './pages/admin/DashboardPage';
import OrderApprovalPage from './pages/admin/OrderApproval';
import MyEnrollmentsPage from './pages/student/MyEnrollmentsPage';
import CourseListPage from './pages/student/CourseListPage';
import CourseManagement from './pages/admin/CourseManagement';
import CourseContentManagementPage from './pages/admin/CourseContentManagementPage';
import EnrollmentAdminPage from './pages/admin/EnrollmentAdminPage';
import ProfilePage from './pages/account/ProfilePage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import HomePage from './pages/public/HomePage'; 
import NotFoundPage from './pages/public/NotFoundPage'; 

// 1. IMPORT COMPONENT AUTHPAGE MỚI
import AuthPage from './pages/Auth/AuthPage';

const App: React.FC = () => {
    return (
        // Router đã được bọc ở index.tsx
        <Routes>
            
            {/* 1. ROUTE GỐC (PATH="/") */}
            <Route path="/" element={<HomePage />} /> 
            
            {/* 2. CÁC PUBLIC ROUTE KHÁC (AUTH) */}
            {/* Cả /login và /register đều trỏ về AuthPage vì giờ nó là 1 trang gộp */}
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            
            {/* 3. ADMIN ROUTES */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="users" element={<AdminUsersPage />} />           
                <Route index element={<DashboardPage />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="courses/:id/content" element={<CourseContentManagementPage />} />
                <Route path="enrollments" element={<EnrollmentAdminPage />} />
                <Route path="orders/approval" element={<OrderApprovalPage />} /> 
            </Route>
         
            {/* 4. STUDENT ROUTES */}
            <Route path="/student" element={<MyEnrollmentsPage />} />
            <Route path="/student/courses" element={<CourseListPage />} />

            {/* 5. ROUTE FALLBACK */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default App;