import { useEffect, useState } from "react";
import { getMyOrdersApi, getPaymentInfoApi } from "../../api/student/order.api";
import type { OrderResponse, PaymentInfoResponse } from "../../types/student/order.types";
import styles from "../../styles/user/UserPaymentHistory.module.css";

const normalizeDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("vi-VN");
};

export default function Orders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchPaymentInfo();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyOrdersApi();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPaymentInfo = async () => {
    try {
      setLoadingPaymentInfo(true);
      const data = await getPaymentInfoApi();
      setPaymentInfo(data);
    } catch (err: any) {
      console.error("Could not load payment info:", err);
    } finally {
      setLoadingPaymentInfo(false);
    }
  };

  const renderStatusBadge = (order: OrderResponse) => {
    const paymentStatus = order.paymentStatus;
    const approvalStatus = order.approvalStatus;

    if (paymentStatus === "PAID" && approvalStatus === "APPROVED") {
      return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Đã thanh toán</span>;
    }
    if (paymentStatus === "PENDING" && approvalStatus === "PENDING") {
      return <span className={`${styles.badge} ${styles.badgePending}`}>Chờ thanh toán</span>;
    }
    if (approvalStatus === "REJECTED") {
      return <span className={`${styles.badge} ${styles.badgeRejected}`}>Đã từ chối</span>;
    }
    if (paymentStatus === "FAILED") {
      return <span className={`${styles.badge} ${styles.badgeFailed}`}>Thanh toán thất bại</span>;
    }
    return <span className={`${styles.badge} ${styles.badgePending}`}>Đang xử lý</span>;
  };

  const handleShowPaymentInfo = () => {
    setShowPaymentModal(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Lịch sử đơn hàng</h2>
          <p className={styles.subtitle}>
            Xem danh sách các đơn hàng và trạng thái thanh toán của bạn.
          </p>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.button}
            onClick={handleShowPaymentInfo}
            disabled={loadingPaymentInfo}
          >
            Thông tin thanh toán
          </button>
          <button
            className={styles.button}
            onClick={fetchOrders}
            disabled={loading}
          >
            {loading ? "Đang tải..." : "Tải lại"}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        {loading && orders.length === 0 ? (
          <p className={styles.infoText}>Đang tải danh sách đơn hàng...</p>
        ) : orders.length === 0 ? (
          <p className={styles.infoText}>Bạn chưa có đơn hàng nào.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Đơn hàng</th>
                <th className={styles.th}>Khóa học</th>
                <th className={styles.th}>Số tiền</th>
                <th className={styles.th}>Trạng thái</th>
                <th className={styles.th}>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.cellMain}>
                      <span className={styles.cellTitle}>#{order.id}</span>
                      <span className={styles.cellSub}>
                        {normalizeDate(order.createdAt)}
                      </span>
                    </div>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.cellTitle}>{order.courseTitle}</span>
                  </td>
                  <td className={styles.td}>
                    <span className={styles.amount}>
                      {order.price != null
                        ? `${order.price.toLocaleString("vi-VN")} VNĐ`
                        : "-"}
                    </span>
                  </td>
                  <td className={styles.td}>{renderStatusBadge(order)}</td>
                  <td className={styles.td}>
                    <span className={styles.cellSub}>
                      {normalizeDate(order.createdAt)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Payment Info Modal */}
      {showPaymentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Thông tin thanh toán</h3>
            <div className={styles.modalBody}>
              {loadingPaymentInfo ? (
                <p className={styles.infoText}>Đang tải thông tin...</p>
              ) : paymentInfo ? (
                <div className={styles.paymentInfo}>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>Ngân hàng:</span>
                    <span>{paymentInfo.bankName}</span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>Tên tài khoản:</span>
                    <span>{paymentInfo.bankAccountName}</span>
                  </div>
                  <div className={styles.paymentRow}>
                    <span className={styles.paymentLabel}>Số tài khoản:</span>
                    <span className={styles.accountNumber}>{paymentInfo.bankAccountNumber}</span>
                  </div>
                  {paymentInfo.transferGuide && (
                    <div className={styles.paymentRow}>
                      <span className={styles.paymentLabel}>Hướng dẫn:</span>
                      <span>{paymentInfo.transferGuide}</span>
                    </div>
                  )}
                  <p className={styles.paymentNote}>
                    Vui lòng chuyển khoản đúng số tiền và ghi chú mã đơn hàng khi thanh toán.
                  </p>
                </div>
              ) : (
                <p className={styles.error}>Không thể tải thông tin thanh toán.</p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button
                className={styles.button}
                onClick={() => setShowPaymentModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

