// src/components/common/Button.tsx

import React from 'react';
import { ButtonProps } from '../../types/Button';
import styles from './Button.module.css';

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', // Mặc định là 'primary' (nút màu đen)
  icon,
  ...props 
}) => {
  
  // Xử lý các class CSS dựa trên variant (primary, secondary...)
  const buttonClass = `${styles.button} ${styles[variant]}`;

  return (
    <button
      className={buttonClass}
      {...props}
    >
      {/* Hiển thị Icon nếu có */}
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;