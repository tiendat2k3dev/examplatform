// src/types/user.ts

export interface User {
  id: string | number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: "Admin" | "Member" | string;
  status?: "Mở" | "Khóa" | string; // Optional để linh hoạt khi khởi tạo
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface AuthState {
  currentUser: User | null;
}

export interface LoginPayload {
  username: string;
  password: string;
}

// Payload dành riêng cho form Đăng Ký
export type RegisterPayload = Omit<
  User,
  "id" | "role" | "avatarUrl" | "createdAt" | "updatedAt" | "status"
>;

export interface UpdateUserPayload {
  fullName?: string;
  email?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  role?: string;
  status?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}