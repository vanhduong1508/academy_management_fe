// src/components/dashboard/StatsCard.tsx

import React from 'react';
import styles from '../../styles/StatsCard.module.css';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string; // Màu sắc cho icon và viền
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  // Tạo style động cho màu sắc
  const cardStyle = {
    '--card-color': color,
  } as React.CSSProperties;

  return (
    <div className={styles.card} style={cardStyle}>
      <div className={styles.iconContainer}>
        {icon}
      </div>
      <div className={styles.content}>
        <p className={styles.title}>{title}</p>
        <h3 className={styles.value}>{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;