import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser, AuthResponse } from "../../types";

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
      const {
        token,
        userId,
        username,
        fullName,
        role,
        studentId,
        studentCode,
      } = action.payload;

      const mapped: AuthUser = {
        id: userId,
        username,
        fullName,
        role,
        studentId,
        studentCode,
      };

      state.user = mapped;
      state.token = token;
      localStorage.setItem("token", token);
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
