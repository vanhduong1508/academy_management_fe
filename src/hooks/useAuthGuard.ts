// src/hooks/useAuthGuard.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { UserRole } from "../types";

const useAuthGuard = (requiredRole?: UserRole) => {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  const isAuthenticated = !!token;

  useEffect(() => {
    // Chưa đăng nhập → đá về /login
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    // Nếu có yêu cầu role nhưng user.role không khớp → về home
    if (requiredRole && user && user.role !== requiredRole) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, requiredRole, user, navigate]);
};

export default useAuthGuard;
