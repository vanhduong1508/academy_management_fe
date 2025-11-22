// src/pages/Auth/StatisticsPage.tsx

import React, { useState } from 'react';
import styles from './StatisticsPage.module.css';

// --- MOCK DATA DÙNG CHUNG ---
const MOCK_DATA = {
    totalStudents: 4,
    totalCourses: 3,
    completionRate: '50.0%', // Tỷ lệ hoàn thành
    passRate: '50.0%',       // Tỷ lệ đạt
    
    // Tab 1: Thống kê theo tỉnh
    provinceStats: [
        { province: 'Hà Nội', count: 1, ratio: '25.0%' },
        { province: 'Hải Phòng', count: 1, ratio: '25.0%' },
        { province: 'Đà Nẵng', count: 1, ratio: '25.0%' },
        { province: 'Hồ Chí Minh', count: 1, ratio: '25.0%' },
    ],
    
    // Tab 3: Chi tiết khóa học
    courseDetails: [
        { id: 'KH001', name: 'Khóa học Lập trình Web Frontend', startDate: '15/1/2024', students: 2, completed: 2, passed: 1, failed: 1, passRatio: '50.0%' },
        { id: 'KH002', name: 'Khóa học Backend Development', startDate: '1/3/2024', students: 2, completed: 0, passed: 0, failed: 0, passRatio: '0%' },
        { id: 'KH003', name: 'Khóa học Data Science', startDate: '1/1/2025', students: 0, completed: 0, passed: 0, failed: 0, passRatio: '0%' },
    ],
    
    // Tab 4: Lịch sử học viên
    studentHistory: [
        { id: 'HV001', name: 'Nguyễn Văn An', courses: [{ course: 'Lập trình Web Frontend', date: '10/1/2024', period: '15/1 - 15/4/2024', status: 'Hoàn thành', result: 'Đạt' }] },
        { id: 'HV002', name: 'Trần Thị Bình', courses: [{ course: 'Lập trình Web Frontend', date: '12/1/2024', period: '15/1 - 15/4/2024', status: 'Hoàn thành', result: 'Không đạt' }] },
        { id: 'HV003', name: 'Lê Văn Cường', courses: [{ course: 'Backend Development', date: '25/2/2024', period: '1/3 - 1/9/2024', status: 'Đang học', result: 'Chưa có kết quả' }] },
        { id: 'HV004', name: 'Phạm Thị Dung', courses: [{ course: 'Backend Development', date: '28/2/2024', period: '1/3 - 1/9/2024', status: 'Đang học', result: 'Chưa có kết quả' }] },
    ]
};

// --- MOCK UI COMPONENTS CHO CÁC TAB ---

const TabProvinceStats: React.FC = () => (
    <>
        <h3 className={styles.chartTitle}>Thống kê học viên theo tỉnh thường trú</h3>
        <div className={styles.provinceStatsContainer}>
            {/* Vùng biểu đồ cột giả định */}
            <div className={styles.barChartMock}>
                {MOCK_DATA.provinceStats.map((item, index) => (
                    <div key={index} className={styles.barItem} style={{ height: '80%' }}>
                        <div className={styles.bar}></div>
                        <span className={styles.barLabel}>{item.province.split(' ')[0]}</span>
                    </div>
                ))}
            </div>
            {/* Bảng dữ liệu */}
            <table className={styles.statsTable}>
                <thead>
                    <tr>
                        <th>Tỉnh thường trú</th>
                        <th>Số học viên</th>
                        <th>Tỷ lệ</th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_DATA.provinceStats.map((item, index) => (
                        <tr key={index}>
                            <td>{item.province}</td>
                            <td>{item.count}</td>
                            <td>{item.ratio}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
);

const TabYearStats: React.FC = () => (
    <>
        <div className={styles.yearStatsHeader}>
            <h3 className={styles.chartTitle}>Thống kê tình hình mở khóa học theo năm</h3>
            <select className={styles.yearSelect} defaultValue="2025">
                <option value="2024">2024</option>
                <option value="2025">2025</option>
            </select>
        </div>
        <div className={styles.miniStatsGrid}>
            <div className={styles.miniStatCard}>Số khóa học: <span>1</span></div>
            <div className={styles.miniStatCard}>Tổng học viên: <span>0</span></div>
            <div className={styles.miniStatCard} data-color="green">Số đạt: <span>0</span></div>
            <div className={styles.miniStatCard} data-color="red">Số không đạt: <span>0</span></div>
        </div>
        {/* Vùng biểu đồ đường giả định */}
        <div className={styles.lineChartMock}>
            {/* Vẽ đường giả định */}
            <svg viewBox="0 0 100 60" className={styles.lineSvg}>
                <polyline fill="none" stroke="#2563EB" strokeWidth="0.5" points="0,40 25,35 50,30 75,20 100,10" />
                <polyline fill="none" stroke="#10B981" strokeWidth="0.5" points="0,50 25,45 50,40 75,30 100,25" />
                <polyline fill="none" stroke="#F59E0B" strokeWidth="0.5" points="0,60 25,55 50,50 75,40 100,35" />
            </svg>
        </div>
    </>
);

const TabCourseDetails: React.FC = () => (
    <>
        <h3 className={styles.chartTitle}>Chi tiết thống kê khóa học</h3>
        <table className={styles.dataTable}>
            <thead>
                <tr>
                    <th>Mã khóa</th>
                    <th>Tên khóa học</th>
                    <th>Ngày bắt đầu</th>
                    <th>Số học viên</th>
                    <th>Đã hoàn thành</th>
                    <th>Đạt</th>
                    <th>Không đạt</th>
                    <th>Tỷ lệ đạt</th>
                </tr>
            </thead>
            <tbody>
                {MOCK_DATA.courseDetails.map((course) => (
                    <tr key={course.id}>
                        <td>{course.id}</td>
                        <td>{course.name}</td>
                        <td>{course.startDate}</td>
                        <td>{course.students}</td>
                        <td>{course.completed}</td>
                        <td data-color="green">{course.passed}</td>
                        <td data-color="red">{course.failed}</td>
                        <td>{course.passRatio}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </>
);

const TabStudentHistory: React.FC = () => (
    <>
        <h3 className={styles.chartTitle}>Lịch sử học tập của học viên</h3>
        {MOCK_DATA.studentHistory.map((student) => (
            <div key={student.id} className={styles.studentHistoryCard}>
                <h4 className={styles.studentName}>{student.name} (ID: {student.id})</h4>
                {student.courses.map((c, index) => (
                    <div key={index} className={styles.courseItem}>
                        <div className={styles.courseItemDetail}>
                            <p><strong>Khóa học:</strong> {c.course}</p>
                            <p><strong>Ngày đăng ký:</strong> {c.date}</p>
                            <p><strong>Thời gian khóa học:</strong> {c.period}</p>
                        </div>
                        <div className={styles.courseItemStatus}>
                            <p><strong>Trạng thái:</strong> <span className={styles.statusBadge} data-status={c.status.replace(/\s/g, '').toLowerCase()}>{c.status}</span></p>
                            <p><strong>Kết quả:</strong> <span className={styles.resultBadge} data-result={c.result.replace(/\s/g, '').toLowerCase()}>{c.result}</span></p>
                        </div>
                    </div>
                ))}
            </div>
        ))}
    </>
);


// --- MAIN COMPONENT ---
type Tab = 'province' | 'year' | 'course_detail' | 'student_history';

const StatisticsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('province');

    const renderContent = () => {
        switch (activeTab) {
            case 'province':
                return <TabProvinceStats />;
            case 'year':
                return <TabYearStats />;
            case 'course_detail':
                return <TabCourseDetails />;
            case 'student_history':
                return <TabStudentHistory />;
            default:
                return <TabProvinceStats />;
        }
    };

    return (
        <div className={styles.container}>
            
            {/* Tiêu đề trang */}
            <h1 className={styles.pageTitle}>Thống kê</h1>
            
            {/* --- Stat Cards (Giống Dashboard) --- */}
            <div className={styles.miniStatCardsGrid}>
                <div className={styles.miniStatCardItem}>
                    <p className={styles.cardLabel}>Tổng học viên</p>
                    <div className={styles.cardValue}><span className={styles.icon}>🧑‍🎓</span>{MOCK_DATA.totalStudents}</div>
                </div>
                <div className={styles.miniStatCardItem}>
                    <p className={styles.cardLabel}>Tổng khóa học</p>
                    <div className={styles.cardValue}><span className={styles.icon}>📚</span>{MOCK_DATA.totalCourses}</div>
                </div>
                <div className={styles.miniStatCardItem}>
                    <p className={styles.cardLabel}>Tỷ lệ hoàn thành</p>
                    <div className={styles.cardValue}><span className={styles.icon}>✅</span>{MOCK_DATA.completionRate}</div>
                </div>
                <div className={styles.miniStatCardItem}>
                    <p className={styles.cardLabel}>Tỷ lệ đạt</p>
                    <div className={styles.cardValue}><span className={styles.icon}>🏆</span>{MOCK_DATA.passRate}</div>
                </div>
            </div>

            {/* --- Tab Navigation --- */}
            <div className={styles.tabNavigation}>
                <button 
                    className={activeTab === 'province' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('province')}
                >
                    Thống kê theo tỉnh
                </button>
                <button 
                    className={activeTab === 'year' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('year')}
                >
                    Thống kê theo năm
                </button>
                <button 
                    className={activeTab === 'course_detail' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('course_detail')}
                >
                    Chi tiết khóa học
                </button>
                <button 
                    className={activeTab === 'student_history' ? styles.activeTab : ''}
                    onClick={() => setActiveTab('student_history')}
                >
                    Lịch sử học viên
                </button>
            </div>
            
            {/* --- Content Area --- */}
            <div className={styles.tabContentContainer}>
                {renderContent()}
            </div>
            
        </div>
    );
};

export default StatisticsPage;