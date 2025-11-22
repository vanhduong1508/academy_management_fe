import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/Auth/DashboardPage';
import StudentManagementPage from './pages/Auth/StudentManagementPage'; 
import CourseManagementPage from './pages/Auth/CourseManagementPage'; 
import RegistrationManagementPage from './pages/Auth/RegistrationManagementPage'; 
import CertificationManagementPage from './pages/Auth/CertificationManagementPage'; 
import StatisticsPage from './pages/Auth/StatisticsPage'; 

const NotFoundPage: React.FC = () => (
    <div style={{ padding: '50px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '36px', color: '#1F2937' }}>404 - Không tìm thấy trang</h1>
        <p style={{ marginTop: '10px', color: '#6B7280' }}>Đường dẫn bạn truy cập không tồn tại. Vui lòng kiểm tra lại.</p>
        <Navigate to="/dashboard" replace />
    </div>
);

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    
    const handleLogin = (isSuccess: boolean) => {
        if (isSuccess) {
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />
                } />
                <Route path="/register" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
                } />
                <Route path="/" element={
                    isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                } />
                <Route 
                    element={isAuthenticated ? <MainLayout onLogout={handleLogout}><Outlet /></MainLayout> : <Navigate to="/login" replace />} 
                >
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="students" element={<StudentManagementPage />} />
                    <Route path="courses" element={<CourseManagementPage />} />
                    <Route path="register-management" element={<RegistrationManagementPage />} />
                    <Route path="certificates" element={<CertificationManagementPage />} /> 
                    <Route path="statistics" element={<StatisticsPage />} />
                  
                </Route>
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </Router>
    );
};

export default App;