import React from 'react';
import Sidebar from './Sidebar'; 
import styles from './MainLayout.module.css';

interface MainLayoutProps {
    children: React.ReactNode; 
    onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onLogout }) => {
    return (
        <div className={styles.container}>
            
            {/* Vùng 1: SIDEBAR (Cố định) */}
            <Sidebar onLogout={onLogout} />
            
            {/* Vùng Content Chính (Header + Main) */}
            <div className={styles.mainContentArea}>
                
                {/* Vùng 3: MAIN CONTENT (Cuộn) */}
                <main className={styles.pageContent}>
                    {children}
                </main>
                
            </div>
            
        </div>
    );
};

export default MainLayout;