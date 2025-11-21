// src/types/Button.ts

import React from 'react';

/**
 * Định nghĩa props cho Button Component
 * Kế thừa tất cả thuộc tính tiêu chuẩn của thẻ <button> HTML
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Biến thể (variant) của button, mặc định là 'primary' (màu đen)
  variant?: 'primary' | 'secondary' | 'danger'; 
  // Có thể truyền icon vào bên trái text
  icon?: React.ReactNode; 
}