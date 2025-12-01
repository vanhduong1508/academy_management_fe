// src/pages/auth/LoginPage.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../redux/hooks';
import { setCredentials } from '../../redux/slices/auth.slice';
import { login } from '../../api/auth.api';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

// src/pages/auth/LoginPage.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const response = await login({ username, password });
    const backendUser = response.data; // { id, username, có thể chưa có role }

    console.log('Login response FE:', backendUser);

    // Lưu thẳng vào Redux theo kiểu cũ
    dispatch(setCredentials(backendUser));

    // Nếu BE chưa trả role -> mặc định student
    const roleLower = backendUser.role?.toLowerCase?.() ?? 'student';

    if (roleLower === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/student', { replace: true });
    }
  } catch (err: any) {
    console.log('Login error:', err);
    console.log('Login error response:', err?.response?.data);

    const errorMessage =
      err?.response?.data?.message ||
      'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '100px auto',
        padding: '20px',
        border: '1px solid #ccc',
      }}
    >
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit}>
        <Input
          label="Tên đăng nhập"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          label="Mật khẩu"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginTop: '15px' }}
        />

        {error && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          disabled={!username || !password}
          style={{ width: '100%', marginTop: '20px' }}
        >
          Đăng nhập
        </Button>
      </form>
      <p style={{ textAlign: 'center', marginTop: '15px' }}>
        Chưa có tài khoản? <a href="/register">Đăng ký ngay</a>
      </p>
    </div>
  );
};

export default LoginPage;
