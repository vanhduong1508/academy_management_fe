// src/redux/slices/auth.slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse, AuthUser } from "../../types/auth/auth.types";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, user } = action.payload;

      const mappedUser: AuthUser = {
        id: user.id,
        username: user.username,
        role: user.role,
      };

      state.user = mappedUser;
      state.token = token;

      if (token) localStorage.setItem("token", token);
      else localStorage.removeItem("token");
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
