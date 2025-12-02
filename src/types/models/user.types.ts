
// Role phải KHỚP với enum Role ở BE: ADMIN / STUDENT
export type UserRole = 'ADMIN' | 'STUDENT';

// DTO đơn giản BE trả về trong AuthResponse.user
export interface UserSimpleResponse {
  id: number;
  username: string;
  role: UserRole;
}

// User đã đăng nhập mà FE sẽ lưu trong Redux + localStorage
export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  token: string; // Lưu luôn token để interceptor dùng
}

// DTO dùng cho /users/... (me, admin list user)
export interface UserResponse {
  id: number;
  username: string;
  fullName?: string;
  isActive: boolean;
  createdAt?: string;
}

// AuthResponse – đúng 1:1 với BE (xem AuthServiceImpl + AuthController)
export interface AuthResponse {
  token: string;
  user: UserSimpleResponse;
}
