import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Đã sửa: Sử dụng đường dẫn tương đối trong cùng thư mục (./)
import styles from '../../styles/LoginPage.module.css'; 

interface LoginPageProps {
    onLogin: (isSuccess: boolean) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!email || !password) {
            setError('Vui lòng điền đầy đủ Email và Mật khẩu.');
            return;
        }

        setIsLoading(true);
        setError('');

        // --- MOCK LOGIN LOGIC ---
        setTimeout(() => {
            setIsLoading(false);
            
            if (email === 'admin@example.com' && password === '123456') {
                onLogin(true);
            } else {
                setError('Email hoặc Mật khẩu không đúng.');
                onLogin(false);
            }
        }, 1500);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.cardHeader}>
                    <span className={styles.icon}>
                        <i className="fas fa-user-lock"></i>
                    </span>
                    <h2 className={styles.title}>Đăng nhập</h2>
                    <p className={styles.subtitle}>Hệ thống quản lý trung tâm dạy học</p>
                </div>
                
                <form className={styles.form} onSubmit={handleLoginSubmit}>
                    
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    
                    <label className={styles.label}>Email</label>
                    <input
                        type="email"
                        placeholder="example@email.com"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <label className={styles.label}>Mật Khẩu</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <button type="submit" className={styles.submitButton} disabled={isLoading}>
                        {isLoading ? (
                            <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                            <><i className="fas fa-sign-in-alt"></i> Đăng nhập</>
                        )}
                    </button>
                    
                    <p className={styles.registerLink}>
                        Chưa có tài khoản? <Link to="/register" className={styles.link}>Đăng ký ngay</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;