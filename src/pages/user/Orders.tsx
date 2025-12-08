import { useEffect, useState } from "react";
import { getMyOrdersApi, getPaymentInfoApi, requestPaymentApprovalApi } from "../../api/student/order.api";
import type { OrderResponse, PaymentInfoResponse } from "../../types/student/order.types";
import styles from "../../styles/user/UserPaymentHistory.module.css";

const normalizeDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleString("vi-VN");
};

export default function Orders() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPaymentInfo, setLoadingPaymentInfo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);
  const [perOrderLoadingId, setPerOrderLoadingId] = useState<number | null>(null);

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
  const { paymentStatus, approvalStatus } = order;
  if (paymentStatus === "FAILED") {
    return (
      <span className={`${styles.badge} ${styles.badgeFailed}`}>
        Thanh toán thất bại
      </span>
    );
  }

  if (approvalStatus === "REJECTED") {
    return (
      <span className={`${styles.badge} ${styles.badgeRejected}`}>
        Đã từ chối
      </span>
    );
  }

  if (approvalStatus === "APPROVED" && paymentStatus === "PAID") {
    return (
      <span className={`${styles.badge} ${styles.badgeSuccess}`}>
        Thanh toán thành công
      </span>
    );
  }
  if (approvalStatus === "APPROVED" && paymentStatus !== "PAID") {
    return (
      <span className={`${styles.badge} ${styles.badgeInfo}`}>
        Thanh toán thành công
      </span>
    );
  }
  return (
    <span className={`${styles.badge} ${styles.badgePending}`}>
      Đang chờ xác nhận
    </span>
  );
};


  const handleShowPaymentInfo = (order?: OrderResponse) => {
    if (order) setSelectedOrder(order);
    else setSelectedOrder(null); 
    setShowPaymentModal(true);
  };

  const handleRequestPaymentApproval = async (orderId: number) => {
    if (!window.confirm("Bạn xác nhận rằng bạn đã chuyển khoản đúng số tiền và ghi chính xác nội dung chuyển khoản?")) return;
    try {
      setPerOrderLoadingId(orderId);
      await requestPaymentApprovalApi(orderId);
      alert("Yêu cầu xác nhận thanh toán đã được gửi đến quản trị viên.");
      
      // Đóng modal và tải lại danh sách sau khi thành công
      setShowPaymentModal(false); 
      setSelectedOrder(null);
      await fetchOrders();
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Không gửi được yêu cầu xác nhận.");
    } finally {
      setPerOrderLoadingId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Lịch sử đơn hàng</h2>
          <p className={styles.subtitle}>Xem danh sách các đơn hàng và trạng thái thanh toán của bạn.</p>
        </div>

        <div className={styles.actions}>
          <button className={styles.button} onClick={() => handleShowPaymentInfo()} disabled={loadingPaymentInfo}>
            Thông tin thanh toán chung
          </button>

          <button className={styles.button} onClick={fetchOrders} disabled={loading}>
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
                <th className={styles.th}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => {
                const priceNumber = order.price != null ? Number(order.price) : null;
                
                return (
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
                        {priceNumber != null ? `${priceNumber.toLocaleString("vi-VN")} VNĐ` : "-"}
                      </span>
                    </td>

                    <td className={styles.td}>{renderStatusBadge(order)}</td>

                    <td className={styles.td}>
                      <span className={styles.cellSub}>{normalizeDate(order.createdAt)}</span>
                    </td>

                    <td className={styles.td}>
                      {order.approvalStatus === "PENDING" ? (
                        <button className={styles.button} onClick={() => handleShowPaymentInfo(order)}>
                          Thanh toán
                        </button>
                      ) : order.approvalStatus === "APPROVED" ? (
                        <span className={styles.successText}>Đã thanh toán</span>
                      ) : (
                        <span className={styles.failText}>Đã từ chối</span>
                      )}
                    </td>
                  </tr>
                );
              })}
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

              {selectedOrder && (
                <div className={styles.paymentOrder}>
                  <p>
                    <strong>Mã đơn hàng:</strong> #{selectedOrder.id}
                  </p>
                  <p>
                    <strong>Khóa học:</strong> {selectedOrder.courseTitle}
                  </p>
                  <p>
                    <strong>Số tiền phải trả:</strong> {Number(selectedOrder.price || 0).toLocaleString("vi-VN")} VNĐ
                  </p>
                  <p>
                    <strong>Nội dung chuyển khoản:</strong>{" "}
                    <span className={styles.transferNote}>{selectedOrder.transferNote ?? `ORDER-${selectedOrder.id}`}</span>
                  </p>
                </div>
              )}

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

                  <p className={styles.paymentNote}>Vui lòng chuyển khoản đúng số tiền và ghi chính xác nội dung chuyển khoản.</p>
                </div>
              ) : (
                <p className={styles.error}>Không thể tải thông tin thanh toán.</p>
              )}
            </div>

            <div className={styles.modalFooter}>
              {selectedOrder && selectedOrder.approvalStatus === "PENDING" && (
                <button
                  onClick={() => handleRequestPaymentApproval(selectedOrder.id)}
                  disabled={perOrderLoadingId === selectedOrder.id}
                  style={{
                    backgroundColor: "#000", 
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px", 
                    fontSize: "14px",
                    fontWeight: "500",
                    opacity: perOrderLoadingId === selectedOrder.id ? 0.7 : 1,
                    transition: "background 0.3s ease"
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#000")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#000")}
                >
                  {perOrderLoadingId === selectedOrder.id ? "Đang xử lý..." : "Xác nhận đã chuyển khoản"}
                </button>
              )}

              <button className={styles.button} onClick={() => setShowPaymentModal(false)}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}