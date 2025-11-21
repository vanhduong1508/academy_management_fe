// src/pages/Auth/LoginPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Dùng Link để chuyển hướng mà không tải lại trang

// Import các component đã tạo
import AuthCard from './AuthCard';
import Input from '../common/Input';
import Button from '../common/Button';

// Icon giả định (có thể dùng thư viện icon thực tế như react-icons)
const UserIcon = () => <span style={{ marginRight: '8px' }}>👤</span>;
const LockIcon = () => <span style={{ marginRight: '8px' }}>🔒</span>;
const LoginIcon = () => <span style={{ marginRight: '8px' }}>➡️</span>;


const LoginPage: React.FC = () => {
  // 1. Quản lý trạng thái form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. Xử lý logic đăng nhập
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic gọi API đăng nhập sẽ nằm ở đây (sẽ được tách ra sau)
    
    console.log('Đang thực hiện Đăng nhập...');
    console.log('Email:', email);
    console.log('Password:', password);

    // *Sau khi đăng nhập thành công, sẽ chuyển hướng tới /dashboard*
    // Ví dụ: navigate('/dashboard');
  };

  return (
    <AuthCard
      title="Đăng nhập"
      subtitle="Hệ thống quản lý trung tâm dạy học"
      icon={<UserIcon />} // Icon người dùng
      footerLink={
        <p>
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      }
    >
      {/* 3. Form được đặt trong thẻ form HTML để xử lý submit */}
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
        />
        
        {/* Nút Đăng nhập */}
        <Button 
          type="submit" 
          variant="primary"
          icon={<LoginIcon />}
        >
          Đăng nhập
        </Button>
      </form>
    </AuthCard>
  );
};

export default LoginPage;