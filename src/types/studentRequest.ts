export interface StudentCreateRequest {
  code: string;
  fullName: string;
  dob: string;
  hometown: string;
  province: string;
  status: string;
}


export interface StudentUpdateRequest {
  fullName: string;
  dob: string;
  hometown: string;
  province: string;
  status: string;
}
