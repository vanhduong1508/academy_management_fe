// /src/pages/public/HomePage.tsx

import React from 'react';

const HomePage: React.FC = () => {
    return (
        <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>📚 Chào mừng đến với Hệ thống Quản lý Học viện</h1>
            <p>Trang chủ công cộng của ứng dụng. Vui lòng <a href="/login">Đăng nhập</a> để truy cập khóa học hoặc khu vực Admin.</p>
        </div>
    );
};

export default HomePage;