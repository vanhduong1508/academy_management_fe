// src/pages/admin/OrderManagementPage.tsx
import { useEffect, useState } from "react";
import {
  getPendingOrdersApi,
  approveOrderApi,
  rejectOrderApi,
} from "../../api/admin/admin-orders.api";
import type { Order } from "../../types/models/order.types";
import styles from "../../styles/AdminOrdersPage.module.css";

export default function OrderManagementPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPendingOrdersApi();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Không tải được danh sách đơn hàng. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleApprove = async (orderId: number) => {
    try {
      setActionLoadingId(orderId);
      await approveOrderApi(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Duyệt đơn thất bại");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (orderId: number) => {
    try {
      setActionLoadingId(orderId);
      await rejectOrderApi(orderId);
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Từ chối đơn thất bại");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý thanh toán khóa học</h2>
          <p className={styles.subtitle}>
            Duyệt các đơn hàng đã thanh toán. Sau khi được duyệt, hệ thống sẽ tự
            động tạo Enrollment cho học viên.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className={styles.refreshButton}
          disabled={loading}
        >
          {loading ? "Đang tải..." : "Tải lại"}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading && orders.length === 0 ? (
        <p className={styles.infoText}>Đang tải dữ liệu...</p>
      ) : orders.length === 0 ? (
        <p className={styles.infoText}>
          Hiện không có đơn hàng nào đang chờ duyệt.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>ID</th>
                <th className={styles.th}>Học viên</th>
                <th className={styles.th}>Khóa học</th>
                <th className={styles.th}>Thanh toán</th>
                <th className={styles.th}>Trạng thái</th>
                <th className={styles.th}>Ngày tạo</th>
                <th className={styles.thRight}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isActing = actionLoadingId === order.id;

                // Bạn chỉnh các field dưới cho khớp với Order model của bạn
                const studentName =
                  (order as any).studentName ??
                  (order as any).student?.fullName ??
                  `Student #${(order as any).studentId}`;
                const courseTitle =
                  (order as any).courseTitle ??
                  (order as any).course?.title ??
                  `Course #${(order as any).courseId}`;

                return (
                  <tr key={order.id} className={styles.tr}>
                    <td className={styles.td}>{order.id}</td>
                    <td className={styles.td}>
                      <div className={styles.cellMain}>
                        <span className={styles.cellTitle}>{studentName}</span>
                        {"studentId" in order && (
                          <span className={styles.cellSub}>
                            ID: {(order as any).studentId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={styles.td}>
                      <div className={styles.cellMain}>
                        <span className={styles.cellTitle}>{courseTitle}</span>
                        {"courseId" in order && (
                          <span className={styles.cellSub}>
                            ID: {(order as any).courseId}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${styles.badgeSuccess}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className={styles.td}>
                      <span
                        className={`${styles.badge} ${styles.badgeWarning}`}
                      >
                        {order.approvalStatus}
                      </span>
                    </td>
                    <td className={styles.td}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString()
                        : "-"}
                    </td>
                    <td className={styles.tdRight}>
                      <button
                        onClick={() => handleApprove(order.id)}
                        disabled={isActing}
                        className={`${styles.actionButton} ${styles.actionApprove}`}
                      >
                        {isActing ? "Đang xử lý..." : "Duyệt"}
                      </button>
                      <button
                        onClick={() => handleReject(order.id)}
                        disabled={isActing}
                        className={`${styles.actionButton} ${styles.actionReject}`}
                      >
                        Từ chối
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
