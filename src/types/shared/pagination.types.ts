// src/types/shared/pagination.types.ts
export interface PageResponse<T> {
  length: any;
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface PaginationMeta {
  page: number;
  size: number;
  totalPages: number;
}
