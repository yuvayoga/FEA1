import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:3000/data';

export const fetchTableData = createAsyncThunk(
  'table/fetchTableData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Failed to fetch from json-server:', error);
      return rejectWithValue(error.message || 'Failed to fetch table data');
    }
  }
);

const initialState = {
  data: [],
  loading: true,
  error: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

const selectTableState = (state) => state.table;

export const selectTableData = createSelector(
  [selectTableState],
  (table) => table.data
);

export const selectIsLoading = createSelector(
  [selectTableState],
  (table) => table.loading
);

export const selectError = createSelector(
  [selectTableState],
  (table) => table.error
);

export default tableSlice.reducer;
