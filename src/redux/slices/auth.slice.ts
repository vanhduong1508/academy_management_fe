// src/redux/slices/auth.slice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, UserRole, UserSimpleResponse } from '../../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'failed';
}

const storedUser = localStorage.getItem('authUser');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser,
  status: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Nhận data raw từ BE (UserSimpleResponse)
    setCredentials: (state, action: PayloadAction<UserSimpleResponse>) => {
      const backendUser = action.payload;

      // BE trả role: "ADMIN" | "STUDENT"
      const normalizedRole: UserRole =
        backendUser.role.toLowerCase() === 'admin' ? 'admin' : 'student';

      const user: AuthUser = {
        id: backendUser.id,
        username: backendUser.username,
        role: normalizedRole,
      };

      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('authUser', JSON.stringify(user));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authUser');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
