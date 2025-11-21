// src/types/Auth.ts

// ... (Các interfaces LoginPayload, RegisterPayload, v.v. nếu có)

// Thêm type cho props của LoginPage
export interface LoginPageProps {
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}