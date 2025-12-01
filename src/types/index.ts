// /src/types/index.ts (FINAL)

// --- Types Chung ---

export interface PaginationMeta {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    limit: number;
}

export interface PaginationResponse<T> {
    data: T;
    pagination: PaginationMeta;
}

// --- Re-export các types chi tiết ---

export * from './models/user.types';
export * from './models/order.types';
export * from './models/course.types';