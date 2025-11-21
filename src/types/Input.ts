// src/types/Input.ts

import React from 'react';

/**
 * Định nghĩa props cho Input Component
 * Kế thừa tất cả thuộc tính tiêu chuẩn của thẻ <input> HTML
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Bắt buộc phải có label
  label: string; 
}