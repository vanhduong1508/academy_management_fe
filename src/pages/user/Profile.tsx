import { useEffect, useState } from "react";
import { getMyProfileApi, updateMyProfileApi } from "../../api/student/student.api";
import type { StudentResponse, UpdateStudentPayload } from "../../types/student/student.types";
import styles from "../../styles/user/UserProfile.module.css";

export default function Profile() {
  const [profile, setProfile] = useState<StudentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<UpdateStudentPayload>({
    fullName: "",
    dob: "",
    hometown: "",
    province: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyProfileApi();
      setProfile(data);
      setForm({
        fullName: data.fullName || "",
        dob: data.dob ? data.dob.slice(0, 10) : "", 
        hometown: data.hometown || "",
        province: data.province || "",
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Không tải được thông tin cá nhân.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
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
        fullName: profile.fullName || "",
        dob: profile.dob ? profile.dob.slice(0, 10) : "",
        hometown: profile.hometown || "",
        province: profile.province || "",
      });
    }
    setIsEditing(false);
    setError(null);
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
        <p className={styles.error}>
          {error || "Không tìm thấy thông tin cá nhân."}
        </p>
        <button className={styles.button} onClick={fetchProfile}>
          Tải lại
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>Hồ sơ cá nhân</h2>
          <p className={styles.subtitle}>
            Xem và cập nhật thông tin cá nhân của bạn.
          </p>
        </div>
        {!isEditing && (
          <button
            className={styles.button}
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </button>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.profileCard}>
        <div className={styles.avatarSection}>
          <div className={styles.avatarPlaceholder}>
            {profile.fullName?.charAt(0).toUpperCase() || profile.studentCode?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.formField}>
            <label className={styles.label}>Mã học viên</label>
            <input
              type="text"
              className={styles.input}
              value={profile.studentCode || ""}
              disabled
            />
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Họ và tên</label>
            {isEditing ? (
              <input
                type="text"
                className={styles.input}
                value={form.fullName || ""}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
              />
            ) : (
              <p className={styles.value}>{profile.fullName || "-"}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Email</label>
            <p className={styles.value}>{profile.email || "-"}</p>
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Số điện thoại</label>
            <p className={styles.value}>{profile.phone || "-"}</p>
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Ngày sinh</label>
            {isEditing ? (
              <input
                type="date"
                className={styles.input}
                value={form.dob || ""}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                required
              />
            ) : (
              <p className={styles.value}>
                {profile.dob
                  ? new Date(profile.dob).toLocaleDateString("vi-VN")
                  : "-"}
              </p>
            )}
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Quê quán</label>
            {isEditing ? (
              <input
                type="text"
                className={styles.input}
                value={form.hometown || ""}
                onChange={(e) => setForm({ ...form, hometown: e.target.value })}
              />
            ) : (
              <p className={styles.value}>{profile.hometown || "-"}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Tỉnh/Thành phố</label>
            {isEditing ? (
              <input
                type="text"
                className={styles.input}
                value={form.province || ""}
                onChange={(e) => setForm({ ...form, province: e.target.value })}
              />
            ) : (
              <p className={styles.value}>{profile.province || "-"}</p>
            )}
          </div>

          <div className={styles.formField}>
            <label className={styles.label}>Ngày tham gia</label>
            <p className={styles.value}>
              {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>

          {isEditing && (
            <div className={styles.formActions}>
              <button
                className={styles.button}
                onClick={handleCancel}
                disabled={saving}
              >
                Hủy
              </button>
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

