import { User } from "../types/user";
import bcrypt from "bcryptjs";
import api from "../lib/apiClient";

// =====================================================
// LẤY DANH SÁCH NGƯỜI DÙNG
// =====================================================

export const getUsersService = async (): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/users");

    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Lỗi khi tải danh sách người dùng:", error);

    throw error;
  }
};

// =====================================================
// LẤY NGƯỜI DÙNG THEO ID
// =====================================================

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

// =====================================================
// HÀM KIỂM TRA TRÙNG (DÙNG CHO YUP VALIDATION)
// =====================================================

export const checkUsernameExists = async (
  username: string,
  excludeUserId?: string | number,
): Promise<boolean> => {
  const users = await getUsersService();

  const normalized = username.trim().toLowerCase();

  return users.some(
    (u) =>
      u.username?.trim().toLowerCase() === normalized &&
      (excludeUserId ? String(u.id) !== String(excludeUserId) : true),
  );
};

export const checkEmailExists = async (
  email: string,
  excludeUserId?: string | number,
): Promise<boolean> => {
  const users = await getUsersService();

  const normalized = email.trim().toLowerCase();

  return users.some(
    (u) =>
      u.email?.trim().toLowerCase() === normalized &&
      (excludeUserId ? String(u.id) !== String(excludeUserId) : true),
  );
};

export const checkPhoneExists = async (
  phone: string,
  excludeUserId?: string | number,
): Promise<boolean> => {
  const users = await getUsersService();

  const normalized = phone.trim();

  return users.some(
    (u) =>
      u.phone?.trim() === normalized &&
      (excludeUserId ? String(u.id) !== String(excludeUserId) : true),
  );
};

// =====================================================
// THÊM NGƯỜI DÙNG
// =====================================================

export const createUserService = async (
  userData: Omit<User, "id" | "createdAt" | "updatedAt">,
): Promise<User> => {
  try {
    // =================================================
    // 1. LẤY DANH SÁCH USER
    // =================================================

    const existingUsers = await getUsersService();

    // =================================================
    // 2. CHUẨN HÓA DỮ LIỆU
    // =================================================

    const username = userData.username?.trim() ?? "";
    const email = userData.email?.trim().toLowerCase() ?? "";
    const phone = userData.phone?.trim() ?? "";

    // =================================================
    // 3. KIỂM TRA USERNAME TRÙNG
    // =================================================

    const isUsernameExists = existingUsers.some(
      (user) => user.username?.trim().toLowerCase() === username.toLowerCase(),
    );

    if (isUsernameExists) {
      throw new Error(`USERNAME_EXISTS:${username}`);
    }

    // =================================================
    // 4. KIỂM TRA EMAIL TRÙNG
    // =================================================

    const isEmailExists = existingUsers.some(
      (user) => user.email?.trim().toLowerCase() === email,
    );

    if (isEmailExists) {
      throw new Error(`EMAIL_EXISTS:${email}`);
    }

    // =================================================
    // 5. KIỂM TRA SỐ ĐIỆN THOẠI TRÙNG
    // =================================================

    const isPhoneExists = existingUsers.some(
      (user) => user.phone?.trim() === phone,
    );

    if (isPhoneExists) {
      throw new Error(`PHONE_EXISTS:${phone}`);
    }

    // =================================================
    // 6. MÃ HÓA PASSWORD
    // =================================================

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // =================================================
    // 7. PAYLOAD
    // =================================================

    const payload = {
      ...userData,

      username,

      email,

      phone,

      password: hashedPassword,

      createdAt: new Date().toISOString(),

      updatedAt: null,
    };

    // =================================================
    // 8. GỌI API
    // =================================================

    const response = await api.post<User>("/users", payload);

    // =================================================
    // 9. KHÔNG TRẢ PASSWORD VỀ CLIENT
    // =================================================

    const { password: _password, ...userWithoutPassword } = response.data;

    return userWithoutPassword as User;
  } catch (error) {
    console.error("Lỗi khi thêm người dùng:", error);

    throw error;
  }
};

// =====================================================
// CẬP NHẬT NGƯỜI DÙNG
// =====================================================

export const updateUserService = async (
  userId: string | number,
  userData: Partial<User>,
): Promise<User> => {
  try {
    // =================================================
    // 1. KIỂM TRA TRÙNG USERNAME / EMAIL / PHONE
    // =================================================

    const existingUsers = await getUsersService();

    const excludeId = String(userId);

    // --- Username ---

    if (userData.username) {
      const normalizedUsername = userData.username.trim().toLowerCase();

      const isUsernameTaken = existingUsers.some(
        (u) =>
          u.username?.trim().toLowerCase() === normalizedUsername &&
          String(u.id) !== excludeId,
      );

      if (isUsernameTaken) {
        throw new Error(`USERNAME_EXISTS:${userData.username}`);
      }
    }

    // --- Email ---

    if (userData.email) {
      const normalizedEmail = userData.email.trim().toLowerCase();

      const isEmailTaken = existingUsers.some(
        (u) =>
          u.email?.trim().toLowerCase() === normalizedEmail &&
          String(u.id) !== excludeId,
      );

      if (isEmailTaken) {
        throw new Error(`EMAIL_EXISTS:${userData.email}`);
      }
    }

    // --- Phone ---

    if (userData.phone) {
      const normalizedPhone = userData.phone.trim();

      const isPhoneTaken = existingUsers.some(
        (u) =>
          u.phone?.trim() === normalizedPhone &&
          String(u.id) !== excludeId,
      );

      if (isPhoneTaken) {
        throw new Error(`PHONE_EXISTS:${userData.phone}`);
      }
    }

    // =================================================
    // 2. PAYLOAD
    // =================================================

    const payload: Partial<User> = {
      ...userData,
      updatedAt: new Date().toISOString(),
    };

    // =================================================
    // 3. GỌI API
    // =================================================

    const response = await api.patch<User>(`/users/${userId}`, payload);

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);

    throw error;
  }
};

// =====================================================
// XÓA NGƯỜI DÙNG
// =====================================================

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

// =====================================================
// TÌM KIẾM NGƯỜI DÙNG
// =====================================================

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
      const matchesKeyword =
        search === "" ||
        (user.fullName ?? "").toLowerCase().includes(search) ||
        (user.address ?? "").toLowerCase().includes(search) ||
        (user.phone ?? "").toLowerCase().includes(search) ||
        (user.email ?? "").toLowerCase().includes(search);

      const matchesRole = role === "" || user.role === role;

      const matchesStatus = status === "" || user.status === status;

      return matchesKeyword && matchesRole && matchesStatus;
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm người dùng:", error);

    throw error;
  }
};
