import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'small' | 'medium';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: React.ReactNode;
    isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'medium', children, className, ...props }) => {
    
    // Ghép các class lại:
    const classNames = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classNames}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;