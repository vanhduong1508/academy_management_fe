// src/pages/admin/CourseStructureAdminPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAdminCoursesPageApi } from "../../api/admin/admin-courses.api";
import {
  getCourseStructureApi,
  addChapterApi,
  addLessonApi,
} from "../../api/admin/admin-course-structure.api";

import type {
  Course,
  PageResponse,
  CourseStructureResponse,
  Chapter,
} from "../../types/models/course.types";

import styles from "../../styles/AdminCourseStructurePage.module.css";

export default function CourseStructureAdminPage() {
  const [searchParams] = useSearchParams();
  const initialCourseId = Number(searchParams.get("courseId"));

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [coursesPage, setCoursesPage] = useState<PageResponse<Course> | null>(
    null
  );
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const [structure, setStructure] = useState<CourseStructureResponse | null>(
    null
  );

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingStructure, setLoadingStructure] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [savingChapter, setSavingChapter] = useState(false);

  const [lessonForms, setLessonForms] = useState<
    Record<number, { title: string; type: string }>
  >({});
  const [savingLessonId, setSavingLessonId] = useState<number | null>(null);

  const courses = coursesPage?.content ?? [];
  const totalPages = coursesPage?.totalPages ?? 1;

  const fetchStructure = async (courseId: number) => {
    try {
      setLoadingStructure(true);
      setError(null);
      const data = await getCourseStructureApi(courseId);
      setStructure(data);
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Không tải được lộ trình khóa học (chapters/lessons)."
      );
      setStructure(null);
    } finally {
      setLoadingStructure(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);
      setError(null);
      const data = await getAdminCoursesPageApi(page, size);
      setCoursesPage(data);

      if (!selectedCourse && data.content.length > 0) {
        if (initialCourseId) {
          const found = data.content.find((c) => c.id === initialCourseId);
          if (found) {
            setSelectedCourse(found);
            fetchStructure(found.id);
            return;
          }
        }
        const first = data.content[0];
        setSelectedCourse(first);
        fetchStructure(first.id);
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Không tải được danh sách khóa học cho lộ trình."
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setStructure(null);
    fetchStructure(course.id);
  };

  const handleAddChapter = async () => {
    if (!selectedCourse) return;
    if (!newChapterTitle.trim()) {
      alert("Nhập tiêu đề chương trước đã");
      return;
    }
    try {
      setSavingChapter(true);
      const chapter = await addChapterApi(selectedCourse.id, {
        title: newChapterTitle.trim(),
      });

      setStructure((prev) =>
        prev
          ? {
              ...prev,
              chapters: [...prev.chapters, chapter],
            }
          : prev
      );
      setNewChapterTitle("");
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Thêm chương thất bại");
    } finally {
      setSavingChapter(false);
    }
  };

  const handleLessonFormChange = (
    chapterId: number,
    field: "title" | "type",
    value: string
  ) => {
    setLessonForms((prev) => ({
      ...prev,
      [chapterId]: {
        title: prev[chapterId]?.title ?? "",
        type: prev[chapterId]?.type ?? "VIDEO",
        [field]: value,
      },
    }));
  };

  const handleAddLesson = async (chapter: Chapter) => {
    if (!selectedCourse) return;
    const form = lessonForms[chapter.id] || { title: "", type: "VIDEO" };

    if (!form.title.trim()) {
      alert("Nhập tiêu đề bài học trước đã");
      return;
    }

    try {
      setSavingLessonId(chapter.id);
      const lesson = await addLessonApi(chapter.id, {
        title: form.title.trim(),
        type: form.type || null,
      });

      setStructure((prev) =>
        prev
          ? {
              ...prev,
              chapters: prev.chapters.map((c) =>
                c.id === chapter.id
                  ? { ...c, lessons: [...c.lessons, lesson] }
                  : c
              ),
            }
          : prev
      );

      setLessonForms((prev) => ({
        ...prev,
        [chapter.id]: { title: "", type: form.type },
      }));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Thêm bài học thất bại");
    } finally {
      setSavingLessonId(null);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Lộ trình khóa học</h2>
          <p className={styles.subtitle}>
            Chọn khóa học bên trái, sau đó thêm/sắp xếp chương và bài học cho
            lộ trình.
          </p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        {/* BẢNG KHÓA HỌC BÊN TRÁI */}
        <div className={styles.tableWrapper}>
          {loadingCourses && !coursesPage ? (
            <p className={styles.infoText}>Đang tải danh sách khóa học...</p>
          ) : courses.length === 0 ? (
            <p className={styles.infoText}>Chưa có khóa học nào.</p>
          ) : (
            <>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Khóa học</th>
                    <th className={styles.thRight}>Chọn</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => {
                    const isSelected = selectedCourse?.id === c.id;
                    return (
                      <tr
                        key={c.id}
                        className={`${styles.tr} ${
                          isSelected ? styles.trSelected : ""
                        }`}
                      >
                        <td className={styles.td}>
                          <div className={styles.cellMain}>
                            <span className={styles.cellTitle}>{c.title}</span>
                            <span className={styles.cellSub}>
                              ID: {c.id} – Mã: {c.code}
                            </span>
                          </div>
                        </td>
                        <td className={styles.tdRight}>
                          <button
                            className={styles.selectButton}
                            onClick={() => handleSelectCourse(c)}
                          >
                            {isSelected ? "Đang xem" : "Xem lộ trình"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className={styles.pagination}>
                <span>
                  Trang {page + 1}/{totalPages || 1}
                </span>
                <button
                  className={styles.pageButton}
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Trước
                </button>
                <button
                  className={styles.pageButton}
                  disabled={page + 1 >= totalPages}
                  onClick={() =>
                    setPage((p) =>
                      totalPages > 0 ? Math.min(totalPages - 1, p + 1) : p
                    )
                  }
                >
                  Sau
                </button>
              </div>
            </>
          )}
        </div>

        {/* PANEL LỘ TRÌNH BÊN PHẢI */}
        <div className={styles.detailPanel}>
          {!selectedCourse ? (
            <p className={styles.detailEmpty}>
              Chọn một khóa học ở bảng bên trái để xem và chỉnh sửa lộ trình.
            </p>
          ) : loadingStructure && !structure ? (
            <p className={styles.detailEmpty}>Đang tải lộ trình...</p>
          ) : !structure ? (
            <p className={styles.detailEmpty}>
              Không lấy được lộ trình cho khóa học này.
            </p>
          ) : (
            <>
              <div className={styles.courseHeader}>
                <h3 className={styles.detailTitle}>{structure.title}</h3>
                <p className={styles.detailSub}>
                  {structure.description || "Chưa có mô tả khóa học."}
                </p>
              </div>

              <div className={styles.addChapterForm}>
                <h4 className={styles.sectionTitle}>Thêm chương mới</h4>
                <div className={styles.addChapterRow}>
                  <input
                    className={styles.input}
                    placeholder="VD: Chương 1 - Giới thiệu"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                  />
                  <button
                    className={styles.buttonPrimary}
                    onClick={handleAddChapter}
                    disabled={savingChapter}
                  >
                    {savingChapter ? "Đang thêm..." : "Thêm chương"}
                  </button>
                </div>
              </div>

              <div className={styles.chapterList}>
                {structure.chapters.length === 0 ? (
                  <p className={styles.detailEmpty}>
                    Chưa có chương nào cho khóa học này.
                  </p>
                ) : (
                  structure.chapters.map((chapter) => {
                    const lessonForm =
                      lessonForms[chapter.id] || {
                        title: "",
                        type: "VIDEO",
                      };
                    const isSavingLesson = savingLessonId === chapter.id;

                    return (
                      <div
                        key={chapter.id}
                        className={styles.chapterCard}
                      >
                        <div className={styles.chapterTitleRow}>
                          <span className={styles.chapterTitle}>
                            {chapter.title}
                          </span>
                          <span className={styles.chapterMeta}>
                            {chapter.lessons.length} bài học
                          </span>
                        </div>

                        <ul className={styles.lessonsList}>
                          {chapter.lessons.map((lesson) => (
                            <li
                              key={lesson.id}
                              className={styles.lessonItem}
                            >
                              <span className={styles.lessonTitle}>
                                {lesson.title}
                              </span>
                              <span className={styles.lessonType}>
                                {lesson.type || "UNKNOWN"}
                              </span>
                            </li>
                          ))}
                          {chapter.lessons.length === 0 && (
                            <li className={styles.lessonEmpty}>
                              Chưa có bài học nào trong chương này.
                            </li>
                          )}
                        </ul>

                        <div className={styles.addLessonForm}>
                          <input
                            className={styles.input}
                            placeholder="Tiêu đề bài học mới"
                            value={lessonForm.title}
                            onChange={(e) =>
                              handleLessonFormChange(
                                chapter.id,
                                "title",
                                e.target.value
                              )
                            }
                          />
                          <select
                            className={styles.select}
                            value={lessonForm.type}
                            onChange={(e) =>
                              handleLessonFormChange(
                                chapter.id,
                                "type",
                                e.target.value
                              )
                            }
                          >
                            <option value="VIDEO">VIDEO</option>
                            <option value="DOCUMENT">DOCUMENT</option>
                            <option value="QUIZ">QUIZ</option>
                          </select>
                          <button
                            className={styles.buttonSecondary}
                            onClick={() => handleAddLesson(chapter)}
                            disabled={isSavingLesson}
                          >
                            {isSavingLesson ? "Đang thêm..." : "Thêm bài học"}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
