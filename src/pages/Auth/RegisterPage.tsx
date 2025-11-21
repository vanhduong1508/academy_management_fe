// src/pages/Auth/RegisterPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/Auth/AuthCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Icon giả định
const RegisterIcon = () => <span style={{ marginRight: '8px' }}>📝</span>;
const SubmitIcon = () => <span style={{ marginRight: '8px' }}>✅</span>;


// Hàm giả lập (Mock) đăng ký
const mockRegister = async () => {
  return new Promise(resolve => setTimeout(resolve, 1500));
};


const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Mật khẩu và Xác nhận mật khẩu không khớp.');
      return;
    }

    setIsLoading(true);

    try {
      await mockRegister();
      
      // Giả lập đăng ký thành công: Chuyển hướng đến trang Đăng nhập
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
      
    } catch (error) {
      alert('Đăng ký thất bại (Mock UI)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Đăng ký tài khoản"
      subtitle="Tạo tài khoản để quản lý trung tâm dạy học"
      icon={<RegisterIcon />}
      footerLink={
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit}>
        
        <Input 
          label="Họ và tên"
          id="name"
          name="name"
          type="text"
          placeholder="Nguyễn Văn A"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
        />
        
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
        
        <Input
          label="Xác nhận mật khẩu"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isLoading}
        />
        
        {error && (
          <p style={{ color: 'red', fontSize: '14px', marginTop: '-10px', marginBottom: '10px' }}>
            {error}
          </p>
        )}
        
        <Button 
          type="submit" 
          variant="primary"
          icon={isLoading ? <span>🔄</span> : <SubmitIcon />}
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
        </Button>
      </form>
    </AuthCard>
  );
};

export default RegisterPage;