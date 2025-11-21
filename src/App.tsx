// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Trang Auth (Không cần xác thực)
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Layout chính và các trang Protected (Cần xác thực)
import MainLayout from './components/layout/MainLayout';
// Giả định các trang nội dung
const DashboardPage = () => <h1>Nội dung chính của Dashboard</h1>; 
const UserManagementPage = () => <h1>Quản lý Người dùng</h1>;
const SettingsPage = () => <h1>Cài đặt hệ thống</h1>; 


const App: React.FC = () => {
  // Logic kiểm tra xem người dùng đã đăng nhập hay chưa (sẽ được tích hợp State Management sau)
  const isAuthenticated = false; // Mặc định là FALSE cho UI Shell

  return (
    <Router>
      <Routes>
        
        {/* ========================================================= */}
        {/* 1. Tuyến đường KHÔNG CẦN XÁC THỰC (Auth Routes) */}
        {/* ========================================================= */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Nếu người dùng chưa đăng nhập, chuyển hướng mặc định tới /login */}
        {/* Nếu người dùng đã đăng nhập, chuyển hướng mặc định tới /dashboard */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />


        {/* ========================================================= */}
        {/* 2. Tuyến đường CẦN XÁC THỰC (Protected Routes) */}
        {/* ========================================================= */}
        {/* Bọc tất cả các trang nội dung bằng MainLayout */}
        <Route 
          element={isAuthenticated ? <MainLayout><Outlet /></MainLayout> : <Navigate to="/login" replace />} 
        >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Thêm các tuyến đường Protected khác vào đây */}
        </Route>

        {/* ========================================================= */}
        {/* 3. Tuyến đường 404 */}
        {/* ========================================================= */}
        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
        
      </Routes>
    </Router>
  );
};

export default App;