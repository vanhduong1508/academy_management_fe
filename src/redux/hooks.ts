import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store'; 

// Sử dụng các type đã định nghĩa để tạo các hook đã được typed
// Điều này giúp TypeScript hiểu được kiểu dữ liệu của state
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;