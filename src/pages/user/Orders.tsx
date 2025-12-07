import { useEffect, useState } from "react";
import {
  getMyOrdersApi,
  getPaymentInfoApi,
  confirmPaymentApi
} from "../../api/student/order.api";
import type {
  OrderResponse,
  PaymentInfoResponse,
} from "../../types/student/order.types";
import styles from "../../styles/user/UserPaymentHistory.module.css";

const normalizeDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleString("vi-VN");
};

export default function Orders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoResponse | null>(null);

  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPaymentOrder, setCurrentPaymentOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      setError(null);
      const data = await getMyOrdersApi();
      setOrders(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được danh sách đơn hàng.");
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchPaymentInfo = async () => {
    try {
      setLoadingPaymentInfo(true);
      const data = await getPaymentInfoApi();
      setPaymentInfo(data);
    } catch (err) {
      console.error("Could not load payment info:", err);
    } finally {
      setLoadingPaymentInfo(false);
    }
  };

  const renderStatusBadge = (order: OrderResponse) => {
    const { paymentStatus, approvalStatus } = order;

    if (paymentStatus === "PAID" || approvalStatus === "APPROVED") {
      return <span className={`${styles.badge} ${styles.badgeSuccess}`}>Đã thanh toán</span>;
    }

    if (approvalStatus === "REJECTED") {
      return <span className={`${styles.badge} ${styles.badgeRejected}`}>Đã từ chối</span>;
    }

    if (paymentStatus === "FAILED") {
      return <span className={`${styles.badge} ${styles.badgeFailed}`}>Thanh toán thất bại</span>;
    }

    return <span className={`${styles.badge} ${styles.badgePending}`}>Chờ thanh toán</span>;
  };

  const openPaymentModal = (order: OrderResponse) => {
    setCurrentPaymentOrder(order);
    setShowPaymentModal(true);

    if (!paymentInfo) fetchPaymentInfo();
  };

  const completePayment = async () => {
    if (!currentPaymentOrder) return;

    try {
      await confirmPaymentApi(currentPaymentOrder.id);
      alert("Yêu cầu xác nhận thanh toán đã được gửi đến Admin.");
      setShowPaymentModal(false);
      fetchOrders();
    } catch (err: any) {
      alert(err?.response?.data?.message || "Không gửi được yêu cầu xác nhận.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Lịch sử đơn hàng</h2>
          <p className={styles.subtitle}>Xem danh sách đơn hàng và trạng thái thanh toán của bạn.</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.button} onClick={fetchOrders} disabled={loadingOrders}>
            {loadingOrders ? "Đang tải..." : "Tải lại"}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        {loadingOrders && orders.length === 0 ? (
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
                <th className={styles.th}>Thanh toán</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className={styles.tr}>
                  <td className={styles.td}>
                    <div className={styles.cellMain}>
                      <span className={styles.cellTitle}>#{order.id}</span>
                      <span className={styles.cellSub}>{normalizeDate(order.createdAt)}</span>
                    </div>
                  </td>

                  <td className={styles.td}>
                    <span className={styles.cellTitle}>{order.courseTitle}</span>
                  </td>

                  <td className={styles.td}>
                    <span className={styles.amount}>
                      {order.amount ? order.amount.toLocaleString("vi-VN") : 0} VNĐ
                    </span>
                  </td>

                  <td className={styles.td}>{renderStatusBadge(order)}</td>

                  <td className={styles.td}>
                    {(order.paymentStatus !== "PAID" && order.approvalStatus !== "APPROVED") ? (
                      <button className={styles.button} onClick={() => openPaymentModal(order)}>
                        Thanh toán
                      </button>
                    ) : (
                      <span className={styles.badgeSuccess}>Đã thanh toán</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showPaymentModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPaymentModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Thanh toán đơn hàng</h3>

            {!currentPaymentOrder ? (
              <p>Không tìm thấy đơn hàng.</p>
            ) : (
              <div className={styles.modalBody}>
                <p><strong>Đơn hàng:</strong> #{currentPaymentOrder.id}</p>
                <p>
                  <strong>Số tiền cần thanh toán:</strong>{" "}
                  {currentPaymentOrder.amount?.toLocaleString("vi-VN") || 0} VNĐ
                </p>

                <hr style={{ margin: "16px 0", opacity: 0.3 }} />

                {loadingPaymentInfo ? (
                  <p>Đang tải thông tin thanh toán...</p>
                ) : paymentInfo ? (
                  <div className={styles.paymentInfo}>
                    <div className={styles.paymentRow}>
                      <span className={styles.paymentLabel}>Ngân hàng:</span>
                      <span>{paymentInfo.bankName}</span>
                    </div>

                    <div className={styles.paymentRow}>
                      <span className={styles.paymentLabel}>Chủ tài khoản:</span>
                      <span>{paymentInfo.bankAccountName}</span>
                    </div>

                    <div className={styles.paymentRow}>
                      <span className={styles.paymentLabel}>Số tài khoản:</span>
                      <span className={styles.accountNumber}>
                        {paymentInfo.bankAccountNumber}
                      </span>
                    </div>

                    {paymentInfo.transferGuide && (
                      <div className={styles.paymentRow}>
                        <span className={styles.paymentLabel}>Hướng dẫn:</span>
                        <span>{paymentInfo.transferGuide}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className={styles.error}>Không tải được thông tin thanh toán</p>
                )}
              </div>
            )}

            <div className={styles.modalFooter}>
              <button className={styles.button} onClick={() => setShowPaymentModal(false)}>
                Đóng
              </button>

              <button
                className={styles.button}
                style={{ backgroundColor: "#10b981" }}
                onClick={completePayment}
              >
                Hoàn tất thanh toán
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
