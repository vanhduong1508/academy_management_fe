// src/pages/admin/OrderManagementPage.tsx
import { useEffect, useState } from "react";
import {
  getPendingOrdersApi,
  approveOrderApi,
  rejectOrderApi,
} from "../../api/admin/admin-orders.api";
import type { Order } from "../../types/admin/admin-order.types";
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

  const renderPaymentBadge = (paymentStatus: Order["paymentStatus"]) => {
    const base = styles.badge;

    if (paymentStatus === "PENDING") {
      return (
        <span className={`${base} ${styles.badgeWarning}`}>
          Chờ thanh toán
        </span>
      );
    }
    if (paymentStatus === "PAID") {
      return (
        <span className={`${base} ${styles.badgeSuccess}`}>Đã thanh toán</span>
      );
    }
    if (paymentStatus === "FAILED") {
      return (
        <span className={`${base} ${styles.badgeDanger}`}>Thanh toán lỗi</span>
      );
    }
    return <span className={base}>{paymentStatus}</span>;
  };

  const renderApprovalBadge = (approvalStatus: Order["approvalStatus"]) => {
    const base = styles.badge;
    if (approvalStatus === "PENDING") {
      return <span className={`${base} ${styles.badgeWarning}`}>Chờ duyệt</span>;
    }
    if (approvalStatus === "APPROVED") {
      return <span className={`${base} ${styles.badgeSuccess}`}>Đã duyệt</span>;
    }
    if (approvalStatus === "REJECTED") {
      return <span className={`${base} ${styles.badgeDanger}`}>Đã từ chối</span>;
    }
    return <span className={base}>{approvalStatus}</span>;
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Quản lý thanh toán khóa học</h2>
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
                <th className={styles.th}>Số tiền</th>
                <th className={styles.th}>Thanh toán</th>
                <th className={styles.th}>Trạng thái</th>
                <th className={styles.th}>Ngày tạo</th>
                <th className={styles.th}>Ghi chú chuyển khoản</th>
                <th className={styles.thRight}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const isActing = actionLoadingId === order.id;

                const studentLabel =
                  order.studentName || (order.studentId != null
                    ? `Student #${order.studentId}`
                    : "Không rõ học viên");

                const courseLabel =
                  order.courseTitle || (order.courseId != null
                    ? `Course #${order.courseId}`
                    : "Không rõ khóa học");

                const amount = order.price ?? 0;

                return (
                  <tr key={order.id} className={styles.tr}>
                    <td className={styles.td}>{order.id}</td>

                    <td className={styles.td}>
                      <div className={styles.cellMain}>
                        <span className={styles.cellTitle}>
                          {studentLabel}
                        </span>
                        {order.studentId != null && (
                          <span className={styles.cellSub}>
                            ID: {order.studentId}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className={styles.td}>
                      <div className={styles.cellMain}>
                        <span className={styles.cellTitle}>
                          {courseLabel}
                        </span>
                        {order.courseId != null && (
                          <span className={styles.cellSub}>
                            ID: {order.courseId}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className={styles.td}>
                      {amount > 0
                        ? `${amount.toLocaleString("vi-VN")} đ`
                        : "-"}
                    </td>

                    <td className={styles.td}>
                      {renderPaymentBadge(order.paymentStatus)}
                    </td>

                    <td className={styles.td}>
                      {renderApprovalBadge(order.approvalStatus)}
                    </td>

                    <td className={styles.td}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                        : "-"}
                    </td>

                    <td className={styles.td}>
                      <span className={styles.transferNote}>
                        {order.transferNote ?? "-"}
                      </span>
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
