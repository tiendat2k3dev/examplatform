// src/redux/reducers/AuthReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {
  User,
  AuthState,
  LoginPayload,
  UpdateUserPayload,
  ChangePasswordPayload,
} from "@/types/user";
import {
  registerService,
  loginService,
  updateUserService,
  changePasswordService,
} from "@/services/authService";
import { AppDispatch } from "../store";

// Khởi tạo initialState an toàn, không gọi window / localStorage ngay lúc khởi tạo module
const initialState: AuthState = {
  currentUser: null,
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    // Action đồng bộ state từ Client Side (Local Storage)
    initCurrentUser: (state) => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            state.currentUser = JSON.parse(storedUser);
          } catch {
            state.currentUser = null;
          }
        }
      }
    },
    register: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    logout: (state) => {
      state.currentUser = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
      toast.info("Đã đăng xuất tài khoản!");
    },
  },
});

export const { initCurrentUser, register, login, updateUser, logout } =
  authReducer.actions;
export default authReducer.reducer;

// Async Thunk cho Register
export const registerApiAsync =
  (
    userData: Omit<
      User,
      "id" | "role" | "avatarUrl" | "createdAt" | "updatedAt"
    >,
    onSuccess?: () => void,
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await registerService(userData);
      dispatch(register(data));
      toast.success("Đăng ký tài khoản thành công!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Đăng ký thất bại!";
      console.error("Register error:", error);
      toast.error(errorMsg);
      throw error;
    }
  };

// Async Thunk cho Login
export const loginApiAsync =
  (payload: LoginPayload, onSuccess?: (user: User) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await loginService(payload);
      const { password, ...userWithoutPassword } = data;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      }

      dispatch(login(userWithoutPassword as User));
      toast.success("Đăng nhập thành công!");

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Đăng nhập thất bại!";
      console.error("Login error:", error);
      toast.error(errorMsg);
      throw error;
    }
  };

// Async Thunk cho Update User
export const updateUserApiAsync =
  (
    userId: string | number,
    payload: UpdateUserPayload,
    onSuccess?: () => void,
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const updatedUser = await updateUserService(userId, payload);
      const { password, ...userWithoutPassword } = updatedUser as any;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      }

      dispatch(updateUser(userWithoutPassword as User));
      toast.success("Cập nhật thông tin cá nhân thành công!");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Cập nhật thất bại!";
      console.error("Update error:", error);
      toast.error(errorMsg);
      throw error;
    }
  };

// Async Thunk cho Change Password
export const changePasswordApiAsync =
  (
    userId: string | number,
    payload: ChangePasswordPayload,
    onSuccess?: () => void,
  ) =>
  async () => {
    try {
      await changePasswordService(userId, payload);
      toast.success("Đổi mật khẩu thành công!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Đổi mật khẩu thất bại!";
      console.error("Change password error:", error);
      toast.error(errorMsg);
      throw error;
    }
  };
