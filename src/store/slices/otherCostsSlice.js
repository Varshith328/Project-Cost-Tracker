// src/store/slices/otherCostsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestoreService from '../../services/firestoreService';

// Async thunks for other costs
export const fetchOtherCosts = createAsyncThunk(
  'otherCosts/fetchOtherCosts',
  async (userId, { rejectWithValue }) => {
    try {
      const costs = await firestoreService.getOtherCosts(userId);
      return costs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addOtherCost = createAsyncThunk(
  'otherCosts/addOtherCost',
  async ({ userId, otherCost }, { rejectWithValue }) => {
    try {
      const costId = await firestoreService.addOtherCost(userId, otherCost);
      return { id: costId, ...otherCost, createdAt: new Date(), updatedAt: new Date() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOtherCost = createAsyncThunk(
  'otherCosts/updateOtherCost',
  async ({ userId, costId, updates }, { rejectWithValue }) => {
    try {
      await firestoreService.updateOtherCost(userId, costId, updates);
      return { id: costId, ...updates, updatedAt: new Date() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteOtherCost = createAsyncThunk(
  'otherCosts/deleteOtherCost',
  async ({ userId, costId }, { rejectWithValue }) => {
    try {
      await firestoreService.deleteOtherCost(userId, costId);
      return costId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const otherCostsSlice = createSlice({
  name: 'otherCosts',
  initialState: {
    otherCosts: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setOtherCosts: (state, action) => {
      state.otherCosts = action.payload;
    },
    clearOtherCosts: (state) => {
      state.otherCosts = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Other Costs
      .addCase(fetchOtherCosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOtherCosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otherCosts = action.payload;
        state.error = null;
      })
      .addCase(fetchOtherCosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Other Cost
      .addCase(addOtherCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addOtherCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otherCosts.unshift(action.payload);
        state.error = null;
      })
      .addCase(addOtherCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Other Cost
      .addCase(updateOtherCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOtherCost.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.otherCosts.findIndex(cost => cost.id === action.payload.id);
        if (index !== -1) {
          state.otherCosts[index] = { ...state.otherCosts[index], ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateOtherCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Other Cost
      .addCase(deleteOtherCost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteOtherCost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.otherCosts = state.otherCosts.filter(cost => cost.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteOtherCost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setOtherCosts, clearOtherCosts, clearError } = otherCostsSlice.actions;

// Selectors
export const selectOtherCosts = (state) => state.otherCosts.otherCosts;
export const selectOtherCostsLoading = (state) => state.otherCosts.isLoading;
export const selectOtherCostsError = (state) => state.otherCosts.error;
export const selectOtherCostsTotal = (state) => 
  state.otherCosts.otherCosts.reduce((total, cost) => total + (cost.amount || 0), 0);

export default otherCostsSlice.reducer;