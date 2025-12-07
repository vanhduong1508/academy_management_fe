import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCourseStructureApi } from "../../api/student/course.api";
import { completeLessonApi, getEnrollmentProgressApi } from "../../api/student/progress.api";
import type { CourseStructureResponse, LessonResponse } from "../../types/student/course.types";
import type { EnrollmentProgressResponse } from "../../types/student/progress.types";
import styles from "../../styles/user/UserProgress.module.css";

const Learning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get enrollmentId from location state (passed from MyCourses)
  const enrollmentId = location.state?.enrollmentId as number | undefined;

  const [structure, setStructure] = useState<CourseStructureResponse | null>(null);
  const [progress, setProgress] = useState<EnrollmentProgressResponse | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchData(Number(courseId));
      if (enrollmentId) {
        fetchProgress(enrollmentId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, enrollmentId]);

  const fetchData = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCourseStructureApi(id);
      setStructure(res);
      
      // Set first lesson as default
      if (res.chapters.length > 0 && res.chapters[0].lessons.length > 0) {
        setCurrentLesson(res.chapters[0].lessons[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được dữ liệu khóa học.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (enrollId: number) => {
    try {
      const res = await getEnrollmentProgressApi(enrollId);
      setProgress(res);
    } catch (err: any) {
      console.error("Could not fetch progress:", err);
    }
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || !enrollmentId) {
      alert("Thông tin không đủ để hoàn thành bài học.");
      return;
    }

    try {
      setCompleting(true);
      await completeLessonApi(currentLesson.id, { enrollmentId });
      alert("Đã hoàn thành bài học!");
      
      // Refresh progress
      await fetchProgress(enrollmentId);
      
      // Find next lesson
      if (structure) {
        let found = false;
        for (const chapter of structure.chapters) {
          for (let i = 0; i < chapter.lessons.length; i++) {
            if (chapter.lessons[i].id === currentLesson.id && i < chapter.lessons.length - 1) {
              setCurrentLesson(chapter.lessons[i + 1]);
              found = true;
              break;
            }
          }
          if (found) break;
        }
        // If no next lesson in current chapter, go to first lesson of next chapter
        if (!found) {
          const currentChapterIndex = structure.chapters.findIndex((ch) =>
            ch.lessons.some((l) => l.id === currentLesson.id)
          );
          if (currentChapterIndex >= 0 && currentChapterIndex < structure.chapters.length - 1) {
            const nextChapter = structure.chapters[currentChapterIndex + 1];
            if (nextChapter.lessons.length > 0) {
              setCurrentLesson(nextChapter.lessons[0]);
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Hoàn thành bài học thất bại.");
    } finally {
      setCompleting(false);
    }
  };

  const extractYoutubeId = (url: string | null): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.infoText}>Đang tải dữ liệu khóa học...</p>
      </div>
    );
  }

  if (error || !structure || !currentLesson) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || "Không tìm thấy khóa học."}</p>
        <button
          className={styles.button}
          onClick={() => navigate("/student/my-courses")}
        >
          Quay lại khóa học của tôi
        </button>
      </div>
    );
  }

  if (!enrollmentId) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>
          Không tìm thấy thông tin đăng ký. Vui lòng quay lại và chọn khóa học từ danh sách.
        </p>
        <button
          className={styles.button}
          onClick={() => navigate("/student/my-courses")}
        >
          Quay lại
        </button>
      </div>
    );
  }

  const youtubeId = extractYoutubeId(currentLesson.urlVid);
  const progressPercentage = progress?.progressPercentage || 0;

  return (
    <div className={styles.learningContainer}>
      <div className={styles.learningHeader}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/student/my-courses")}
        >
          ← Quay lại
        </button>
        <h2 className={styles.courseTitle}>{structure.title}</h2>
        {progress && (
          <div className={styles.progressInfo}>
            <span>Tiến độ: {progressPercentage.toFixed(1)}%</span>
            <div className={styles.progressBar}>
              <div
                className={styles.progressInner}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      <div className={styles.learningContent}>
        {/* Video/Content Area */}
        <div className={styles.videoArea}>
          {currentLesson.type === "VIDEO" && youtubeId ? (
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title={currentLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className={styles.videoPlayer}
            />
          ) : currentLesson.type === "VIDEO" && currentLesson.urlVid ? (
            <iframe
              width="100%"
              height="100%"
              src={currentLesson.urlVid}
              title={currentLesson.title}
              frameBorder="0"
              allowFullScreen
              className={styles.videoPlayer}
            />
          ) : (
            <div className={styles.contentPlaceholder}>
              <p>Nội dung dạng: {currentLesson.type}</p>
              {currentLesson.urlVid && (
                <a href={currentLesson.urlVid} target="_blank" rel="noopener noreferrer">
                  Mở liên kết
                </a>
              )}
            </div>
          )}

          <div className={styles.lessonHeader}>
            <h3 className={styles.lessonTitle}>{currentLesson.title}</h3>
            <button
              className={styles.completeButton}
              onClick={handleLessonComplete}
              disabled={completing}
            >
              {completing ? "Đang xử lý..." : "Hoàn thành bài học"}
            </button>
          </div>
        </div>

        {/* Sidebar with lessons */}
        <div className={styles.lessonsSidebar}>
          <h3 className={styles.sidebarTitle}>Nội dung khóa học</h3>
          <div className={styles.chaptersList}>
            {structure.chapters.map((chapter, chapterIndex) => (
              <div key={chapter.id} className={styles.chapterBlock}>
                <div className={styles.chapterHeader}>
                  Chương {chapterIndex + 1}: {chapter.title}
                </div>
                <ul className={styles.lessonsList}>
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <li
                      key={lesson.id}
                      className={`${styles.lessonItem} ${
                        currentLesson.id === lesson.id ? styles.lessonItemActive : ""
                      }`}
                      onClick={() => setCurrentLesson(lesson)}
                    >
                      <span className={styles.lessonIndex}>
                        Bài {lessonIndex + 1}:
                      </span>
                      <span className={styles.lessonTitleText}>{lesson.title}</span>
                      {lesson.type && (
                        <span className={styles.lessonType}>{lesson.type}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
