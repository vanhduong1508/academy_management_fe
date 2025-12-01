// src/pages/student/CourseListPage.tsx
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchCourses } from '../../redux/slices/course.slice';
import CourseCard from '../../components/student/CourseCard';

const CourseListPage = () => {
  const dispatch = useAppDispatch();
  const { items: courses, loading, error } = useAppSelector((s) => s.courses);

  useEffect(() => {
    dispatch(fetchCourses({ page: 0, size: 12 }));
  }, [dispatch]);

  return (
    <div>
      <h1>Danh sách khoá học</h1>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
};

export default CourseListPage;
