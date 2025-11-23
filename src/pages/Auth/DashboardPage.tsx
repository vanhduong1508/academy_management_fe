// src/pages/Auth/DashboardPage.tsx

import React from 'react';
import StatsCard from '../../components/dashboard/StatsCard';
import SummaryWidget from '../../components/dashboard/SummaryWidget'; // Import mới
import RecentListWidget from '../../components/dashboard/RecentListWidget'; // Import mới
import styles from './DashboardPage.module.css'; 

// Dữ liệu giả định (để khớp với hình ảnh)
const statsData = [
  { title: 'Tổng Học Viên', value: 4, icon: '🎓', color: '#3B82F6' },
  { title: 'Khóa học đang diễn ra', value: 0, icon: '📘', color: '#10B981' },
  { title: 'Học viên đăng ký', value: 2, icon: '📝', color: '#F59E0B' },
  { title: 'Chứng chỉ đã cấp', value: 1, icon: '🏅', color: '#EF4444' },
];

const courseSummaryData = [
  { name: 'Tổng số khóa học', value: 3 },
  { name: 'Đang diễn ra', value: 0 },
  { name: 'Sắp diễn ra', value: 0 },
  { name: 'Đã kết thúc', value: 0 },
];

const certificateSummaryData = [
  { name: 'Tổng chứng chỉ', value: 2 },
  { name: 'Đạt', value: 0, color: '#10B981' },
  { name: 'Không đạt', value: 0, color: '#EF4444' },
  { name: 'Chờ xử lý', value: 2, color: '#F59E0B' },
];

const recentRegistrationData = [
  { id: 1, name: 'Phạm Thị Dung', description: 'Khóa học: Frontend Development', value: '25/11/2024', tag: { text: 'Đăng ký', color: '#1F2937' } },
  { id: 2, name: 'Lê Văn Cương', description: 'Khóa học: Backend Development', value: '25/11/2024', tag: { text: 'Đăng ký', color: '#1F2937' } },
  { id: 3, name: 'Trần Thị Bình', description: 'Khóa học: Lập trình Web Frontend', value: '12/11/2024', tag: { text: 'Hoàn thành', color: '#10B981' } },
  { id: 4, name: 'Nguyễn Văn An', description: 'Khóa học: Lập trình Web Frontend', value: '10/11/2024', tag: { text: 'Hoàn thành', color: '#10B981' } },
];

const topBranchData = [
  { id: 1, name: 'Hà Nội', description: 'Chi nhánh thương mại', value: '1 học viên', tag: { text: 'Top', color: '#F59E0B' } },
  { id: 2, name: 'Hải Phòng', description: 'Chi nhánh thương mại', value: '0 học viên', tag: { text: 'Top', color: '#F59E0B' } },
  { id: 3, name: 'Đà Nẵng', description: 'Chi nhánh thương mại', value: '0 học viên', tag: { text: 'Top', color: '#F59E0B' } },
  { id: 4, name: 'Hồ Chí Minh', description: 'Chi nhánh thương mại', value: '1 học viên', tag: { text: 'Top', color: '#F59E0B' } },
];

const DashboardPage: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <h1 className={styles.pageTitle}>Tổng quan</h1>
      
      {/* 1. Vùng Stats Cards */}
      <div className={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <StatsCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>
      
      <div className={styles.mainGrid}>
        {/* Cột trái (Gồm các Summary Widget và Đăng ký gần đây) */}
        <div className={styles.leftColumn}>
            {/* Hàng 1: Thống kê khóa học & Chứng chỉ */}
            <div className={styles.summaryGrid}>
                <SummaryWidget 
                    title="Thống kê về khóa học"
                    icon="📘"
                    data={courseSummaryData}
                />
                 <SummaryWidget 
                    title="Thống kê chứng chỉ"
                    icon="🏅"
                    data={certificateSummaryData}
                />
            </div>
            
            {/* Hàng 2: Đăng ký gần đây */}
            <div className={styles.recentList}>
                <RecentListWidget 
                    title="Đăng ký gần đây"
                    icon="📝"
                    data={recentRegistrationData}
                />
            </div>

            {/* Hàng 3: Chứng chỉ được cấp gần đây */}
            <div className={styles.recentList}>
                 <RecentListWidget 
                    title="Chứng chỉ được cấp gần đây"
                    icon="🏅"
                    // Cần tạo dữ liệu giả cho phần này
                    data={[{ id: 1, name: 'Nguyễn Văn An', description: 'Lập trình Web Frontend', value: '10/11/2024', tag: { text: 'Đã cấp', color: '#10B981' } }]}
                />
            </div>

        </div>

        {/* Cột phải (Gồm Top chi nhánh) */}
        <div className={styles.rightColumn}>
             <RecentListWidget 
                title="Top chi nhánh thương mại"
                icon="📍"
                data={topBranchData}
            />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;