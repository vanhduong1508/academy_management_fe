// src/pages/auth/RegisterPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../../api/auth.api';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormState({ ...formState, [e.target.id]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const payload = {
        fullName: formState.fullName,
        username: formState.username,
        password: formState.password,
        email: formState.email,
        phone: formState.phone
      };

      await registerStudent(payload);

      setSuccess('Đăng ký thành công! Đang chuyển đến trang đăng nhập…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: '420px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: 8
      }}
    >
      <h2>Đăng ký Tài khoản Học viên</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Họ và Tên"
          id="fullName"
          value={formState.fullName}
          onChange={handleChange}
          required
        />

        <Input
          label="Tên đăng nhập"
          id="username"
          value={formState.username}
          onChange={handleChange}
          required
          style={{ marginTop: 15 }}
        />

        <Input
          label="Email"
          id="email"
          type="email"
          value={formState.email}
          onChange={handleChange}
          required
          style={{ marginTop: 15 }}
        />

        <Input
          label="Số điện thoại"
          id="phone"
          value={formState.phone}
          onChange={handleChange}
          required
          style={{ marginTop: 15 }}
        />

        <Input
          label="Mật khẩu"
          id="password"
          type="password"
          value={formState.password}
          onChange={handleChange}
          required
          style={{ marginTop: 15 }}
        />

        {error && (
          <p style={{ color: 'red', marginTop: 10 }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: 'green', marginTop: 10 }}>
            {success}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          style={{ width: '100%', marginTop: 20 }}
        >
          Đăng ký
        </Button>
      </form>

      <p style={{ marginTop: 15, textAlign: 'center' }}>
        Đã có tài khoản? <a href="/login">Đăng nhập</a>
      </p>
    </div>
  );
};

export default RegisterPage;
