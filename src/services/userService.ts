import { User } from "../types/user";
import bcrypt from "bcryptjs";
import api from "../lib/apiClient.js";

// Lấy danh sách người dùng
export const getUsersService = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách người dùng:", error);
    throw error;
  }
};

// Lấy người dùng theo ID
export const getUserByIdService = async (
  userId: string | number,
): Promise<User> => {
  try {
    const response = await api.get<User>(`/users/${userId}`);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi tải thông tin người dùng:", error);
    throw error;
  }
};

// Thêm người dùng
export const createUserService = async (
  userData: Omit<User, "id" | "createdAt" | "updatedAt">,
): Promise<User> => {
  try {
    // Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const response = await api.post<User>("/users", {
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);
    throw error;
  }
};

// Cập nhật người dùng
export const updateUserService = async (
  userId: string | number,
  userData: Partial<User>,
): Promise<User> => {
  try {
    const payload: Partial<User> = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    // Không xử lý password ở đây.
    // Khi cập nhật thông tin user, password cũ phải được giữ nguyên.

    const response = await api.patch<User>(`/users/${userId}`, payload);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    throw error;
  }
};

// Xóa người dùng
export const deleteUserService = async (
  userId: string | number,
): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error("Lỗi khi xóa người dùng:", error);
    throw error;
  }
};
