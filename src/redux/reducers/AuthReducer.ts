// src/redux/reducers/AuthReducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const initialState: AuthState = {
  currentUser:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null,
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
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
    },
  },
});

export const { register, login, updateUser, logout } = authReducer.actions;

export default authReducer.reducer;

// Async Thunks cho Register
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
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Đăng ký thất bại!";
      console.error("Register error:", error);
      alert(errorMsg);
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

      if (onSuccess) {
        onSuccess(data);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Đăng nhập thất bại!";
      console.error("Login error:", error);
      alert(errorMsg);
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

      if (onSuccess) {
        onSuccess();
      }
      alert("Cập nhật thông tin thành công!");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || error.message || "Cập nhật thất bại!";
      console.error("Update error:", error);
      alert(errorMsg);
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
      alert("Đổi mật khẩu thành công!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "Đổi mật khẩu thất bại!";
      console.error("Change password error:", error);
      alert(errorMsg);
      throw error;
    }
  };
