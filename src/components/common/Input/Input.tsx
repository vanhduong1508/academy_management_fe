// /src/components/common/Input/Input.tsx

import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, id, ...props }) => {
    return (
        <div className={styles.inputGroup}>
            {/* 1. Nhãn (Label) */}
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            
            {/* 2. Trường Input */}
            <input 
                id={id}
                className={`${styles.input} ${error ? styles.error : ''}`} 
                {...props}
            />
            
            {/* 3. Hiển thị thông báo Lỗi */}
            {error && <p className={styles.errorMessage}>{error}</p>}
        </div>
    );
};

export default Input;