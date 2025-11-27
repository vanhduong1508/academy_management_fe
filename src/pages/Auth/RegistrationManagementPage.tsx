import React, { useEffect, useState, useCallback } from "react";
import { courseApi } from "../../services/api/courseApi"; // Giả định tồn tại
import {
  getAllEnrollments,
  updateEnrollmentResult,
  enrollCourse,
  getUnregisteredStudents,
  Enrollment,
  UpdateResultPayload,
} from "../../services/api/enrollmentApi";
import { Course } from "../../types/course"; // Giả định tồn tại
import { StudentResponse } from "../../types/enrollment"; // Giả định tồn tại

// --- TYPING CHO MODAL ---
interface RegistrationModalState {
  isOpen: boolean;
  studentId: number | null;
  courseId: number | null;
  loading: boolean;
  error: string | null;
}

// Giả định định dạng ngày cho hiển thị
const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("vi-VN");
};


const RegistrationManagementPage: React.FC = () => {
  // State data chính
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10); 
  const [sortBy] = useState("id"); 
  const [totalPages, setTotalPages] = useState(0);
  
  // State cho Modal Đăng ký
  const [modalState, setModalState] = useState<RegistrationModalState>({
    isOpen: false,
    studentId: null,
    courseId: null,
    loading: false,
    error: null,
  });

  // Data cho Modal
  const [unregisteredStudents, setUnregisteredStudents] = useState<StudentResponse[]>([]);
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  
  // --- HÀM TẢI DỮ LIỆU ---

  // Lọc khóa học SẮP/ĐANG diễn ra
  const filterAvailableCourses = (allCourses: Course[]): Course[] => {
    const now = new Date();
    return allCourses.filter(c => {
      if (c.status !== "ACTIVE") return false;

      const startDate = new Date(c.startDate);
      const endDate = new Date(c.endDate);

      // Sắp diễn ra (startDate > now) HOẶc Đang diễn ra (startDate <= now <= endDate)
      return startDate > now || (startDate <= now && now <= endDate);
    });
  };

  // Tải danh sách khóa học và học viên cho Modal
  const loadModalData = useCallback(async () => {
    // 1. Tải danh sách Khóa học
    try {
      // Giả định courseApi.getAll có thể lấy tất cả khóa ACTIVE
      const allCoursesData = await courseApi.getAll(0, 1000, "", "ACTIVE"); 
      const filteredCourses = filterAvailableCourses(allCoursesData?.courses || []);
      setAvailableCourses(filteredCourses);
    } catch (err) {
      console.error("Lỗi tải danh sách khóa học cho Modal:", err);
    }

    // 2. Tải danh sách Học viên chưa đăng ký
    try {
      const students = await getUnregisteredStudents();
      setUnregisteredStudents(students);
    } catch (err) {
      console.error("Lỗi tải danh sách học viên chưa đăng ký:", err);
    }
  }, []);

  // Tải danh sách Enrollment chính
  const loadEnrollments = useCallback(async () => {
    try {
      // ✅ [FIX] Gọi API với 3 tham số (đã sửa lỗi TS2554)
      const data = await getAllEnrollments(page, size, sortBy); 
      setEnrollments(data?.content || []);
      setTotalPages(data?.totalPages || 0);
    } catch (err) {
      console.error("Lỗi tải danh sách đăng ký:", err);
      setEnrollments([]);
    }
  }, [page, size, sortBy]);

  // Cập nhật kết quả PASS/FAIL
  const handleUpdateResult = async (enrollmentId: number, currentResult: string | undefined) => {
    // Logic: Nếu đang PASS, chuyển thành FAIL; ngược lại, chuyển thành PASS.
    // Giả định: Khi chọn thao tác, giá trị là 'PASS'/'FAIL'/'ENROLLED'
    const passed = currentResult === 'PASS'; 
    const payload: UpdateResultPayload = { passed };
    
    try {
      await updateEnrollmentResult(enrollmentId, payload);
      loadEnrollments(); // reload
    } catch (err) {
      console.error("Lỗi cập nhật kết quả:", err);
    }
  };
  
  // --- HÀM XỬ LÝ MODAL ---
  
  const openModal = () => {
    loadModalData();
    setModalState(s => ({ ...s, isOpen: true, studentId: null, courseId: null, error: null }));
  };
  
  const closeModal = () => {
    setModalState(s => ({ ...s, isOpen: false }));
  };

  const handleRegister = async () => {
    if (!modalState.studentId || !modalState.courseId) {
      setModalState(s => ({ ...s, error: "Vui lòng chọn Học viên và Khóa học." }));
      return;
    }
    
    setModalState(s => ({ ...s, loading: true, error: null }));
    
    try {
      await enrollCourse({ 
        studentId: modalState.studentId, 
        courseId: modalState.courseId 
      });
      
      closeModal();
      loadEnrollments(); // Reload danh sách chính
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Lỗi đăng ký không xác định.";
      setModalState(s => ({ ...s, error: errorMsg }));
    } finally {
      setModalState(s => ({ ...s, loading: false }));
    }
  };

  // --- USE EFFECT ---
  useEffect(() => {
    loadEnrollments();
  }, [loadEnrollments]); 

  // Pagination buttons (cho Enrollments)
  const pages = Array.from({ length: totalPages }, (_, i) => i);

  // --- COMPONENT RENDER (Modal) ---
  const RegistrationModal: React.FC = () => {
    if (!modalState.isOpen) return null;
    
    return (
      <div 
        style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: "rgba(0, 0, 0, 0.5)", 
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 1000 // Đảm bảo modal hiển thị trên cùng
        }}
        onClick={closeModal}
      >
        <div 
          style={{ 
            backgroundColor: "white", padding: "20px", borderRadius: "8px", 
            width: "400px", zIndex: 1010, boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}
          onClick={(e) => e.stopPropagation()} 
        >
          <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", marginBottom: "15px" }}>
              <h4>Đăng ký học viên vào khóa học</h4>
              <button onClick={closeModal} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>&times;</button>
          </div>
          
          <div style={{ padding: "0 0 20px 0" }}>
            {modalState.error && <p style={{ color: "red", fontSize: "0.85rem" }}>{modalState.error}</p>}
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Chọn học viên</label>
              <select 
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                value={modalState.studentId || ""} 
                onChange={(e) => setModalState(s => ({ ...s, studentId: Number(e.target.value) || null, error: null }))}
                disabled={modalState.loading}
              >
                <option value="">Chọn học viên</option>
                {unregisteredStudents.map(s => (
                  <option key={s.id} value={s.id}>{s.fullName} ({s.studentCode})</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Chọn khóa học</label>
              <select 
                style={{ width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
                value={modalState.courseId || ""} 
                onChange={(e) => setModalState(s => ({ ...s, courseId: Number(e.target.value) || null, error: null }))}
                disabled={modalState.loading}
              >
                <option value="">Chọn khóa học</option>
                {availableCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.title} ({formatDate(c.startDate)} - {formatDate(c.endDate)})</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <button 
              onClick={closeModal} 
              style={{ padding: "10px 20px", border: "1px solid #ccc", background: "white", borderRadius: "4px" }}
            >
              Hủy
            </button>
            <button 
              onClick={handleRegister} 
              disabled={modalState.loading || !modalState.studentId || !modalState.courseId}
              style={{ 
                padding: "10px 20px", 
                backgroundColor: "#343a40", 
                color: "white", 
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                opacity: (modalState.loading || !modalState.studentId || !modalState.courseId) ? 0.6 : 1
              }}
            >
              {modalState.loading ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // --- COMPONENT RENDER (Trang Chính) ---
  return (
    <div style={{ padding: "20px" }}>
      <h1>Đăng ký</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Quản lý đăng ký khóa học</h2>
        <button 
          onClick={openModal} 
          style={{ 
            padding: "8px 15px", 
            backgroundColor: "#343a40", 
            color: "white", 
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          + Đăng ký học viên
        </button>
      </div>

      {/* Bảng quản lý đăng ký */}
      <table 
        style={{ 
          width: "100%", 
          borderCollapse: "collapse", 
          textAlign: "left",
          fontSize: "0.9rem"
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "1px solid #dee2e6" }}>
            <th style={{ padding: "12px", width: "10%" }}>Mã đăng ký</th>
            <th style={{ padding: "12px", width: "20%" }}>Học viên</th>
            <th style={{ padding: "12px", width: "25%" }}>Khóa học</th>
            <th style={{ padding: "12px", width: "15%" }}>Ngày đăng ký</th>
            <th style={{ padding: "12px", width: "10%" }}>Trạng thái</th>
            <th style={{ padding: "12px", width: "20%" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.length > 0 ? (
            enrollments.map((e) => (
              <tr key={e.id} style={{ borderBottom: "1px solid #dee2e6" }}>
                <td style={{ padding: "12px" }}>{e.id}</td>
                <td style={{ padding: "12px" }}>{e.studentName}</td>
                <td style={{ padding: "12px" }}>{e.courseTitle}</td>
                <td style={{ padding: "12px" }}>
                  {formatDate(e.enrolledAt)}
                </td>
                <td style={{ padding: "12px" }}>
                  {/* ✅ [FIX] Xử lý lỗi TS2339: Dùng e.result để xác định trạng thái */}
                  <span 
                    style={{ 
                      padding: "4px 8px", 
                      borderRadius: "12px", 
                      fontSize: "0.8rem",
                      backgroundColor: e.result === 'PASS' ? '#d4edda' : (e.result === 'FAIL' ? '#f8d7da' : '#fff3cd'),
                      color: e.result === 'PASS' ? '#155724' : (e.result === 'FAIL' ? '#721c24' : '#856404'),
                      fontWeight: 'bold'
                    }}
                  >
                    {e.result === 'PASS' ? 'Hoàn thành' : e.result === 'FAIL' ? 'Thi trượt' : 'Đang học'}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>
                  {/* Dropdown giả lập cho Thao tác */}
                  <select 
                    value={e.result || 'ENROLLED'} // ✅ [FIX] Dùng ENROLLED làm trạng thái mặc định
                    onChange={(event) => handleUpdateResult(e.id, event.target.value)}
                    style={{ padding: "5px", border: "1px solid #ccc", borderRadius: "4px" }}
                  >
                    <option value="ENROLLED">Đang học</option>
                    <option value="PASS">Hoàn thành (PASS)</option>
                    <option value="FAIL">Hoàn thành (FAIL)</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ padding: "12px", textAlign: "center" }}>
                Không tìm thấy dữ liệu đăng ký nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "5px" }}>
        {pages.map((p) => (
          <button 
            key={p} 
            onClick={() => setPage(p)} 
            disabled={p === page}
            style={{ padding: "8px 12px", border: "1px solid #ccc", background: p === page ? '#343a40' : 'white', color: p === page ? 'white' : 'black', cursor: 'pointer', borderRadius: '4px' }}
          >
            {p + 1}
          </button>
        ))}
      </div>
      
      {/* Modal */}
      <RegistrationModal />
    </div>
  );
};

export default RegistrationManagementPage;