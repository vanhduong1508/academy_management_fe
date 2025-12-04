import React from "react";
import { Routes, Route } from "react-router-dom";

import AdminLayout from "../../components/layout/AdminLayout";

import DashboardPage from "./DashboardPage";
import CourseManagementPage from "./CourseManagementPage";
import StudentManagementPage from "./StudentManagementPage";
import EnrollmentAdminPage from "./EnrollmentAdminPage";
import OrderManagementPage from "./OrderManagementPage";
import CertificateManagementPage from "./CertificateManagementPage";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="courses" element={<CourseManagementPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="enrollments" element={<EnrollmentAdminPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="certificates" element={<CertificateManagementPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
