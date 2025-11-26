import axios from "axios";

// Định nghĩa URL cơ bản
const API_URL = "http://localhost:7880/api/certificates";
const ENROLLMENT_API_URL = "http://localhost:7880/api/enrollments";

// Kiểu dữ liệu cho Enrollment đã hoàn thành (dùng trong Form)
export interface CompletedEnrollment {
  id: number;
  studentName: string;
  courseName: string;
}

// 1. Lấy danh sách Enrollment đã hoàn thành (dùng cho dropdown trong Form)
export const getCompletedEnrollments = async (): Promise<CompletedEnrollment[]> => {
    // ⭐ Gọi Backend API /api/enrollments/completed
    const res = await axios.get(`${ENROLLMENT_API_URL}/completed`);
    return res.data; 
};

// 2. Lấy tất cả chứng chỉ
export const getAllCertificates = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// 3. Tạo chứng chỉ mới
export const createCertificate = async (payload: { enrollmentId: number; status: string; notes: string }) => {
  const res = await axios.post(API_URL, payload);
  return res.data;
};

// 4. Thu hồi chứng chỉ
export const revokeCertificate = async (id: number) => {
  const res = await axios.put(`${API_URL}/revoke/${id}`);
  return res.data;
};

export const getCertificateById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};