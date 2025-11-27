// src/pages/StudentManagementPage.tsx
import React, { useEffect, useState } from "react";
import styles from "../../styles/StudentManagementPage.module.css";
import {
    getStudentsPage,
    deleteStudent,
    updateStudent,
    createStudent,
    PageResponse,
} from "../../services/api/studentApi";
import { Student } from "../../types/student";
import { StudentCreateRequest, StudentUpdateRequest } from "../../types/studentRequest";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineClose } from "react-icons/ai"; // Đã thêm AiOutlineClose
import { CiSearch } from "react-icons/ci";

interface FormData {
    fullName: string;
    dob: string; 
    hometown?: string;
    province?: string;
}

const StudentManagementPage: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 5;

    // Modal state
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);
    const [isAddMode, setIsAddMode] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        fullName: "",
        dob: "",
        hometown: "",
        province: "",
    });

    const fetchStudents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data: PageResponse<Student> = await getStudentsPage(page, pageSize);
            setStudents(data.content);
            setTotalPages(data.totalPages);
        } catch (err: any) {
            setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page]);

    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return "";
        try {
            const [year, month, day] = dateStr.split('-');
            if (year && month && day) return `${day}/${month}/${year}`;
        } catch (e) {
            return dateStr;
        }
        return dateStr;
    };

    // Filter students by search (search by studentCode or fullName)
    const filteredStudents = students.filter((student) =>
        (student.studentCode || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
        (student.fullName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(e.target.value);

    // Function to close modal
    const closeModal = () => {
        setEditingStudent(null);
        setIsAddMode(false);
    };

    // Open add modal
    const handleAddStudent = () => {
        setIsAddMode(true);
        setEditingStudent(null);
        setFormData({
            fullName: "",
            dob: "",
            hometown: "",
            province: "",
        });
    };

    // Open edit modal
    const handleEdit = (student: Student) => {
        setEditingStudent(student);
        setIsAddMode(false);
        setFormData({
            fullName: student.fullName,
            dob: student.dob, 
            hometown: student.hometown || "",
            province: student.province || "",
        });
    };

    // Save student (create/update)
    const handleSaveStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.dob) {
            alert("Vui lòng nhập đầy đủ thông tin bắt buộc!");
            return;
        }
        try {
            if (isAddMode) {
                const payload: StudentCreateRequest = { ...formData };
                await createStudent(payload);
                alert("Thêm học viên thành công!");
            } else if (editingStudent) {
                const payload: StudentUpdateRequest = { ...formData };
                await updateStudent(editingStudent.id, payload);
                alert("Cập nhật học viên thành công!");
            }
            closeModal();
            fetchStudents();
        } catch (err: any) {
            alert("Lỗi khi lưu học viên: " + (err.message || err));
        }
    };

    // Delete student
    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        if (!window.confirm(`Bạn có chắc muốn xóa học viên ID ${id}?`)) return;
        try {
            await deleteStudent(id);
            alert("Xóa học viên thành công!");
            fetchStudents();
        } catch (err: any) {
            alert("Lỗi khi xóa học viên: " + (err.message || err));
        }
    };

    if (isLoading) return <p>Đang tải dữ liệu...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>Quản lý Học viên</h1>

            <div className={styles.headerBar}>
                <div className={styles.searchContainer}>
                    <CiSearch className={styles.searchIcon} size={20} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo mã học viên hoặc tên..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles.searchInput}
                    />
                </div>
                <button className={styles.addButton} onClick={handleAddStudent}>
                    + Thêm học viên
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            <th>Mã học viên</th>
                            <th>Họ tên</th>
                            <th>Ngày sinh</th>
                            <th>Quê quán</th>
                            <th>Tỉnh thường trú</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td>{student.studentCode}</td>
                                    <td>{student.fullName}</td>
                                    <td>{formatDate(student.dob)}</td>
                                    <td>{student.hometown}</td>
                                    <td>{student.province}</td>
                                    <td className={styles.actions}>
                                        <button onClick={() => handleEdit(student)} title="Chỉnh sửa">
                                            <AiOutlineEdit size={18} />
                                        </button>
                                        <button onClick={(e) => handleDelete(e, student.id)} title="Xóa">
                                            <AiOutlineDelete size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className={styles.noData}>
                                    Không tìm thấy học viên phù hợp.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={index === page ? styles.activePage : ""}
                                onClick={() => setPage(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {(editingStudent || isAddMode) && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>{isAddMode ? "Thêm học viên mới" : "Cập nhật học viên"}</h2>
                            <button className={styles.closeButton} onClick={closeModal}><AiOutlineClose size={18} /></button>
                        </div>
                        
                        <form onSubmit={handleSaveStudent}>
                            {/* Họ và tên */}
                            <label className={styles.formLabel}>Họ và tên</label> 
                            <input
                                type="text"
                                placeholder="Họ và tên" 
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                            <label className={styles.formLabel}>Ngày sinh</label>
                            <input
                                type="date"
                                placeholder="dd/mm/yyyy" 
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                required
                            />
                            <label className={styles.formLabel}>Quê quán</label>
                            <input
                                type="text"
                                placeholder="Quê quán" 
                                value={formData.hometown}
                                onChange={(e) => setFormData({ ...formData, hometown: e.target.value })}
                            />
                            <label className={styles.formLabel}>Tỉnh thường trú</label>
                            <input
                                type="text"
                                placeholder="Tỉnh thường trú" 
                                value={formData.province}
                                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                            />
                            
                            <div className={styles.modalActions}>
                                <button type="button" className={styles.cancelButton} onClick={closeModal}>
                                    Hủy
                                </button>
                                <button type="submit" className={styles.submitButton}>
                                    {isAddMode ? "Thêm" : "Lưu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagementPage;