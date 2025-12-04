// src/components/student/CourseCard.tsx
import React from "react";
import type { Course } from "../../types/models/course.types";
import CourseEnrollButton from "./CourseEnrollButton";

type Props = {
  course: Course;
};

const CourseCard: React.FC<Props> = ({ course }) => {
  return (
    <div className="course-card">
      <h3>{course.title}</h3>
      {course.description && <p>{course.description}</p>} 
      <p>
        <strong>Giá:</strong>{" "}
        {course.price != null ? `${course.price.toLocaleString()} VND` : "Miễn phí"}
      </p>
      {/* nút mua / đăng ký */}
      <CourseEnrollButton courseId={course.id} />
    </div>
  );
};

export default CourseCard;
