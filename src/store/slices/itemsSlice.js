// src/store/slices/itemsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestoreService from '../../services/firestoreService';

// Async thunks for items
export const fetchItems = createAsyncThunk(
  'items/fetchItems',
  async (userId, { rejectWithValue }) => {
    try {
      const items = await firestoreService.getItems(userId);
      return items;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addItem = createAsyncThunk(
  'items/addItem',
  async ({ userId, item }, { rejectWithValue }) => {
    try {
      const itemId = await firestoreService.addItem(userId, item);
      return { id: itemId, ...item, createdAt: new Date(), updatedAt: new Date() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateItem = createAsyncThunk(
  'items/updateItem',
  async ({ userId, itemId, updates }, { rejectWithValue }) => {
    try {
      await firestoreService.updateItem(userId, itemId, updates);
      return { id: itemId, ...updates, updatedAt: new Date() };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteItem = createAsyncThunk(
  'items/deleteItem',
  async ({ userId, itemId }, { rejectWithValue }) => {
    try {
      await firestoreService.deleteItem(userId, itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const itemsSlice = createSlice({
  name: 'items',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    clearItems: (state) => {
      state.items = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Item
      .addCase(addItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
        state.error = null;
      })
      .addCase(addItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setItems, clearItems, clearError } = itemsSlice.actions;

// Selectors
export const selectItems = (state) => state.items.items;
export const selectItemsLoading = (state) => state.items.isLoading;
export const selectItemsError = (state) => state.items.error;
export const selectItemsTotal = (state) => 
  state.items.items.reduce((total, item) => total + (item.cost || 0), 0);

export default itemsSlice.reducer;