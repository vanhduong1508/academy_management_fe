// src/pages/student/StudentRoutes.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentLayout from "../../components/layout/StudentLayout";
import useAuthGuard from "../../hooks/useAuthGuard";
import { UserRole } from "../../types";

import StudentDashboardPage from "./StudentDashboardPage";
import CourseListPage from "./CourseListPage";
import MyEnrollmentsPage from "./MyEnrollmentsPage";
import MyCertificatesPage from "./MyCertificatesPage";

const StudentRoutes = () => {
  useAuthGuard("STUDENT" as UserRole);

  return (
    <Routes>
      <Route element={<StudentLayout />}>
        <Route index element={<StudentDashboardPage />} />
        <Route path="courses" element={<CourseListPage />} />
        <Route path="my-courses" element={<MyEnrollmentsPage />} />
        <Route path="certificates" element={<MyCertificatesPage />} />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
