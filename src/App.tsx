// src/App.tsx

import React from "react";
import { Routes, Route } from "react-router-dom";

// Layouts
import StudentLayout from "./components/layout/StudentLayout";

// Admin Pages
import AdminRoutes from "./pages/admin/AdminRoutes";

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

const App= () => {
  return (
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />


      <Route path="/admin/*" element={<AdminRoutes />} />


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

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
