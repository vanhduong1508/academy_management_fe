// src/App.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import AdminLayout from "./components/layout/AdminLayout";
import StudentLayout from "./components/layout/StudentLayout";

// Admin Pages
import DashboardPage from "./pages/admin/DashboardPage";
import OrderManagementPage from "./pages/admin/OrderManagementPage";
import CourseManagementPage from "./pages/admin/CourseManagementPage";
import EnrollmentAdminPage from "./pages/admin/EnrollmentAdminPage";
import CertificateManagementPage from "./pages/admin/CertificateManagementPage";
import StudentManagementPage from "./pages/admin/StudentManagementPage";
import CourseStructureAdminPage from "./pages/admin/CourseStructureAdminPage";

// Student Pages
// import StudentDashboardPage from "./pages/student/StudentDashboardPage";
// import CourseListPage from "./pages/student/CourseListPage";
// import MyEnrollmentsPage from "./pages/student/MyEnrollmentsPage";
// import MyCertificatesPage from "./pages/student/MyCertificatesPage";

// Public pages
import HomePage from "./pages/public/HomePage";
import NotFoundPage from "./pages/public/NotFoundPage";

// Auth
import AuthPage from "./pages/Auth/AuthPage";

const App: React.FC = () => {
  return (
    <Routes>
      {/* ====================== PUBLIC ====================== */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* ====================== ADMIN ROUTES ====================== */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="courses" element={<CourseManagementPage />} />
        <Route path="students" element={<StudentManagementPage />} />
        <Route path="enrollments" element={<EnrollmentAdminPage />} />
        <Route path="course-structure" element={<CourseStructureAdminPage />} />
        <Route path="orders" element={<OrderManagementPage />} />
        <Route path="certificates" element={<CertificateManagementPage />} />
      </Route>

      {/* ====================== STUDENT ROUTES ======================
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="courses" element={<CourseListPage />} />
        <Route path="my-courses" element={<MyEnrollmentsPage />} />
        <Route path="certificates" element={<MyCertificatesPage />} />
      </Route> */}

      {/* ====================== FALLBACK ====================== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
