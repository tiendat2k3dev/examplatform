// src/services/authService.ts

import bcrypt from "bcryptjs";
import api from "../lib/apiClient";

import {
  User,
  LoginPayload,
  RegisterPayload,
  UpdateUserPayload,
  ChangePasswordPayload,
} from "@/types/user";

/**
 * ĐĂNG KÝ
 */
export const registerService = async (
  userData: RegisterPayload,
): Promise<User> => {
  try {
    // 1. Kiểm tra username đã tồn tại
    const check = await api.get<User[]>(
      `/users?username=${encodeURIComponent(userData.username)}`,
    );

    const existingUsers = Array.isArray(check.data) ? check.data : [];

    if (existingUsers.length > 0) {
      throw new Error("Tên đăng nhập đã tồn tại trong hệ thống!");
    }

    // 2. Tạo User ID
    const now = new Date();

    const pad = (n: number) => String(n).padStart(2, "0");

    const userId = `USER-${now.getFullYear()}${pad(
      now.getMonth() + 1,
    )}${pad(now.getDate())}-${pad(now.getHours())}${pad(
      now.getMinutes(),
    )}${pad(now.getSeconds())}`;

    // 3. Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 4. Tạo user
    const newUser: User = {
      id: userId,
      ...userData,
      password: hashedPassword,
      role: "Member",
      status: "Mở",
      createdAt: now.toISOString(),
      updatedAt: null,
    };

    // 5. POST lên API
    const response = await api.post<User>("/users", newUser);

    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};

/**
 * ĐĂNG NHẬP
 */
export const loginService = async (payload: LoginPayload): Promise<User> => {
  try {
    // 1. Tìm user theo username
    const response = await api.get<User[]>(
      `/users?username=${encodeURIComponent(payload.username)}`,
    );

    const users = Array.isArray(response.data) ? response.data : [];

    if (users.length === 0) {
      throw new Error("Tên đăng nhập không tồn tại trong hệ thống!");
    }

    const user = users[0];

    // 2. Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Mật khẩu không chính xác!");
    }

    // 3. Kiểm tra trạng thái tài khoản
    if (user.status === "Khóa") {
      throw new Error("Tài khoản của bạn đã bị khóa!");
    }

    // 4. Đăng nhập thành công
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

/**
 * CẬP NHẬT THÔNG TIN USER
 */
export const updateUserService = async (
  userId: string | number,
  payload: UpdateUserPayload,
): Promise<User> => {
  try {
    const response = await api.patch<User>(`/users/${userId}`, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });

    return response.data;
  } catch (error) {
    console.error("Update user failed:", error);
    throw error;
  }
};

/**
 * ĐỔI MẬT KHẨU
 */
export const changePasswordService = async (
  userId: string | number,
  payload: ChangePasswordPayload,
): Promise<void> => {
  try {
    // 1. Kiểm tra mật khẩu mới
    if (payload.newPassword !== payload.confirmNewPassword) {
      throw new Error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
    }

    // 2. Lấy user hiện tại
    const response = await api.get<User>(`/users/${userId}`);

    const user = response.data;

    // 3. Kiểm tra mật khẩu cũ
    const isPasswordValid = await bcrypt.compare(
      payload.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Mật khẩu hiện tại không chính xác!");
    }

    // 4. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);

    const hashedNewPassword = await bcrypt.hash(payload.newPassword, salt);

    // 5. Cập nhật mật khẩu
    await api.patch(`/users/${userId}`, {
      password: hashedNewPassword,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Change password failed:", error);
    throw error;
  }
};
