// src/components/dashboard/SummaryWidget.tsx

import React from 'react';
import styles from '../../styles/SummaryWidget.module.css';

interface SummaryItem {
  name: string;
  value: string | number;
  color?: string; // Màu sắc tùy chọn cho giá trị
}

interface SummaryWidgetProps {
  title: string;
  icon: React.ReactNode;
  data: SummaryItem[];
}

const SummaryWidget: React.FC<SummaryWidgetProps> = ({ title, icon, data }) => {
  return (
    <div className={styles.widget}>
      <h3 className={styles.title}>
        <span className={styles.icon}>{icon}</span>
        {title}
      </h3>
      <ul className={styles.list}>
        {data.map((item, index) => (
          <li key={index} className={styles.listItem}>
            <span className={styles.itemName}>{item.name}</span>
            <span 
              className={styles.itemValue} 
              style={item.color ? { color: item.color } : {}}
            >
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SummaryWidget;