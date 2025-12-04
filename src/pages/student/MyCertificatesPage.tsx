// src/pages/student/MyCertificatesPage.tsx
import React, { useEffect, useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { getMyCertificatesApi } from "../../api/student/student-certificates.api";
import type { Certificate } from "../../types/models/certificate.types";

const MyCertificatesPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [certs, setCerts] = useState<Certificate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.studentId) return;
      const data = await getMyCertificatesApi(user.studentId);
      setCerts(data);
    };
    fetchData();
  }, [user?.studentId]);

  return (
    <div>
      <h2>Chứng chỉ của tôi</h2>
      <table style={{ width: "100%", marginTop: 16 }}>
        <thead>
          <tr>
            <th>Mã chứng chỉ</th>
            <th>Khóa học</th>
            <th>Ngày cấp</th>
          </tr>
        </thead>
        <tbody>
          {certs.map((c) => (
            <tr key={c.id}>
              <td>{c.certificateNo}</td>
              <td>{c.courseTitle}</td>
              <td>{c.issuedAt}</td>
            </tr>
          ))}
          {certs.length === 0 && (
            <tr>
              <td colSpan={3}>Bạn chưa được cấp chứng chỉ nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyCertificatesPage;
