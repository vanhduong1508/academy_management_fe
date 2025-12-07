import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { getAdminCoursesPageApi } from "../../api/admin/admin-courses.api";
import {
  getCourseStructureApi,
  addChapterApi,
  addLessonApi,
} from "../../api/admin/admin-course-structure.api";

import type {
  CourseResponse,
  CourseStructureResponse,
  ChapterResponse,
  LessonResponse,
} from "../../types/admin/admin-course.types";
import type { PageResponse } from "../../types/shared/pagination.types";

import styles from "../../styles/AdminCourseStructurePage.module.css";

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();

  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    return null;
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
}

export default function CourseStructureAdminPage() {
  const [searchParams] = useSearchParams();
  const initialCourseId = Number(searchParams.get("courseId"));

  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [coursesPage, setCoursesPage] =
    useState<PageResponse<CourseResponse> | null>(null);

  const [selectedCourse, setSelectedCourse] =
    useState<CourseResponse | null>(null);

  const [structure, setStructure] = useState<CourseStructureResponse | null>(
    null
  );

  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingStructure, setLoadingStructure] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [savingChapter, setSavingChapter] = useState(false);

  // Form thêm bài học: nếu type=VIDEO dùng urlVid làm link; nếu DOCUMENT dùng urlVid lưu nội dung docs
  const [lessonForms, setLessonForms] = useState<
    Record<number, { title: string; type: "VIDEO" | "DOCUMENT"; urlVid: string }>
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

  const handleSelectCourse = (course: CourseResponse) => {
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
    field: "title" | "type" | "urlVid",
    value: string
  ) => {
    setLessonForms((prev) => ({
      ...prev,
      [chapterId]: {
        title: prev[chapterId]?.title ?? "",
        type: (prev[chapterId]?.type ?? "VIDEO") as "VIDEO" | "DOCUMENT",
        urlVid: prev[chapterId]?.urlVid ?? "",
        [field]: field === "type" ? (value as any) : value,
      },
    }));
  };

  const handleAddLesson = async (chapter: ChapterResponse) => {
    if (!selectedCourse) return;
    const form =
      lessonForms[chapter.id] || { title: "", type: "VIDEO", urlVid: "" };

    if (!form.title.trim()) {
      alert("Nhập tiêu đề bài học trước đã");
      return;
    }

    if (form.type === "VIDEO" && !form.urlVid.trim()) {
      alert("Bài VIDEO cần có link YouTube");
      return;
    }

    if (form.type === "DOCUMENT" && !form.urlVid.trim()) {
      alert("Bài DOCUMENT cần nội dung tài liệu hoặc link");
      return;
    }

    try {
      setSavingLessonId(chapter.id);

      let payloadUrl: string | null = null;

      if (form.type === "VIDEO") {
        const rawUrl = form.urlVid.trim();
        const extracted = extractYoutubeId(rawUrl);
        const videoId = extracted !== null ? extracted : rawUrl || null;
        payloadUrl = videoId;
      } else {
        // DOCUMENT: lưu nguyên text (link hoặc nội dung)
        payloadUrl = form.urlVid.trim() || null;
      }

      const payload = {
        title: form.title.trim(),
        type: form.type,
        urlVid: payloadUrl,
      };

      const lesson: LessonResponse = await addLessonApi(chapter.id, payload);

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
        [chapter.id]: { title: "", type: form.type, urlVid: "" },
      }));
    } catch (err: any) {
      console.error(err);
      alert(err?.response?.data?.message || "Thêm bài học thất bại");
    } finally {
      setSavingLessonId(null);
    }
  };

  const renderLesson = (lesson: LessonResponse) => {
    // Nếu là VIDEO => render iframe
    if (lesson.type === "VIDEO") {
      let videoId: string | null = null;
      if (lesson.urlVid) {
        const extracted = extractYoutubeId(lesson.urlVid);
        videoId = extracted !== null ? extracted : lesson.urlVid;
      }

      return (
        <li key={lesson.id} className={styles.lessonItem}>
          <div className={styles.lessonHeader}>
            <span className={styles.lessonTitle}>{lesson.title}</span>
            <span className={styles.lessonType}>VIDEO</span>
          </div>

          {videoId && (
            <div className={styles.lessonVideoWrapper}>
              <iframe
                className={styles.lessonIframe}
                width="420"
                height="236"
                src={`https://www.youtube.com/embed/${videoId}`}
                title={`Video bài học ${lesson.title}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </li>
      );
    }

    // DOCUMENT: hiển thị text/urlVid như tài liệu
    return (
      <li key={lesson.id} className={styles.lessonItem}>
        <div className={styles.lessonHeader}>
          <span className={styles.lessonTitle}>{lesson.title}</span>
          <span className={styles.lessonType}>DOCUMENT</span>
        </div>
        {lesson.urlVid && (
          <div className={styles.lessonDocWrapper}>
            <pre className={styles.lessonDocContent}>{lesson.urlVid}</pre>
          </div>
        )}
      </li>
    );
  };

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Lộ trình khóa học</h2>
          <p className={styles.subtitle}>
            Chọn khóa học bên trái, sau đó thêm chương / bài học. Nếu chọn VIDEO
            sẽ nhập link YouTube; nếu chọn DOCUMENT sẽ nhập nội dung tài liệu
            (hoặc link).
          </p>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.layout}>
        {/* DANH SÁCH KHÓA HỌC BÊN TRÁI */}
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
                        type: "VIDEO" as const,
                        urlVid: "",
                      };
                    const isSavingLesson = savingLessonId === chapter.id;

                    return (
                      <div key={chapter.id} className={styles.chapterCard}>
                        <div className={styles.chapterTitleRow}>
                          <span className={styles.chapterTitle}>
                            {chapter.title}
                          </span>
                          <span className={styles.chapterMeta}>
                            {chapter.lessons.length} bài học
                          </span>
                        </div>

                        <ul className={styles.lessonsList}>
                          {chapter.lessons.map((lesson) =>
                            renderLesson(lesson)
                          )}
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
                          </select>

                          {lessonForm.type === "VIDEO" && (
                            <input
                              className={styles.input}
                              placeholder="URL YouTube (hoặc videoId)"
                              value={lessonForm.urlVid}
                              onChange={(e) =>
                                handleLessonFormChange(
                                  chapter.id,
                                  "urlVid",
                                  e.target.value
                                )
                              }
                            />
                          )}

                          {lessonForm.type === "DOCUMENT" && (
                            <textarea
                              className={styles.textarea}
                              placeholder="Nội dung tài liệu hoặc link tới tài liệu..."
                              rows={3}
                              value={lessonForm.urlVid}
                              onChange={(e) =>
                                handleLessonFormChange(
                                  chapter.id,
                                  "urlVid",
                                  e.target.value
                                )
                              }
                            />
                          )}

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
