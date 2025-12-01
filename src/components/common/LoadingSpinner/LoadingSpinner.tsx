// /src/components/common/LoadingSpinner/LoadingSpinner.tsx
import React from 'react';
// import styles from './LoadingSpinner.module.css'; // Cần tạo file CSS Modules tương ứng

interface SpinnerProps {
    size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 'medium' }) => {
    // Trong CSS Modules, bạn sẽ định nghĩa animation và kích thước cho spinner.
    return (
        // <div className={`${styles.spinner} ${styles[size]}`}></div>
        <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: size === 'small' ? '16px' : size === 'medium' ? '24px' : '40px',
            height: size === 'small' ? '16px' : size === 'medium' ? '24px' : '40px',
            animation: 'spin 1s linear infinite', // Animation cần được định nghĩa trong CSS
        }}></div>
    );
};

export default LoadingSpinner;