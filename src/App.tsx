// src/App.tsx

import React, { useState } from 'react'; // <-- Import useState
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  Outlet 
} from 'react-router-dom';

// Trang Auth (Không cần xác thực)
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';

// Layout chính và các trang Protected (Cần xác thực)
import MainLayout from './components/layout/MainLayout';
// Import các trang nội dung
import DashboardPage from './pages/Auth/DashboardPage'; // <-- Đảm bảo đúng đường dẫn
const UserManagementPage = () => <h1>Quản lý Người dùng</h1>;
const CourseManagementPage = () => <h1>Quản lý Khóa học</h1>;
const StudentManagementPage = () => <h1>Quản lý Học viên</h1>;
const SettingsPage = () => <h1>Cài đặt hệ thống</h1>; 


const App: React.FC = () => {
  // 1. Quản lý trạng thái xác thực (Mặc định là FALSE khi chưa đăng nhập)
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  // Hàm mock cho việc Đăng xuất
  const handleLogout = () => {
      setIsAuthenticated(false);
      // Có thể thêm navigate('/') ở đây nếu cần
      console.log('Đã đăng xuất (Mock UI)');
  };


  return (
    <Router>
      <Routes>
        
        {/* ========================================================= */}
        {/* 1. Tuyến đường KHÔNG CẦN XÁC THỰC (Auth Routes) */}
        {/* ========================================================= */}
        <Route 
          path="/login" 
          // Truyền hàm cập nhật trạng thái
          element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} 
        />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Chuyển hướng mặc định: nếu đăng nhập rồi thì vào Dashboard, chưa thì vào Login */}
        <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />


        {/* ========================================================= */}
        {/* 2. Tuyến đường CẦN XÁC THỰC (Protected Routes) */}
        {/* ========================================================= */}
        <Route 
          // Nếu chưa xác thực, chuyển hướng về /login
          element={isAuthenticated ? <MainLayout onLogout={handleLogout}><Outlet /></MainLayout> : <Navigate to="/login" replace />} 
        >
            {/* Các tuyến đường con sẽ hiển thị trong MainLayout */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="students" element={<StudentManagementPage />} />
            <Route path="courses" element={<CourseManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="settings" element={<SettingsPage />} />
            
            {/* Thêm các trang tương ứng với Sidebar khác vào đây */}
        </Route>

        {/* 3. Tuyến đường 404 */}
        <Route path="*" element={<h1>404 - Không tìm thấy trang</h1>} />
        
      </Routes>
    </Router>
  );
};

export default App;