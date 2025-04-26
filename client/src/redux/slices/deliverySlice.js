// src/redux/slices/deliverySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as deliveryApi from '../../api/deliveryApi';

const initialState = {
  deliveries: [],
  currentDelivery: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getDeliveryByOrder = createAsyncThunk(
  'delivery/getByOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.getDeliveryByOrder(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch delivery details');
    }
  }
);

export const getMyDeliveries = createAsyncThunk(
  'delivery/getMyDeliveries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.getMyDeliveries();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch delivery assignments');
    }
  }
);

export const updateDeliveryStatus = createAsyncThunk(
  'delivery/updateStatus',
  async ({ id, statusData }, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.updateDeliveryStatus(id, statusData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update delivery status');
    }
  }
);

export const updateDeliveryLocation = createAsyncThunk(
  'delivery/updateLocation',
  async (locationData, { rejectWithValue }) => {
    try {
      const response = await deliveryApi.updateDeliveryLocation(locationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update location');
    }
  }
);

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentDelivery: (state) => {
      state.currentDelivery = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Delivery By Order
      .addCase(getDeliveryByOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDeliveryByOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDelivery = action.payload.data.delivery;
      })
      .addCase(getDeliveryByOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get My Deliveries
      .addCase(getMyDeliveries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyDeliveries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.deliveries = action.payload.data.deliveries;
      })
      .addCase(getMyDeliveries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Delivery Status
      .addCase(updateDeliveryStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDeliveryStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentDelivery = action.payload.data.delivery;
        
        // Update delivery in deliveries list
        const index = state.deliveries.findIndex(
          (delivery) => delivery._id === action.payload.data.delivery._id
        );
        if (index !== -1) {
          state.deliveries[index] = action.payload.data.delivery;
        }
      })
      .addCase(updateDeliveryStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Delivery Location
      .addCase(updateDeliveryLocation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateDeliveryLocation.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update current location if needed
      })
      .addCase(updateDeliveryLocation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;