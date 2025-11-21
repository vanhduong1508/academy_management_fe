// src/pages/Auth/LoginPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import AuthCard from '../../components/Auth/AuthCard';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// Icon giả định
const UserIcon = () => <span style={{ marginRight: '8px' }}>👤</span>;
const LoginIcon = () => <span style={{ marginRight: '8px' }}>➡️</span>;


// Hàm giả lập (Mock) đăng nhập: chỉ đơn giản là đợi 1 giây
const mockLogin = async () => {
  return new Promise(resolve => setTimeout(resolve, 1000));
};


const LoginPage: React.FC = () => {
  const navigate = useNavigate(); // Hook để chuyển hướng
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bắt đầu tải
    setIsLoading(true);

    try {
      // Gọi hàm giả lập
      await mockLogin();
      
      // Giả lập đăng nhập thành công: Chuyển hướng đến Dashboard
      alert('Đăng nhập thành công (Mock UI)');
      navigate('/dashboard'); 
      
    } catch (error) {
      // Xử lý lỗi giả lập
      alert('Đăng nhập thất bại (Mock UI)');
    } finally {
      // Kết thúc tải
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
          disabled={isLoading} // Vô hiệu hóa khi đang tải
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
          icon={isLoading ? <span>🔄</span> : <LoginIcon />} // Thay icon khi đang tải
          disabled={isLoading}
        >
          {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
        </Button>
      </form>
    </AuthCard>
  );
};

export default LoginPage;