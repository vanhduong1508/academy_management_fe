// /src/components/ui/Skeleton/Skeleton.tsx
import React from 'react';
// import styles from './Skeleton.module.css'; // Cần tạo file CSS Modules tương ứng

interface SkeletonProps {
    width?: string;
    height?: string;
    circle?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({ width = '100%', height = '1em', circle = false }) => {
    // Trong CSS Modules, bạn sẽ định nghĩa hiệu ứng shimmer và style cơ bản
    const style: React.CSSProperties = {
        width: width,
        height: height,
        borderRadius: circle ? '50%' : '4px',
        backgroundColor: '#f2f2f2',
        // Thường kèm theo animation CSS để tạo hiệu ứng gợn sóng
    };

    return (
        // <div className={styles.skeletonBase} style={style}></div>
        <div style={style}></div> 
    );
};

export default Skeleton;