// src/components/dashboard/RecentListWidget.tsx

import React from 'react';
import styles from '../../styles/RecentListWidget.module.css';

interface ListItem {
  id: string | number;
  name: string;
  description: string;
  value: string; // Giá trị (Ngày/Số lượng học viên)
  tag?: { text: string, color: string }; // Thẻ (Tag) nhỏ (hoàn thành/chờ xử lý)
}

interface RecentListWidgetProps {
  title: string;
  icon: React.ReactNode;
  data: ListItem[];
}

const RecentListWidget: React.FC<RecentListWidgetProps> = ({ title, icon, data }) => {
  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>
        <span className={styles.icon}>{icon}</span>
        {title}
      </h3>
      <ul className={styles.list}>
        {data.map((item) => (
          <li key={item.id} className={styles.listItem}>
            <div className={styles.info}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.description}>{item.description}</p>
            </div>
            <div className={styles.valueSection}>
              {item.tag && (
                <span 
                  className={styles.tag} 
                  style={{ backgroundColor: item.tag.color, color: 'white' }}
                >
                  {item.tag.text}
                </span>
              )}
              <span className={styles.value}>{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentListWidget;