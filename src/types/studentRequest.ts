export interface StudentCreateRequest {
  fullName: string;
  dob: string; // yyyy-MM-dd
  hometown?: string;
  province?: string;
}

export interface StudentUpdateRequest {
  fullName: string;
  dob: string; // yyyy-MM-dd
  hometown?: string;
  province?: string;
}