// src/redux/slices/auth.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, AuthResponse } from '../../types';

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
    // Nhận đúng AuthResponse từ BE
    setCredentials: (state, action: PayloadAction<AuthResponse>) => {
      const { token, user } = action.payload;

      const mapped: AuthUser = {
        id: user.id,
        username: user.username,
        role: user.role, // 'ADMIN' | 'STUDENT'
        token,
      };

      state.user = mapped;
      state.isAuthenticated = true;
      state.status = 'idle';

      localStorage.setItem('authUser', JSON.stringify(mapped));
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      localStorage.removeItem('authUser');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
