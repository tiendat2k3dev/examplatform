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

// ===============================
// Initial State
// ===============================

const initialState: AuthState = {
  currentUser: null,
};

// ===============================
// Error Helper
// ===============================

const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (typeof error === "object" && error !== null) {
    const errorObject = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    return (
      errorObject.response?.data?.message ||
      errorObject.message ||
      defaultMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};

// ===============================
// Auth Slice
// ===============================

const authReducer = createSlice({
  name: "authReducer",

  initialState,

  reducers: {
    // Đồng bộ currentUser từ LocalStorage
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

    // Register
    register: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },

    // Login
    login: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },

    // Update user
    updateUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },

    // Logout
    logout: (state) => {
      state.currentUser = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }

      toast.info("Đã đăng xuất tài khoản!");
    },
  },
});

// ===============================
// Export Actions
// ===============================

export const { initCurrentUser, register, login, updateUser, logout } =
  authReducer.actions;

export default authReducer.reducer;

// ===============================
// Register API Async
// ===============================

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
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error, "Đăng ký thất bại!");

      console.error("Register error:", error);

      toast.error(errorMsg);

      throw error;
    }
  };

// ===============================
// Login API Async
// ===============================

export const loginApiAsync =
  (payload: LoginPayload, onSuccess?: (user: User) => void) =>
  async (dispatch: AppDispatch) => {
    try {
      const data = await loginService(payload);

      const { password: _password, ...userWithoutPassword } = data;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      }

      dispatch(login(userWithoutPassword as User));

      toast.success("Đăng nhập thành công!");

      if (onSuccess) {
        onSuccess(userWithoutPassword as User);
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error, "Đăng nhập thất bại!");

      console.error("Login error:", error);

      toast.error(errorMsg);

      throw error;
    }
  };

// ===============================
// Update User API Async
// ===============================

export const updateUserApiAsync =
  (
    userId: string | number,
    payload: UpdateUserPayload,
    onSuccess?: () => void,
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      const updatedUser = await updateUserService(userId, payload);

      const { password: _password, ...userWithoutPassword } = updatedUser;

      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      }

      dispatch(updateUser(userWithoutPassword as User));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error, "Cập nhật thất bại!");

      console.error("Update error:", error);

      toast.error(errorMsg);

      throw error;
    }
  };

// ===============================
// Change Password API Async
// ===============================

export const changePasswordApiAsync =
  (
    userId: string | number,
    payload: ChangePasswordPayload,
    onSuccess?: () => void,
  ) =>
  async () => {
    try {
      await changePasswordService(userId, payload);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMsg = getErrorMessage(error, "Đổi mật khẩu thất bại!");

      console.error("Change password error:", error);

      toast.error(errorMsg);

      throw error;
    }
  };
