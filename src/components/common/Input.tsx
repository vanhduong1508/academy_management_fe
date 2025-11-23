// src/components/common/Input.tsx

import React from 'react';
// Nhập định nghĩa kiểu đã tạo
import { InputProps } from '../../types/Input'; 
// Nhập CSS Modules
import styles from '../../styles/Input.module.css';

const Input: React.FC<InputProps> = ({ label, ...props }) => {
  return (
    <div className={styles.inputGroup}>
      <label 
        className={styles.label} 
        htmlFor={props.id || props.name} // Thiết lập htmlFor liên kết với input
      >
        {label}
      </label>
      <input
        className={styles.inputField}
        // Truyền tất cả các props còn lại (type, placeholder, onchange, v.v.)
        {...props} 
      />
    </div>
  );
};

export default Input;