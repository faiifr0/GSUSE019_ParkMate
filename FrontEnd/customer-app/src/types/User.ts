// src/types/User.ts
export interface UserRequest {
  username: string;
  email: string;
  password: string;
  parkBranchId?: number;
  fullName?: string;
  phoneNumber?: string;
  dob?: string; // ISO date string (yyyy-MM-dd)
}

export interface UserRoleResponse {
  id: number;
  roleId: number;
  roleName: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  parkBranchId?: number;
  parkBranchName?: string;
  roles: UserRoleResponse[];
  walletId?: number;
  balance?: number;
  createdAt: string;
  updatedAt: string;
  fullName?: string;
  phoneNumber?: string;
  dob?: string;
}
