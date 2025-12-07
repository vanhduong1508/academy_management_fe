/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/slices/auth.slice";
import { loginApi, registerStudentApi } from "../../api/auth/auth.api";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "../../styles/AuthStyle.module.css";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [isRightPanelActive, setIsRightPanelActive] = useState(
    location.pathname === "/register"
  );

  // --- LOGIN ---
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      // Gửi username + password cho cả admin & student
      const authResponse = await loginApi({
        username: loginUsername,
        password: loginPassword,
      });

      // Lưu token + user vào redux (map trong auth.slice)
      dispatch(setCredentials(authResponse));

      // LẤY ROLE TỪ authResponse.user.role (theo BE: AuthResponse { token, user, studentId })
      const redirectPath =
        authResponse.user.role === "ADMIN" ? "/admin" : "/student";

      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Thông tin đăng nhập không chính xác.";
      setLoginError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  // --- REGISTER STUDENT ---
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    hometown: "",
    province: "",
  });
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    setRegError("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);

    try {
      const { username, email, password, fullName, phone, dob } = registerForm;

      // BE StudentRegisterRequest: username, email, password, fullName, phone, dob, ...
      await registerStudentApi({
        username,
        email,
        password,
        fullName,
        phone,
        dob,
        hometown: registerForm.hometown,
        province: registerForm.province,
      });

      setRegSuccess("Đăng ký thành công! Vui lòng đăng nhập.");

      setTimeout(() => {
        setIsRightPanelActive(false);
        setRegSuccess("");
        setRegisterForm({
          fullName: "",
          username: "",
          email: "",
          password: "",
          phone: "",
          dob: "",
          hometown: "",
          province: "",
        });
      }, 1500);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!";
      setRegError(errorMsg);
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className={styles["auth-wrapper"]}>
      <div
        className={`${styles["auth-container"]} ${
          isRightPanelActive ? styles["right-panel-active"] : ""
        }`}
      >
        <div
          className={`${styles["form-container"]} ${styles["sign-up-container"]}`}
        >
          <form
            className={styles["form-content"]}
            onSubmit={handleRegisterSubmit}
          >
            <h1>Tạo Tài Khoản Học Viên</h1>
            <span>Đây là tài khoản STUDENT, admin không đăng ký ở đây.</span>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Họ và Tên"
                name="fullName"
                id="reg_fullName"
                value={registerForm.fullName}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Tên đăng nhập"
                name="username"
                id="reg_username"
                value={registerForm.username}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Email"
                name="email"
                id="reg_email"
                type="email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Số điện thoại"
                name="phone"
                id="reg_phone"
                value={registerForm.phone}
                onChange={handleRegisterChange}
              />
            </div>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Ngày sinh"
                name="dob"
                id="reg_dob"
                type="date"
                value={registerForm.dob}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Tỉnh / Thành phố"
                name="province"
                id="reg_province"
                value={registerForm.province}
                onChange={handleRegisterChange}
              />
            </div>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Mật khẩu"
                name="password"
                id="reg_password"
                type="password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                required
              />
            </div>

            {regError && <div className={styles["msg-error"]}>{regError}</div>}
            {regSuccess && (
              <div className={styles["msg-success"]}>{regSuccess}</div>
            )}

            <Button type="submit" variant="primary" isLoading={regLoading}>
              Đăng Ký
            </Button>
          </form>
        </div>

        {/* --- LOGIN (ADMIN + STUDENT) --- */}
        <div
          className={`${styles["form-container"]} ${styles["sign-in-container"]}`}
        >
          <form className={styles["form-content"]} onSubmit={handleLoginSubmit}>
            <h1>Đăng Nhập</h1>
            <span>
              Admin dùng tài khoản cố định, học viên dùng tài khoản đã đăng ký.
            </span>

            <div className={styles["input-group"]} style={{ marginTop: 30 }}>
              <Input
                placeholder="Tên đăng nhập"
                id="login_username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>

            <div className={styles["input-group"]}>
              <Input
                placeholder="Mật khẩu"
                id="login_password"
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
            </div>

            <a href="#" className="forgot-pass">
              Quên mật khẩu?
            </a>

            {loginError && (
              <div className={styles["msg-error"]}>{loginError}</div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={loginLoading}
              disabled={!loginUsername || !loginPassword}
            >
              Đăng Nhập
            </Button>
          </form>
        </div>

        {/* --- overlay --- */}
        <div className={styles["overlay-container"]}>
          <div className={styles.overlay}>
            <div
              className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}
            >
              <h1>Đã có tài khoản?</h1>
              <p>Đăng nhập để tiếp tục học hoặc quản lý hệ thống.</p>
              <button
                className={styles.ghost}
                type="button"
                onClick={() => setIsRightPanelActive(false)}
              >
                Đăng Nhập
              </button>
            </div>

            <div
              className={`${styles["overlay-panel"]} ${styles["overlay-right"]}`}
            >
              <h1>Học viên mới?</h1>
              <p>
                Tạo tài khoản STUDENT, sau đó sử dụng form Đăng nhập để vào hệ
                thống.
              </p>
              <button
                className={styles.ghost}
                type="button"
                onClick={() => setIsRightPanelActive(true)}
              >
                Đăng Ký Ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
