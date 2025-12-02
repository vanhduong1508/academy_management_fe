export type UserRole = 'admin' | 'student';

export interface UserSimpleResponse {
    id: number;
    username: string;
}

export interface AuthUser {
    id: number;
    username: string;
    role: UserRole;
}

export interface UserResponse {
    id: number;
    username: string;
    fullName?: string;
    isActive: boolean;
    createdAt?: string;
}
