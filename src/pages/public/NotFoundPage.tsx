// /src/pages/public/NotFoundPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>❌ Lỗi 404: Không tìm thấy Trang</h1>
            <p>Đường dẫn bạn truy cập không tồn tại.</p>
            <Link to="/">Quay về Trang chủ</Link>
        </div>
    );
};

export default NotFoundPage;