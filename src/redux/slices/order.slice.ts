// src/redux/slices/order.slice.ts
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Order, OrderCreatePayload } from '../../types/models/order.types';
import type { Enrollment } from '../../types/models/enrollment.types';
import {
  getPendingOrdersApi,
  approveOrderApi,
  rejectOrderApi,
  createOrderApi,
  getMyEnrollmentsApi,
} from '../../api/order.api';

interface OrderState {
  pendingOrders: Order[];
  myEnrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  pendingOrders: [],
  myEnrollments: [],
  loading: false,
  error: null,
};

// ADMIN
export const fetchPendingOrders = createAsyncThunk(
  'orders/fetchPendingOrders',
  async (_, { rejectWithValue }) => {
    try {
      return await getPendingOrdersApi();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load orders');
    }
  }
);

export const approveOrder = createAsyncThunk(
  'orders/approveOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await approveOrderApi(orderId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to approve order');
    }
  }
);

export const rejectOrder = createAsyncThunk(
  'orders/rejectOrder',
  async (orderId: number, { rejectWithValue }) => {
    try {
      return await rejectOrderApi(orderId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to reject order');
    }
  }
);

// STUDENT
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (payload: OrderCreatePayload, { rejectWithValue }) => {
    try {
      return await createOrderApi(payload);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);

export const fetchMyEnrollments = createAsyncThunk(
  'orders/fetchMyEnrollments',
  async (studentId: number, { rejectWithValue }) => {
    try {
      return await getMyEnrollmentsApi(studentId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load enrollments');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // pending orders
    builder
      .addCase(fetchPendingOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false;
        state.pendingOrders = action.payload;
      })
      .addCase(fetchPendingOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(approveOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.pendingOrders = state.pendingOrders.filter((o) => o.id !== action.payload.id);
      })
      .addCase(approveOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    builder
      .addCase(rejectOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.pendingOrders = state.pendingOrders.filter((o) => o.id !== action.payload.id);
      })
      .addCase(rejectOrder.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // my enrollments
    builder
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyEnrollments.fulfilled,
        (state, action: PayloadAction<Enrollment[]>) => {
          state.loading = false;
          state.myEnrollments = action.payload;
        }
      )
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default orderSlice.reducer;
