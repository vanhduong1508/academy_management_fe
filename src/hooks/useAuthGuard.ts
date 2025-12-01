// src/hooks/useAuthGuard.ts

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../redux/hooks';
import { UserRole } from '../types';

const useAuthGuard = (requiredRole?: UserRole) => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAppSelector(state => state.auth);

    useEffect(() => {
        // Chưa đăng nhập → đá về /login
        if (!isAuthenticated || !user) {
            navigate('/login', { replace: true });
            return;
        }

        // Có yêu cầu role mà user không khớp → chuyển về đúng khu
        if (requiredRole && user.role !== requiredRole) {
            const redirectPath = user.role === 'admin' ? '/admin' : '/student';
            console.error('Access Denied: Incorrect Role.');
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, user, requiredRole, navigate]);

    // Hook trả về true nếu đang login & đúng role (nếu có yêu cầu)
    return isAuthenticated && !!user && (!requiredRole || user.role === requiredRole);
};

export default useAuthGuard;
