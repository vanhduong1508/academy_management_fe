import React from "react";
import { Link } from "react-router-dom";
import { Home, LogIn, UserPlus } from "lucide-react";
import styles from "../../styles/HomePage.module.css";

const HomePage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.heroCard}>
        <div className={styles.badge}>
          <Home size={18} /> Center Management
        </div>

        <h1 className={styles.title}>
          Chào mừng đến với <span>Hệ thống Quản lý Học viện</span>
        </h1>

        <p className={styles.subtitle}>
          Quản lý khóa học, học viên và tiến độ học tập một cách trực quan, nhẹ
          nhàng và hiện đại.
        </p>

        <div className={styles.ctaGroup}>
          <Link to="/login" className={styles.primaryBtn}>
            <LogIn size={18} /> Đăng nhập ngay
          </Link>
          <Link to="/register" className={styles.secondaryBtn}>
            <UserPlus size={18} /> Đăng ký tài khoản
          </Link>
        </div>

        <div className={styles.helperText}>
          Admin dùng tài khoản cố định, học viên hãy đăng ký tài khoản mới để
          bắt đầu.
        </div>
      </div>
    </div>
  );
};

export default HomePage;
