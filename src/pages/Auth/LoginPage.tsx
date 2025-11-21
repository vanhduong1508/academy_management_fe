// src/pages/Auth/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/Auth/AuthCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
// Import type mới
import { LoginPageProps } from '../../types/Auth'; 


// Icon giả định
const UserIcon = () => <span style={{ marginRight: '8px' }}>👤</span>;
const LoginIcon = () => <span style={{ marginRight: '8px' }}>➡️</span>;
const mockLogin = async () => new Promise(resolve => setTimeout(resolve, 1000));


// SỬA: Nhận props setIsAuthenticated
const LoginPage: React.FC<LoginPageProps> = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await mockLogin();
      
      // FIX: CẬP NHẬT TRẠNG THÁI XÁC THỰC THÀNH TRUE
      setIsAuthenticated(true); 
      
      alert('Đăng nhập thành công (Mock UI)');
      navigate('/dashboard'); // Chuyển hướng sẽ hoạt động
      
    } catch (error) {
      alert('Đăng nhập thất bại (Mock UI)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Đăng nhập"
      subtitle="Hệ thống quản lý trung tâm dạy học"
      icon={<UserIcon />}
      footerLink={
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      }
    >
      {/* ... (Phần UI form giữ nguyên) ... */}
      <form onSubmit={handleSubmit}>
        <Input 
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="example@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        
        <Input
          label="Mật khẩu"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        
        <Button 
          type="submit" 
          variant="primary"
          icon={isLoading ? <span>🔄</span> : <LoginIcon />}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
      </form>
    </AuthCard>
  );
};

export default LoginPage;