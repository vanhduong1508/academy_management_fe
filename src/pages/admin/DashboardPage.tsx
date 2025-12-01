import React from 'react';

const DashboardPage: React.FC = () => {
    return (
        <div>
            <h1>📊 Bảng Điều Khiển Quản Trị</h1>
            <p>Chào mừng trở lại! Đây là nơi tổng hợp các thông tin và số liệu quan trọng của hệ thống.</p>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h3>Đơn hàng chờ duyệt</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>15</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h3>Tổng số Khóa học</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>42</p>
                </div>
                <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1 }}>
                    <h3>Người dùng mới hôm nay</h3>
                    <p style={{ fontSize: '2em', fontWeight: 'bold' }}>3</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;