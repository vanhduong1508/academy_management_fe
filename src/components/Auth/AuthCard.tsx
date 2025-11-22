import React from 'react';
import styles from './AuthCard.module.css';

interface AuthCardProps {
  title: string; // Tiêu đề lớn (Đăng nhập / Đăng ký tài khoản)
  subtitle: string; // Phụ đề nhỏ (Hệ thống quản lý trung tâm dạy học)
  children: React.ReactNode; // Nội dung form (Inputs, Buttons)
  footerLink: React.ReactNode; // Phần liên kết dưới cùng (Chưa có tài khoản? Đăng ký ngay)
  icon: React.ReactNode; // Icon đầu thẻ
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  title, 
  subtitle, 
  children, 
  footerLink, 
  icon 
}) => {
  return (
    <div className={styles.authContainer}> 
      {/* auth-card là khung trắng nổi lên */}
      <div className={styles.authCard}> 
        
        <div className={styles.header}>
          <div className={styles.iconContainer}>{icon}</div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
        
        <div className={styles.formContent}>
          {children} {/* Nơi chứa form Input và Button */}
        </div>
        
        <div className={styles.footer}>
          {footerLink} {/* Link chuyển hướng */}
        </div>

      </div>
    </div>
  );
};

export default AuthCard;