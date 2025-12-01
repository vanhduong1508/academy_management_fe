// src/components/student/CourseCard.tsx
import type { Course } from '../../types/models/course.types';
import CourseEnrollButton from './CourseEnrollButton';

type Props = {
  course: Course;
};

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      <p>{course.content}</p>
      <p>
        Thời gian: {course.startDate} - {course.endDate}
      </p>
      <p>Trạng thái: {course.status}</p>

      <CourseEnrollButton courseId={course.id} courseTitle={course.title} />
    </div>
  );
};

export default CourseCard;
