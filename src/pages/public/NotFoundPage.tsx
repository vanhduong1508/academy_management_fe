import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Không tìm thấy trang</h1>
        <p className={styles.message}>
          Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
        </p>

        <div className={styles.actions}>
          <Link to="/" className={styles.primaryBtn}>
            ⬅ Quay về Trang chủ
          </Link>
          <button
            className={styles.secondaryBtn}
            type="button"
            onClick={() => window.history.back()}
          >
            Quay lại trang trước
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
