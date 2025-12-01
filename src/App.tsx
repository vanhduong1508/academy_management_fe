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
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import NotFoundPage from './pages/public/NotFoundPage'; 

const App: React.FC = () => {
    return (
        // Router đã được bọc ở index.tsx
        <Routes>
            
            {/* 1. FIX: ROUTE GỐC (PATH="/") */}
            <Route path="/" element={<HomePage />} /> 
            
            {/* 2. CÁC PUBLIC ROUTE KHÁC */}
            <Route path="/login" element={<LoginPage />} />

            <Route path="/register" element={<RegisterPage />} />
            
            {/* 3. ADMIN ROUTES */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="/admin/users" element={<AdminUsersPage />} />           
                <Route index element={<DashboardPage />} />
                <Route path="courses" element={<CourseManagement />} />
                <Route path="courses/:id/content" element={<CourseContentManagementPage />} />
                <Route path="/admin/enrollments" element={<EnrollmentAdminPage />} />
                <Route path="/admin/orders/approval" element={<OrderApprovalPage />} /> 
            </Route>
         
            {/* 4. STUDENT ROUTES */}
            <Route path="/student" element={<MyEnrollmentsPage />} />
            <Route path="/student/courses" element={<CourseListPage />} />


            {/* 4. ROUTE FALLBACK */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default App;