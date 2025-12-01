// src/pages/admin/OrderApprovalPage.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { approveOrder, fetchPendingOrders, rejectOrder } from '../../redux/slices/order.slice';
import styles from '../../styles/layout.module.css';
import componentStyles from '../../styles/components.module.css';

const OrderApprovalPage = () => {
  const dispatch = useAppDispatch();
  const { pendingOrders, loading, error } = useAppSelector((s) => s.orders);

  useEffect(() => {
    dispatch(fetchPendingOrders());
  }, [dispatch]);

  const handleApprove = (id: number) => dispatch(approveOrder(id));
  const handleReject = (id: number) => dispatch(rejectOrder(id));

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Duyệt đơn hàng</h1>

      {loading && <p>Đang tải danh sách đơn...</p>}
      {error && <p className={styles.errorText}>{error}</p>}

      {!loading && pendingOrders.length === 0 && <p>Không có đơn chờ duyệt.</p>}

      {pendingOrders.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Học viên</th>
              <th>Khóa học</th>
              <th>Số tiền</th>
              <th>Phương thức</th>
              <th>Trạng thái thanh toán</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {pendingOrders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.studentName}</td>
                <td>{o.courseTitle}</td>
                <td>{o.amount}</td>
                <td>{o.paymentMethod || '-'}</td>
                <td>{o.paymentStatus}</td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className={componentStyles.primaryButton}
                    onClick={() => handleApprove(o.id)}
                  >
                    Approve
                  </button>
                  <button
                    className={componentStyles.dangerButton}
                    style={{ marginLeft: 8 }}
                    onClick={() => handleReject(o.id)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderApprovalPage;
