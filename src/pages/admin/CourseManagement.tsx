// src/pages/admin/CourseManagement.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useAuthGuard from '../../hooks/useAuthGuard';
import {
  getCourses,
  createCourse,
  updateCourse,
} from '../../api/admin.api';
import {
  Course,
  CourseFormPayload,
  PageResponse,
} from '../../types';
import CourseFormModal from '../../components/admin/CourseFormModal';
import Button from '../../components/common/Button/Button';

const CourseManagement: React.FC = () => {
  // Chỉ cho admin
  const allowed = useAuthGuard('ADMIN');

  const [pageData, setPageData] = useState<PageResponse<Course> | null>(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tạo khóa học');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const loadData = async (pageIndex: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await getCourses(pageIndex, size);
      setPageData(res.data);
      setPage(res.data.number);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Không tải được danh sách khóa học.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allowed) {
      loadData(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed]);

  const openCreateModal = () => {
    setEditingCourse(null);
    setModalTitle('Tạo khóa học');
    setIsModalOpen(true);
  };

  const openEditModal = (course: Course) => {
    setEditingCourse(course);
    setModalTitle('Cập nhật khóa học');
    setIsModalOpen(true);
  };

  const handleSubmitCourse = async (values: CourseFormPayload) => {
    if (editingCourse) {
      await updateCourse(editingCourse.id, values);
    } else {
      await createCourse(values);
    }
    await loadData(0);
  };

  const handlePrev = () => {
    if (page > 0) loadData(page - 1);
  };

  const handleNext = () => {
    if (pageData && page < pageData.totalPages - 1) {
      loadData(page + 1);
    }
  };

  if (!allowed) return null;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2>Quản lý Khóa học</h2>
        <Button variant="primary" onClick={openCreateModal}>
          + Tạo khóa học
        </Button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Đang tải...</p>}

      {pageData && (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Mã</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Tên</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Thời gian</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Trạng thái</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageData.content.map((c) => (
                <tr key={c.id}>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.id}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.code}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.title}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>
                    {c.startDate} – {c.endDate}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.status}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>
                    <Button
                      variant="secondary"
                      style={{ marginRight: 8 }}
                      onClick={() => openEditModal(c)}
                    >
                      Sửa
                    </Button>
                    <Link to={`/admin/courses/${c.id}/content`}>
                      Quản lý nội dung
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 16,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <button onClick={handlePrev} disabled={page === 0}>
              Trang trước
            </button>
            <span>
              Trang {page + 1}/{pageData.totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={pageData.totalPages === 0 || page === pageData.totalPages - 1}
            >
              Trang sau
            </button>
          </div>
        </>
      )}

      <CourseFormModal
        isOpen={isModalOpen}
        title={modalTitle}
        initialValues={
          editingCourse
            ? {
                title: editingCourse.title,
                startDate: editingCourse.startDate,
                endDate: editingCourse.endDate,
                content: editingCourse.content,
              }
            : undefined
        }
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitCourse}
      />
    </div>
  );
};

export default CourseManagement;
