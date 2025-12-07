import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout } from '../../redux/slices/auth.slice';
import Button from '../common/Button/Button';

const Header: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const role = useAppSelector((state) => state.auth.user?.role);


    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header style={{ padding: '10px 20px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #ccc' }}>
            <h2>LMS | {role?.toUpperCase()}</h2>
            <Button onClick={handleLogout} variant="danger">
                Đăng xuất
            </Button>
        </header>
    );
};

export default Header;