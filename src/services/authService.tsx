// src/services/authService.ts
import axios from "axios";
import bcrypt from "bcryptjs";
import { User, LoginPayload, UpdateUserPayload, ChangePasswordPayload } from "@/types/user";

const API_URL = "http://localhost:4000/users";

export const registerService = async (
  userData: Omit<User, "id" | "role" | "avatarUrl" | "createdAt" | "updatedAt">,
): Promise<User> => {
  try {
    // 1. Kiểm tra username đã tồn tại chưa
    const check = await axios.get<User[]>(
      `${API_URL}?username=${userData.username}`,
    );
    if (check.data.length > 0) {
      throw new Error("Tên đăng nhập đã tồn tại trong hệ thống!");
    }

    // 2. Tạo User ID tự động theo ngày giờ tháng năm
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const userId = `USER-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;

    // 3. Mã hóa mật khẩu bằng bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // 4. Chuẩn bị đối tượng user mới
    const newUser: User = {
      id: userId,
      ...userData,
      password: hashedPassword,
      role: "User",
      avatarUrl: "",
      createdAt: now.toISOString(),
      updatedAt: null,
    };

    // 5. Gửi request POST
    const response = await axios.post<User>(API_URL, newUser);
    return response.data;
  } catch (error) {
    console.error("Register failed:", error);
    throw error;
  }
};

export const loginService = async (payload: LoginPayload): Promise<User> => {
  try {
    // 1. Tìm kiếm user theo username trong cơ sở dữ liệu
    const response = await axios.get<User[]>(
      `${API_URL}?username=${payload.username}`,
    );
    const users = response.data;

    if (users.length === 0) {
      throw new Error("Tên đăng nhập không tồn tại trong hệ thống!");
    }

    const user = users[0];

    // 2. So sánh mật khẩu nhập vào với mật khẩu đã mã hóa (hash) trong database bằng bcryptjs
    const isPasswordValid = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new Error("Mật khẩu không chính xác!");
    }

    // 3. Đăng nhập thành công, trả về thông tin user
    return user;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

export const updateUserService = async (
  userId: string | number,
  payload: UpdateUserPayload,
): Promise<User> => {
  try {
    // Gửi request PATCH lên json-server để cập nhật thông tin
    const response = await axios.patch<User>(`${API_URL}/${userId}`, {
      ...payload,
      updatedAt: new Date().toISOString(),
    });

    return response.data;
  } catch (error) {
    console.error("Update user failed:", error);
    throw error;
  }
};

export const changePasswordService = async (
  userId: string | number,
  payload: ChangePasswordPayload
): Promise<void> => {
  try {
    if (payload.newPassword !== payload.confirmNewPassword) {
      throw new Error("Mật khẩu mới và xác nhận mật khẩu không khớp!");
    }

    // 1. Lấy thông tin user hiện tại từ server để kiểm tra password cũ
    const response = await axios.get<User>(`${API_URL}/${userId}`);
    const user = response.data;

    // 2. So sánh mật khẩu cũ với mật khẩu đã mã hóa trong DB
    const isPasswordValid = await bcrypt.compare(payload.oldPassword, user.password);
    if (!isPasswordValid) {
      throw new Error("Mật khẩu hiện tại không chính xác!");
    }

    // 3. Mã hóa mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(payload.newPassword, salt);

    // 4. Gửi request PATCH cập nhật mật khẩu mới
    await axios.patch(`${API_URL}/${userId}`, {
      password: hashedNewPassword,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Change password failed:", error);
    throw error;
  }
};