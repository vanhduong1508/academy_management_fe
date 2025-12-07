
import React from 'react';

interface SpinnerProps {
    size?: 'small' | 'medium' | 'large';
}

const LoadingSpinner: React.FC<SpinnerProps> = ({ size = 'medium' }) => {
    return (
        <div style={{
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            width: size === 'small' ? '16px' : size === 'medium' ? '24px' : '40px',
            height: size === 'small' ? '16px' : size === 'medium' ? '24px' : '40px',
            animation: 'spin 1s linear infinite', 
        }}></div>
    );
};

export default LoadingSpinner;