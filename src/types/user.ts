// src/types/user.ts

export interface User {
  id: string | number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
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
