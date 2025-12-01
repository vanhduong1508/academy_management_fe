// src/api/auth.api.ts

import { axiosInstance } from './index';
import { UserSimpleResponse } from '../types';
import {
  Course,
  CourseFormPayload,
  CourseStructure,
  PageResponse,
} from '../types';

// Đăng ký học viên
export const registerStudent = (data: {
    username: string;
    password: string;
    email?: string;
    phone?: string;
}) => {
    // BE: POST /api/auth/register
    return axiosInstance.post<UserSimpleResponse>('/auth/register', data);
};

// Đăng nhập
export const login = (data: { username: string; password: string }) => {
    // BE: POST /api/auth/login
    return axiosInstance.post<UserSimpleResponse>('/auth/login', data);
};

// ================== COURSE – PUBLIC / ADMIN ==================

// GET /courses?page&size  (Public/Admin)
export const getCourses = (page = 0, size = 10) => {
  return axiosInstance.get<PageResponse<Course>>('/courses', {
    params: { page, size },
  });
};

// GET /courses/{id} (Public/Admin) – nếu cần chi tiết course
export const getCourseById = (id: number) => {
  return axiosInstance.get<Course>(`/courses/${id}`);
};

// GET /courses/{id}/structure (Student/Admin)
export const getCourseStructure = (id: number) => {
  return axiosInstance.get<CourseStructure>(`/courses/${id}/structure`);
};

// POST /admin/courses – tạo course (Admin)
export const createCourse = (payload: CourseFormPayload) => {
  return axiosInstance.post<Course>('/admin/courses', payload);
};

// PUT /admin/courses/{id} – update course (Admin)
export const updateCourse = (id: number, payload: CourseFormPayload) => {
  return axiosInstance.put<Course>(`/admin/courses/${id}`, payload);
};

// POST /admin/courses/{courseId}/chapters – thêm chapter (Admin)
export const createChapter = (courseId: number, title: string) => {
  return axiosInstance.post(`/admin/courses/${courseId}/chapters`, { title });
};

// POST /admin/chapters/{chapterId}/lessons – thêm lesson (Admin)
export const createLesson = (
  chapterId: number,
  payload: { title: string; type: string }
) => {
  return axiosInstance.post(`/admin/chapters/${chapterId}/lessons`, payload);
};