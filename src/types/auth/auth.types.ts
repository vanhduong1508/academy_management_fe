import type { UserRole } from "../shared/user.types";

// BE: UserSimpleResponse
export interface UserSimple {
  id: number;
  username: string;
  role: UserRole;
}

// BE: AuthResponse { token, user }
export interface AuthResponse {
  token: string;
  user: UserSimple;
}

// User lưu trong Redux
export interface AuthUser {
  id: number;
  username: string;
  role: UserRole;
  fullName?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterStudentPayload {
  username: string;
  email: string;
  password: string;
  fullName: string;
  dob: string;    
  phone?: string;
  hometown?: string;
  province?: string;
}
