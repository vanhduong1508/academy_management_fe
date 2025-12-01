// /src/redux/store.ts (Cần phải có file này)

import { configureStore } from '@reduxjs/toolkit';
import orderReducer from './slices/order.slice';
import authReducer from './slices/auth.slice';
import courseReducer from './slices/course.slice';

export const store = configureStore({
    reducer: {
        orderManagement: orderReducer,
        auth: authReducer, 
        orders: orderReducer,
        courses: courseReducer,

    },
});

// Định nghĩa types cho Store và Dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;