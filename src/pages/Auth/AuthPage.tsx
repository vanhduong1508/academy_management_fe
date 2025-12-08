/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { setCredentials } from "../../redux/slices/auth.slice";
import { loginApi, registerStudentApi } from "../../api/auth/auth.api";
import Button from "../../components/common/Button/Button";
import Input from "../../components/common/Input/Input";
import styles from "../../styles/AuthStyle.module.css";


const USERNAME_REGEX = /^[a-zA-Z0-9_-]+$/; 
const PHONE_REGEX = /^0\d{9}$/; 
const GMAIL_REGEX = /^[A-Za-z0-9._%+-]+@gmail\.com$/i;
const PASSWORD_REGEX = /^.{8,}$/;

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const [isRightPanelActive, setIsRightPanelActive] = useState(
    location.pathname === "/register"
  );

  /* ---------- Login state ---------- */
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const authResponse = await loginApi({
        username: loginUsername,
        password: loginPassword,
      });

      dispatch(setCredentials(authResponse));

      const redirectPath =
        authResponse.user?.role === "ADMIN" ? "/admin" : "/student";

      navigate(redirectPath, { replace: true });
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.message || "Thông tin đăng nhập không chính xác.";
      setLoginError(errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  /* ---------- Register state ---------- */
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
    setRegSuccess("");
  };

  // Kiểm tra phía client theo ràng buộc BE
  const validateRegister = () => {
    const { username, email, password, phone, dob } = registerForm;

    if (!username || !USERNAME_REGEX.test(username)) {
      return "Username chỉ được chứa chữ, số, '_' hoặc '-', không có khoảng trắng hoặc dấu.";
    }

    if (!phone || !PHONE_REGEX.test(phone)) {
      return "Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số.";
    }

    if (!email || !GMAIL_REGEX.test(email)) {
      return "Email phải là địa chỉ Gmail hợp lệ (kết thúc bằng @gmail.com).";
    }

    if (!dob) {
      return "Vui lòng chọn ngày sinh.";
    }

    if (!password || !PASSWORD_REGEX.test(password)) {
      return "Mật khẩu phải có ít nhất 8 ký tự.";
    }

    return ""; // hợp lệ
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    const clientValidationError = validateRegister();
    if (clientValidationError) {
      setRegError(clientValidationError);
      return;
    }

    setRegLoading(true);

    try {
      const {
        username,
        email,
        password,
        fullName,
        phone,
        dob,
        hometown,
        province,
      } = registerForm;

    
      await registerStudentApi({
        username,
        email,
        password,
        fullName,
        phone,
        dob, 
        hometown,
        province,
      });

      setRegSuccess("Đăng ký thành công! Vui lòng đăng nhập.");

      // reset form và chuyển sang panel đăng nhập
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
      }, 1200);
    } catch (err: any) {
      // lấy message chi tiết từ BE (nếu có)
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
            <h1>Đăng ký</h1>
            <span>Thành công đang chờ đợi bạn</span>

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
                required
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

        <div
          className={`${styles["form-container"]} ${styles["sign-in-container"]}`}
        >
          <form className={styles["form-content"]} onSubmit={handleLoginSubmit}>
            <h1>Đăng Nhập</h1>
            <span>
              Học, học nữa, học mãi 
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


        <div className={styles["overlay-container"]}>
          <div className={styles.overlay}>
            <div
              className={`${styles["overlay-panel"]} ${styles["overlay-left"]}`}
            >
              <h1>Bạn đã sẵn sàng?</h1>
              <p>Hãy đăng nhập để bắt đầu theo đuổi đam mê.</p>
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
              <h1>Đam mê của bạn là gì?</h1>
              <p>
                Hãy chuẩn bị cho mình hành trang kiến thức
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
