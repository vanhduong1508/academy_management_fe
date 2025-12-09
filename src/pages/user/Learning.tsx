import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCourseStructureApi } from "../../api/student/course.api";
import { completeLessonApi, getEnrollmentProgressApi } from "../../api/student/progress.api";
import type { CourseStructureResponse, LessonResponse } from "../../types/student/course.types";
import type { EnrollmentProgressResponse } from "../../types/student/progress.types";
import YouTube from "react-youtube"; // Thư viện YouTube
import styles from "../../styles/user/UserProgress.module.css";

const Learning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const enrollmentId = location.state?.enrollmentId as number | undefined;

  const [structure, setStructure] = useState<CourseStructureResponse | null>(null);
  const [progress, setProgress] = useState<EnrollmentProgressResponse | null>(null);
  const [currentLesson, setCurrentLesson] = useState<LessonResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allLessons = structure?.chapters.flatMap(ch => ch.lessons) || [];
  const currentLessonIndex = currentLesson ? allLessons.findIndex(l => l.id === currentLesson.id) : -1;
  const isLastLesson = currentLessonIndex === allLessons.length - 1;

  const extractYoutubeId = (url: string | null): string | null => {
    if (!url) return null;
    const trimmed = url.trim();
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return trimmed;
    try {
      const parsed = new URL(trimmed);
      if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const parts = parsed.pathname.split("/");
      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1 && parts[embedIndex + 1]) return parts[embedIndex + 1];
      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchStructure(Number(courseId));
      if (enrollmentId) fetchProgress(enrollmentId);
    }
  }, [courseId, enrollmentId]);

  const fetchStructure = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await getCourseStructureApi(id);
      setStructure(res);
      if (res.chapters.length && res.chapters[0].lessons.length) {
        setCurrentLesson(res.chapters[0].lessons[0]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được khóa học.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (enrollId: number) => {
    try {
      const res = await getEnrollmentProgressApi(enrollId);
      setProgress(res);
    } catch (err) {
      console.error("Fetch progress error:", err);
    }
  };

  const canAccessLesson = (lesson: LessonResponse) => {
    if (!progress || !allLessons.length) return false;
    const index = allLessons.findIndex(l => l.id === lesson.id);
    return index <= progress.completedVideoLessons;
  };

  // Hoàn thành bài học và cập nhật tiến độ
  const handleLessonComplete = async () => {
    if (!currentLesson || !enrollmentId) return;
    try {
      setCompleting(true);

      await completeLessonApi(currentLesson.id, { enrollmentId });

      // Tăng completedVideoLessons ngay lập tức
      setProgress(prev => {
        if (!prev) return prev;
        const index = allLessons.findIndex(l => l.id === currentLesson.id);
        return {
          ...prev,
          completedVideoLessons: Math.max(prev.completedVideoLessons, index + 1),
          progressPercentage: ((Math.max(prev.completedVideoLessons, index + 1) / allLessons.length) * 100)
        };
      });

      if (currentLessonIndex < allLessons.length - 1) {
        setCurrentLesson(allLessons[currentLessonIndex + 1]);
      } else {
        alert(" Hoàn thành khóa học!");
      }
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Lỗi khi hoàn thành bài.");
    } finally {
      setCompleting(false);
    }
  };


  if (loading) return <div className={styles.page}><p>Đang tải khóa học...</p></div>;
  if (error || !structure || !currentLesson)
    return (
      <div className={styles.page}>
        <p>{error || "Không tìm thấy dữ liệu."}</p>
        <button onClick={() => navigate("/student/my-courses")}>Quay lại</button>
      </div>
    );
  if (!enrollmentId)
    return (
      <div className={styles.page}>
        <p>Không tìm thấy thông tin đăng ký.</p>
        <button onClick={() => navigate("/student/my-courses")}>Quay lại</button>
      </div>
    );

  const youtubeId = extractYoutubeId(currentLesson.urlVid);
  const progressPercentage = progress?.progressPercentage || 0;

  return (
    <div className={styles.learningContainer}>
      <div className={styles.learningHeader}>
        <button className={styles.backButton} onClick={() => navigate("/student/my-courses")}>← Quay lại</button>
        <h2 className={styles.courseTitle}>{structure.title}</h2>
        {progress && (
          <div className={styles.progressInfo}>
            <span>Tiến độ: {progressPercentage.toFixed(1)}%</span>
            <div className={styles.progressBar}>
              <div className={styles.progressInner} style={{ width: `${progressPercentage}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className={styles.learningContent}>
        <div className={styles.videoArea}>
          {currentLesson.type === "VIDEO" && canAccessLesson(currentLesson) ? (
            youtubeId ? (
              <YouTube
                videoId={youtubeId}
                opts={{ width: "100%", height: "100%" }}
                onEnd={handleLessonComplete} // Tự động mở khóa khi video kết thúc
                className={styles.videoPlayer}
              />
            ) : (
              <div className={styles.contentPlaceholder}><p>Không tìm được video hợp lệ.</p></div>
            )
          ) : currentLesson.type === "VIDEO" ? (
            <div className={styles.contentPlaceholder}><p>Bài học này đang bị khóa</p></div>
          ) : (
            <div className={styles.contentPlaceholder}>
              <p>Nội dung tài liệu</p>
              {currentLesson.urlVid && <pre style={{ whiteSpace: "pre-wrap" }}>{currentLesson.urlVid}</pre>}
            </div>
          )}

          <div className={styles.lessonHeader}>
            <h3 className={styles.lessonTitle}>{currentLesson.title}</h3>
            {!isLastLesson && (
              <button className={styles.completeButton} onClick={handleLessonComplete} disabled={completing}>
                {completing ? "Đang xử lý..." : "Hoàn thành bài học"}
              </button>
            )}
            {isLastLesson && progress?.completedVideoLessons === allLessons.length && (
              <button className={styles.completeButton} onClick={() => alert(" Hoàn thành khóa học!")}>
                 Hoàn thành khóa học
              </button>
            )}
          </div>
        </div>

        <div className={styles.lessonsSidebar}>
          <h3 className={styles.sidebarTitle}>Nội dung khóa học</h3>
          {structure.chapters.map((chapter, idx) => (
            <div key={chapter.id} className={styles.chapterBlock}>
              <div className={styles.chapterHeader}>Chương {idx + 1}: {chapter.title}</div>
              <ul className={styles.lessonsList}>
                {chapter.lessons.map((lesson, lessonIdx) => {
                  const locked = !canAccessLesson(lesson);
                  return (
                    <li
                      key={lesson.id}
                      className={`${styles.lessonItem} ${currentLesson.id === lesson.id ? styles.lessonItemActive : ""} ${locked ? styles.lessonItemLocked : ""}`}
                      onClick={() => !locked && setCurrentLesson(lesson)}
                    >
                      <span className={styles.lessonIndex}>Bài {lessonIdx + 1}:</span>
                      <span className={styles.lessonTitleText}>{lesson.title}</span>
                      <span className={styles.lessonType}>{lesson.type}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learning;
