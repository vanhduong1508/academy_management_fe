// src/redux/slices/admin.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthUser, UserSimpleResponse } from '../../types';

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

const mapToAuthUser = (user: UserSimpleResponse): AuthUser => ({
  id: user.id,
  username: user.username,
  role: user.username === 'admin' ? 'admin' : 'student',
});

const authSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<UserSimpleResponse>) => {
      const mapped = mapToAuthUser(action.payload);
      state.user = mapped;
      state.isAuthenticated = true;
      localStorage.setItem('authUser', JSON.stringify(mapped));
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
