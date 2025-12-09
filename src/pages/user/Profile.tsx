import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfileApi, updateMyProfileApi } from "../../api/student/student.api";
import type { StudentResponse, UpdateStudentPayload } from "../../types/student/student.types";
import styles from "../../styles/user/UserProfile.module.css";

export default function Profile() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<StudentResponse | null>(null);
  const [form, setForm] = useState<UpdateStudentPayload>({
    fullName: "",
    dob: "",
    hometown: "",
    province: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyProfileApi();
      setProfile(data);

      setForm({
        fullName: data.fullName ?? "",
        dob: data.dob ? data.dob.slice(0, 10) : "",
        hometown: data.hometown ?? "",
        province: data.province ?? "",
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được thông tin cá nhân.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const updated = await updateMyProfileApi(form);
      setProfile(updated);
      setIsEditing(false);
      alert("Cập nhật thông tin thành công!");
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Cập nhật thông tin thất bại.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        fullName: profile.fullName ?? "",
        dob: profile.dob ? profile.dob.slice(0, 10) : "",
        hometown: profile.hometown ?? "",
        province: profile.province ?? "",
      });
    }
    setIsEditing(false);
    setError(null);
  };

  // ========================
  // 🔥 LOGOUT
  // ========================
  const handleLogout = () => {
    localStorage.removeItem("token"); // xóa token hoặc dữ liệu đăng nhập
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.infoText}>Đang tải thông tin cá nhân...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || "Không tìm thấy thông tin cá nhân."}</p>
        <button className={styles.button} onClick={fetchProfile}>Tải lại</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Hồ sơ cá nhân</h2>
          <p className={styles.subtitle}>Xem và cập nhật thông tin cá nhân của bạn.</p>
        </div>

        <div>
          {!isEditing && (
            <button className={styles.button} onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </button>
          )}
          <button
            className={`${styles.button} ${styles.buttonLogout}`}
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarPlaceholder}>
            {(profile.fullName?.charAt(0) || profile.studentCode?.charAt(0) || "U").toUpperCase()}
          </div>
        </div>

        <div className={styles.formSection}>
          <Field label="Mã học viên">
            <input type="text" className={styles.input} value={profile.studentCode || ""} disabled />
          </Field>

          <Field label="Họ và tên">
            {isEditing ? (
              <input
                type="text"
                className={styles.input}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            ) : (
              <p className={styles.value}>{profile.fullName || "-"}</p>
            )}
          </Field>

          <Field label="Email">
            <p className={styles.value}>{profile.email}</p>
          </Field>

          <Field label="Số điện thoại">
            <p className={styles.value}>{profile.phone || "-"}</p>
          </Field>

          <Field label="Ngày sinh">
            {isEditing ? (
              <input
                type="date"
                className={styles.input}
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
              />
            ) : (
              <p className={styles.value}>
                {profile.dob ? new Date(profile.dob).toLocaleDateString("vi-VN") : "-"}
              </p>
            )}
          </Field>

          <Field label="Quê quán">
            {isEditing ? (
              <input
                type="text"
                className={styles.input}
                value={form.hometown ?? ""}
                onChange={(e) => setForm({ ...form, hometown: e.target.value })}
              />
            ) : (
              <p className={styles.value}>{profile.hometown || "-"}</p>
            )}
          </Field>

          <Field label="Tỉnh/Thành phố">
            {isEditing ? (
              <input
                type="text"
                className={styles.input}
                value={form.province ?? ""}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />
            ) : (
              <p className={styles.value}>{profile.province || "-"}</p>
            )}
          </Field>

          <Field label="Ngày tham gia">
            <p className={styles.value}>
              {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </Field>

          {isEditing && (
            <div className={styles.formActions}>
              <button className={styles.button} onClick={handleCancel} disabled={saving}>
                Hủy
              </button>
              <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={handleSave} disabled={saving}>
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.formField}>
      <label className={styles.label}>{label}</label>
      {children}
    </div>
  );
}
