import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer, 
    },
});

// Định nghĩa types cho Store và Dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;