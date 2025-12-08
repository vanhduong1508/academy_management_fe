import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCourseStructureApi } from "../../api/student/course.api";
import {
  completeLessonApi,
  getEnrollmentProgressApi,
} from "../../api/student/progress.api";

import type {
  CourseStructureResponse,
  LessonResponse,
} from "../../types/student/course.types";
import type { EnrollmentProgressResponse } from "../../types/student/progress.types";

import styles from "../../styles/user/UserProgress.module.css";

const Learning = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const enrollmentId = location.state?.enrollmentId as number | undefined;

  const [structure, setStructure] =
    useState<CourseStructureResponse | null>(null);
  const [progress, setProgress] =
    useState<EnrollmentProgressResponse | null>(null);
  const [currentLesson, setCurrentLesson] =
    useState<LessonResponse | null>(null);

  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractYoutubeId = (url: string | null): string | null => {
    if (!url) return null;
    const trimmed = url.trim();

    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      return trimmed; 
    }

    try {
      const parsed = new URL(trimmed);

      if (parsed.hostname === "youtu.be") {
        return parsed.pathname.substring(1);
      }

      const v = parsed.searchParams.get("v");
      if (v) return v;

      const parts = parsed.pathname.split("/");
      const embedIndex = parts.indexOf("embed");
      if (embedIndex !== -1 && parts[embedIndex + 1]) {
        return parts[embedIndex + 1];
      }

      return null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    if (courseId) {
      const id = Number(courseId);
      fetchStructure(id);
      if (enrollmentId) {
        fetchProgress(enrollmentId);
      }
    }
  }, [courseId, enrollmentId]);

  const fetchStructure = async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getCourseStructureApi(id);
      setStructure(res);

      if (res.chapters.length > 0 && res.chapters[0].lessons.length > 0) {
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

  const canAccessLesson = (lesson: LessonResponse): boolean => {
    if (!structure || !progress) return false;

    const allLessons: LessonResponse[] = [];

    structure.chapters.forEach((ch) =>
      ch.lessons.forEach((l) => allLessons.push(l))
    );

    const index = allLessons.findIndex((l) => l.id === lesson.id);
    if (index === -1) return false;

    const unlockedCount = progress.completedVideoLessons + 1;

    return index < unlockedCount;
  };

  const handleLessonComplete = async () => {
    if (!currentLesson || !enrollmentId) {
      alert("Thiếu thông tin để hoàn thành bài học.");
      return;
    }

    try {
      setCompleting(true);
      await completeLessonApi(currentLesson.id, { enrollmentId });

      alert("✅ Hoàn thành bài học!");

      await fetchProgress(enrollmentId);
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Lỗi khi hoàn thành bài.");
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p>Đang tải khóa học...</p>
      </div>
    );
  }

  if (error || !structure || !currentLesson) {
    return (
      <div className={styles.page}>
        <p>{error || "Không tìm thấy dữ liệu."}</p>
        <button onClick={() => navigate("/student/my-courses")}>
          Quay lại
        </button>
      </div>
    );
  }

  if (!enrollmentId) {
    return (
      <div className={styles.page}>
        <p>Không tìm thấy thông tin đăng ký.</p>
        <button onClick={() => navigate("/student/my-courses")}>
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
        <div className={styles.videoArea}>
          {currentLesson.type === "VIDEO" &&
          canAccessLesson(currentLesson) ? (
            youtubeId ? (
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
            ) : (
              <div className={styles.contentPlaceholder}>
                <p>Không tìm được video hợp lệ.</p>
              </div>
            )
          ) : currentLesson.type === "VIDEO" ? (
            <div className={styles.contentPlaceholder}>
              <p>🔒 Bài học này đang bị khóa</p>
            </div>
          ) : (
            <div className={styles.contentPlaceholder}>
              <p>Nội dung tài liệu</p>
              {currentLesson.urlVid && (
                <pre style={{ whiteSpace: "pre-wrap" }}>
                  {currentLesson.urlVid}
                </pre>
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

        <div className={styles.lessonsSidebar}>
          <h3 className={styles.sidebarTitle}>Nội dung khóa học</h3>

          {structure.chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className={styles.chapterBlock}>
              <div className={styles.chapterHeader}>
                Chương {chapterIndex + 1}: {chapter.title}
              </div>

              <ul className={styles.lessonsList}>
                {chapter.lessons.map((lesson, lessonIndex) => {
                  const locked = !canAccessLesson(lesson);

                  return (
                    <li
                      key={lesson.id}
                      className={`${styles.lessonItem} ${
                        currentLesson.id === lesson.id
                          ? styles.lessonItemActive
                          : ""
                      } ${locked ? styles.lessonItemLocked : ""}`}
                      onClick={() => {
                        if (!locked) {
                          setCurrentLesson(lesson);
                        }
                      }}
                    >
                      <span className={styles.lessonIndex}>
                        Bài {lessonIndex + 1}:
                      </span>
                      <span className={styles.lessonTitleText}>
                        {lesson.title}
                      </span>
                      <span className={styles.lessonType}>
                        {lesson.type}
                      </span>
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
