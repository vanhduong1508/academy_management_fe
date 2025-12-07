import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import type { UserRole } from "../types/shared/user.types";

const useAuthGuard = (requiredRole?: UserRole) => {
  const navigate = useNavigate();
  const { user, token } = useAppSelector((state) => state.auth);

  const isAuthenticated = !!token;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (requiredRole && user && user.role !== requiredRole) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, requiredRole, user, navigate]);
};

export default useAuthGuard;
