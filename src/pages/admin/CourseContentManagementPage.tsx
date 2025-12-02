// src/pages/admin/CourseContentManagementPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useAuthGuard from '../../hooks/useAuthGuard';
import {
  getCourseById,
  getCourseStructure,
  createChapter,
  createLesson,
} from '../../api/admin.api';
import {
  Course,
  CourseStructure,
  ChapterStructure,
} from '../../types';
import CourseFormModal from '../../components/admin/CourseFormModal';
import LessonFormModal from '../../components/admin/LessonFormModal';
import Button from '../../components/common/Button/Button';

const CourseContentManagementPage: React.FC = () => {
  const allowed = useAuthGuard('ADMIN');
  const { id } = useParams<{ id: string }>();
  const courseId = Number(id);

  const [course, setCourse] = useState<Course | null>(null);
  const [structure, setStructure] = useState<CourseStructure | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  // modal thêm chapter
  const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
  const [chapterTitle, setChapterTitle] = useState('');

  // modal thêm lesson
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] =
    useState<ChapterStructure | null>(null);

  const loadData = async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    try {
      const [courseRes, structRes] = await Promise.all([
        getCourseById(courseId),
        getCourseStructure(courseId),
      ]);
      setCourse(courseRes.data);
      setStructure(structRes.data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          'Không tải được dữ liệu khóa học.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (allowed) {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowed, courseId]);

  const openChapterModal = () => {
    setChapterTitle('');
    setIsChapterModalOpen(true);
  };

  const handleCreateChapter = async () => {
    if (!chapterTitle.trim()) return;
    setMsg('');
    setError('');
    try {
      await createChapter(courseId, chapterTitle.trim());
      setMsg('Thêm chương mới thành công.');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Thêm chương thất bại.');
    }
  };

  const openLessonModal = (chapter: ChapterStructure) => {
    setSelectedChapter(chapter);
    setIsLessonModalOpen(true);
  };

  const handleCreateLesson = async (values: { title: string; type: string }) => {
    if (!selectedChapter) return;
    setMsg('');
    setError('');
    try {
      await createLesson(selectedChapter.id, values);
      setMsg('Thêm bài học mới thành công.');
      await loadData();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Thêm bài học thất bại.');
    }
  };

  if (!allowed) return null;
  if (!courseId) return <p>Thiếu id khóa học.</p>;
  if (loading && !course) return <p>Đang tải...</p>;
  if (error && !course) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2>Quản lý nội dung khóa học #{courseId}</h2>

      {course && (
        <div style={{ marginBottom: 16 }}>
          <p>
            <strong>{course.title}</strong> ({course.code})
          </p>
          <p>
            Thời gian: {course.startDate} – {course.endDate}
          </p>
          <p>{course.content}</p>
        </div>
      )}

      {msg && <p style={{ color: 'green' }}>{msg}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Button variant="primary" onClick={openChapterModal}>
          + Thêm chương
        </Button>
      </div>

      {/* Hiển thị structure */}
      <h3>Cấu trúc khóa học</h3>
      {structure && structure.chapters.length === 0 && (
        <p>Chưa có chương nào.</p>
      )}
      {structure && structure.chapters.length > 0 && (
        <ol>
          {structure.chapters.map((ch) => (
            <li key={ch.id} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <strong>{ch.title}</strong>
                <Button
                  variant="secondary"
                  onClick={() => openLessonModal(ch)}
                >
                  + Thêm bài học
                </Button>
              </div>
              {ch.lessons.length > 0 ? (
                <ul style={{ marginTop: 4 }}>
                  {ch.lessons.map((ls) => (
                    <li key={ls.id}>
                      {ls.title} ({ls.type})
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Chưa có bài học.</p>
              )}
            </li>
          ))}
        </ol>
      )}

      {/* Modal thêm Chapter – tái dùng CourseFormModal cho đỡ viết CSS,
          nhưng chỉ dùng 1 field title. Bạn cũng có thể viết modal riêng nếu thích. */}
      {isChapterModalOpen && (
        <CourseFormModal
          isOpen={isChapterModalOpen}
          title="Thêm Chương mới"
          initialValues={{
            title: chapterTitle,
            startDate: '',
            endDate: '',
            content: '',
          }}
          onClose={() => setIsChapterModalOpen(false)}
          onSubmit={async (values) => {
            chapterTitle !== values.title &&
              setChapterTitle(values.title);
            await createChapter(courseId, values.title);
            setMsg('Thêm chương mới thành công.');
            await loadData();
          }}
        />
      )}

      <LessonFormModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        onSubmit={handleCreateLesson}
      />
    </div>
  );
};

export default CourseContentManagementPage;
