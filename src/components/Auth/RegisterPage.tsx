// src/pages/Auth/RegisterPage.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Import các component đã tạo
import AuthCard from '../../components/Auth/AuthCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Icon giả định
const RegisterIcon = () => <span style={{ marginRight: '8px' }}>📝</span>;
const SubmitIcon = () => <span style={{ marginRight: '8px' }}>✅</span>;


const RegisterPage: React.FC = () => {
  // 1. Quản lý trạng thái form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // 2. Xử lý logic đăng ký
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Kiểm tra validation cơ bản
    if (password !== confirmPassword) {
      setError('Mật khẩu và Xác nhận mật khẩu không khớp.');
      return;
    }
    
    // Logic gọi API đăng ký sẽ nằm ở đây
    console.log('Đang thực hiện Đăng ký...');
    console.log({ name, email, password });

    // *Sau khi đăng ký thành công, thường sẽ chuyển hướng tới /login*
    // Ví dụ: navigate('/login');
  };

  return (
    <AuthCard
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản để quản lý trung tâm dạy học"
      icon={<RegisterIcon />} // Icon đăng ký
      footerLink={
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      }
    >
      {/* 3. Form được đặt trong thẻ form HTML */}
      <form onSubmit={handleSubmit}>
        
        {/* Trường Họ và tên */}
        <Input 
          label="Họ và tên"
          id="name"
          name="name"
          type="text"
          placeholder="Nguyễn Văn A"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        
        {/* Trường Email */}
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
        
        {/* Trường Mật khẩu */}
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
        
        {/* Trường Xác nhận mật khẩu */}
        <Input
          label="Xác nhận mật khẩu"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        
        {/* Hiển thị lỗi (nếu có) */}
        {error && (
          <p style={{ color: 'red', fontSize: '14px', marginTop: '-10px', marginBottom: '10px' }}>
            {error}
          </p>
        )}
        
        {/* Nút Đăng ký */}
        <Button 
          type="submit" 
          variant="primary"
          icon={<SubmitIcon />}
        >
          Đăng ký
        </Button>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;