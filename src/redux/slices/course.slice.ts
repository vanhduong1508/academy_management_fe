// src/redux/slices/course.slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Course, PageResponse } from '../../types/models/course.types';
import { getCoursesPageApi } from '../../api/course.api';

interface CourseState {
  items: Course[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  items: [],
  totalElements: 0,
  totalPages: 0,
  page: 0,
  size: 10,
  loading: false,
  error: null,
};

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (params: { page?: number; size?: number } | undefined, { rejectWithValue }) => {
    try {
      const page = params?.page ?? 0;
      const size = params?.size ?? 10;
      return await getCoursesPageApi(page, size);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load courses');
    }
  }
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCourses.fulfilled,
        (state, action: PayloadAction<PageResponse<Course>>) => {
          state.loading = false;
          state.items = action.payload.content;
          state.totalElements = action.payload.totalElements;
          state.totalPages = action.payload.totalPages;
          state.page = action.payload.number;
          state.size = action.payload.size;
        }
      )
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default courseSlice.reducer;
