// src/App.tsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';

// --- AUTH COMPONENTS (Public Routes) ---
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// --- LAYOUT COMPONENTS ---
import MainLayout from './components/layout/MainLayout';

// --- PROTECTED COMPONENTS (Auth Routes) ---
// 1. Tổng quan
import DashboardPage from './pages/Auth/DashboardPage';

// 2. Học viên
import StudentManagementPage from './pages/Auth/StudentManagementPage'; 

// 3. Khóa học
import CourseManagementPage from './pages/Auth/CourseManagementPage'; 

// 4. Đăng ký
import RegistrationManagementPage from './pages/Auth/RegistrationManagementPage'; 

// 5. Chứng chỉ
import CertificationManagementPage from './pages/Auth/CertificationManagementPage'; 

// 6. Thống kê
import StatisticsPage from './pages/Auth/StatisticsPage'; 

// --- 404 Component ---
const NotFoundPage: React.FC = () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#1F2937' }}>404 - Không tìm thấy trang</h1>
        <p style={{ marginTop: '10px', color: '#6B7280' }}>Đường dẫn bạn truy cập không tồn tại. Vui lòng kiểm tra lại.</p>
        <Navigate to="/dashboard" replace />
    </div>
);


const App: React.FC = () => {
    // State giả định cho trạng thái xác thực (Authentication State)
    const [isAuthenticated, setIsAuthenticated] = useState(true); // Đặt mặc định là TRUE để dễ dàng phát triển UI
    
    // Logic Mock: Đăng nhập thành công
    const handleLogin = (isSuccess: boolean) => {
        if (isSuccess) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    // Logic Mock: Đăng xuất
    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                
                {/* 1. Tuyến đường KHÔNG CẦN XÁC THỰC (Public Routes) */}
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
                } />
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
                } />
                
                {/* Redirect từ root '/' đến '/dashboard' nếu đã đăng nhập, hoặc '/login' nếu chưa */}
                <Route path="/" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />
                
                {/* 2. Tuyến đường CẦN XÁC THỰC (Protected Routes) */}
                <Route 
                    element={isAuthenticated ? <MainLayout onLogout={handleLogout}><Outlet /></MainLayout> : <Navigate to="/login" replace />} 
                >
                    {/* Các tuyến đường con sẽ hiển thị trong MainLayout */}
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="students" element={<StudentManagementPage />} />
                    <Route path="courses" element={<CourseManagementPage />} />
                    
                    {/* Các path mới theo Sidebar */}
                    <Route path="register-management" element={<RegistrationManagementPage />} />
                    <Route path="certificates" element={<CertificationManagementPage />} /> 
                    <Route path="statistics" element={<StatisticsPage />} />
                    
                    {/* <Route path="users" element={<UserManagementPage />} /> */}
                </Route>

                {/* 3. 404 Route */}
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </Router>
    );
};

export default App;