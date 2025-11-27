import React, { useEffect, useState, useMemo } from "react";
import styles from "../../styles/CourseManagementPage.module.css";
import { courseApi } from "../../services/api/courseApi";
import { Course, CourseCreateRequest, CourseUpdateRequest } from "../../types/course";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

// Định nghĩa kiểu dữ liệu cho Status Counts
type StatusCounts = {
    "Tất cả": number;
    "Sắp diễn ra": number;
    "Đang diễn ra": number;
    "Đã kết thúc": number;
};

// Danh sách trạng thái hiển thị trên giao diện
const STATUS_OPTIONS = ["Tất cả", "Sắp diễn ra", "Đang diễn ra", "Đã kết thúc"];

const CourseManagementPage: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeStatus, setActiveStatus] = useState("Tất cả"); 
    
    // Sử dụng kiểu dữ liệu StatusCounts cho state
    const [statusCounts, setStatusCounts] = useState<StatusCounts>({
        "Tất cả": 0,
        "Sắp diễn ra": 0,
        "Đang diễn ra": 0,
        "Đã kết thúc": 0,
    });


    const [showModal, setShowModal] = useState(false);
    const [editCourseId, setEditCourseId] = useState<number | null>(null);
    const [formData, setFormData] = useState<CourseCreateRequest>({
        title: "",
        startDate: "",
        endDate: "",
        content: "",
    });

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    // Load courses từ BE
    const loadCourses = async () => {
        try {
            const statusToFetch = activeStatus === "Tất cả" ? "" : activeStatus;
            
            const res = await courseApi.getAll(
                page,
                pageSize,
                searchTerm,
                statusToFetch
            );
            setCourses(res.courses);
            setTotalPages(res.totalPages);

            if (searchTerm || statusToFetch) {
                const allResults = await courseApi.getAll(0, 1000, searchTerm, statusToFetch);
                
                setStatusCounts(prev => ({
                    ...prev,
                    [activeStatus as keyof StatusCounts]: allResults.courses.length
                }));
            } else {
                
                const counts: StatusCounts = { "Tất cả": 0, "Sắp diễn ra": 0, "Đang diễn ra": 0, "Đã kết thúc": 0 };
                
                let totalCoursesCount = 0;
                
                for (const status of ["Sắp diễn ra", "Đang diễn ra", "Đã kết thúc"]) {
                    const statusAll = await courseApi.getAll(0, 1000, "", status);
                    counts[status as keyof StatusCounts] = statusAll.courses.length;
                    totalCoursesCount += statusAll.courses.length;
                }
                
                counts["Tất cả"] = totalCoursesCount;
                
                setStatusCounts(counts); // Đã sửa lỗi TS2345

            }


            if (page >= res.totalPages && res.totalPages > 0) {
                setPage(0);
            }
        } catch (err) {
            console.error("Lỗi tải danh sách khóa học", err);
        }
    };

    // Reset page về 0 khi search hoặc status thay đổi
    useEffect(() => {
        setPage(0);
    }, [searchTerm, activeStatus]);

    useEffect(() => {
        loadCourses();
    }, [page, searchTerm, activeStatus]);

    // Modal handlers
    const openCreateModal = () => {
        setEditCourseId(null);
        setFormData({ title: "", startDate: "", endDate: "", content: "" });
        setShowModal(true);
    };

    const openEditModal = (course: Course) => {
        setEditCourseId(course.id);
        setFormData({
            title: course.title,
            startDate: course.startDate,
            endDate: course.endDate,
            content: course.content,
        });
        setShowModal(true);
    };

    const handleSubmit = async () => {
        try {
            if (editCourseId === null) {
                await courseApi.create(formData);
                alert("Thêm khóa học thành công!");
            } else {
                await courseApi.update(editCourseId, formData as CourseUpdateRequest);
                alert("Cập nhật khóa học thành công!");
            }
            setShowModal(false);
            loadCourses();
        } catch (err: any) {
            alert(err.response?.data?.message || "Lỗi xử lý yêu cầu");
        }
    };

    const handleDelete = async (id: number) => {
        if (id === undefined || id === null || id <= 0) {
            console.error("ID khóa học không hợp lệ:", id);
            alert("Không thể xóa: ID khóa học không hợp lệ!");
            return;
        }

        if (!window.confirm(`Bạn có chắc chắn muốn xóa khóa học ID: ${id} này?`)) return;
        try {
            await courseApi.delete(id);
            alert("Khóa học đã xóa thành công!");
            loadCourses();
        } catch (err: any) {
            console.error("Lỗi xóa khóa học:", err);
            alert(err.response?.data?.message || "Xóa thất bại! Vui lòng kiểm tra console để biết chi tiết.");
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Quản lý khóa học</h1>

            <div className={styles.topBar}>
                <div className={styles.searchContainer}>
                    <span className={styles.searchIcon}><CiSearch /></span>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã, tên hoặc nội dung..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>
                <button className={styles.addButton} onClick={openCreateModal}>
                    + Thêm khóa học
                </button>
            </div>

            <div className={styles.statusFilter}>
                <h3 className={styles.filterTitle}>Lọc theo trạng thái:</h3>
                <div className={styles.statusButtons}>
                    {STATUS_OPTIONS.map((status) => (
                        <button
                            key={status}
                            className={`${styles.statusButton} ${activeStatus === status ? styles.activeStatus : ""}`}
                            onClick={() => setActiveStatus(status)}
                        >
                            {status} <span>{statusCounts[status as keyof StatusCounts] || 0}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Mã khóa</th>
                            <th>Tên khóa học</th>
                            <th>Ngày bắt đầu</th>
                            <th>Ngày kết thúc</th>
                            <th>Trạng thái</th>
                            <th>Nội dung</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? courses.map((c) => (
                            <tr key={c.id}>
                                <td>{c.code}</td>
                                <td>{c.title}</td>
                                <td>{c.startDate}</td>
                                <td>{c.endDate}</td>
                                <td>
                                    <span 
                                        className={
                                            c.status === "Sắp diễn ra" ? styles.statusUpcoming : 
                                            c.status === "Đang diễn ra" ? styles.statusActive : 
                                            styles.statusEnded
                                        }
                                    >
                                        {c.status}
                                    </span>
                                </td>
                                <td>{c.content}</td>
                                <td className={styles.actions}>
                                    <span className={styles.actionIcon} onClick={() => openEditModal(c)}>
                                        <AiOutlineEdit size={20} />
                                    </span>
                                    <span className={styles.actionIcon} onClick={() => handleDelete(c.id)}>
                                        <AiOutlineDelete size={20} />
                                    </span>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={7} className={styles.noData}>
                                    Không có khóa học nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            {totalPages > 1 && (
                <div className={styles.pagination}>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            className={idx === page ? styles.activePage : ""}
                            onClick={() => setPage(idx)}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>{editCourseId ? "Cập nhật khóa học" : "Thêm khóa học mới"}</h2>

                        <label>Tiêu đề khóa học</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        <label>Ngày bắt đầu</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        />

                        <label>Ngày kết thúc</label>
                        <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        />

                        <label>Nội dung khóa học</label>
                        <textarea
                            rows={4}
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />

                        <div className={styles.modalActions}>
                            <button className={styles.saveBtn} onClick={handleSubmit}>
                                {editCourseId ? "Cập nhật" : "Thêm mới"}
                            </button>
                            <button className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagementPage;