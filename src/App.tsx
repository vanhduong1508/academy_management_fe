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
import AdminStatisticsPage from "./pages/admin/AdminStatisticsPage";

// Student/User Pages
import Home from "./pages/user/Home";
import Courses from "./pages/user/Courses";
import CourseDetail from "./pages/user/CourseDetail";
import MyCourses from "./pages/user/MyCourses";
import Learning from "./pages/user/Learning";
import Orders from "./pages/user/Orders";
import Profile from "./pages/user/Profile";
import MyCertificates from "./pages/user/MyCertificates";

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
        <Route path="statistics" element={<AdminStatisticsPage />} />
      </Route>

      {/* ====================== STUDENT/USER ROUTES ====================== */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="learning/:courseId" element={<Learning />} />
        <Route path="orders" element={<Orders />} />
        <Route path="profile" element={<Profile />} />
        <Route path="certificates" element={<MyCertificates />} />
      </Route>

      {/* ====================== FALLBACK ====================== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
