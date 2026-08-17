import { User } from "../types/user";
import bcrypt from "bcryptjs";
import api from "../lib/apiClient";

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
    // 1. Lấy danh sách người dùng hiện tại để kiểm tra trùng lặp
    const existingUsers = await getUsersService();

    // 2. Kiểm tra username đã tồn tại
    if (
      existingUsers.some(
        (u) => u.username.toLowerCase().trim() === userData.username.toLowerCase().trim()
      )
    ) {
      throw new Error("USERNAME_EXISTS");
    }

    // 3. Kiểm tra email đã tồn tại
    if (
      existingUsers.some(
        (u) => u.email.toLowerCase().trim() === userData.email.toLowerCase().trim()
      )
    ) {
      throw new Error("EMAIL_EXISTS");
    }

    // 4. Kiểm tra số điện thoại đã tồn tại
    if (
      existingUsers.some(
        (u) => u.phone.trim() === userData.phone.trim()
      )
    ) {
      throw new Error("PHONE_EXISTS");
    }

    // 5. Mã hóa mật khẩu trước khi lưu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 6. Tạo user (không gửi password hash về client)
    const response = await api.post<User>("/users", {
      ...userData,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: null,
    });

    const { password: _password, ...userWithoutPassword } = response.data;

    return userWithoutPassword as User;
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
// tim kiem Họ tên	Địa chỉ	Số điện thoại	Email	Vai trò
// =========================
// TÌM KIẾM NGƯỜI DÙNG
// Họ tên + Địa chỉ + SĐT + Email
// Vai trò + Trạng thái
// =========================
export const searchUsersService = async (
  keyword: string = "",
  role: string = "",
  status: string = "",
): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");

    const users = Array.isArray(response.data) ? response.data : [];

    const search = keyword.toLowerCase().trim();

    return users.filter((user) => {
      // =========================
      // TÌM KIẾM TEXT
      // =========================
      const matchesKeyword =
        search === "" ||
        (user.fullName ?? "").toLowerCase().includes(search) ||
        (user.address ?? "").toLowerCase().includes(search) ||
        (user.phone ?? "").toLowerCase().includes(search) ||
        (user.email ?? "").toLowerCase().includes(search);

      // =========================
      // LỌC VAI TRÒ
      // =========================
      const matchesRole = role === "" || user.role === role;

      // =========================
      // LỌC TRẠNG THÁI
      // =========================
      const matchesStatus = status === "" || user.status === status;

      return matchesKeyword && matchesRole && matchesStatus;
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);

    throw error;
  }
};
