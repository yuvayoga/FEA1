import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

const API_URL = 'http://localhost:8080/api';

export const fetchTableData = createAsyncThunk(
  'table/fetchTableData',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const state = getState()?.table;
      const filter =
        params?.filter !== undefined ? params.filter : (state?.filter ?? '');
      const sortCol =
        params?.sortCol !== undefined ? params.sortCol : (state?.sortCol ?? null);
      const sortKey =
        params?.sortKey !== undefined ? params.sortKey : (state?.sortKey ?? null);

      const url = new URL(API_URL);
      if (filter && String(filter).trim()) {
        url.searchParams.set('filter', String(filter).trim());
      }
      if (sortCol) {
        url.searchParams.set('sortCol', sortCol);
      }
      if (sortKey) {
        url.searchParams.set('sortKey', sortKey);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      return json;
    } catch (error) {
      console.error('Failed to fetch table data:', error);
      return rejectWithValue(error.message || 'Failed to fetch table data');
    }
  }
);

const initialState = {
  data: [],
  total: 0,
  loading: true,
  error: null,
  filter: '',
  sortCol: null,
  sortKey: null,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSort: (state, action) => {
      state.sortCol = action.payload?.sortCol ?? null;
      state.sortKey = action.payload?.sortKey ?? null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state, action) => {
        if (state.data.length === 0) {
          state.loading = true;
        }
        state.error = null;
        if (action.meta?.arg?.filter !== undefined) {
          state.filter = action.meta.arg.filter;
        }
        if (action.meta?.arg?.sortCol !== undefined) {
          state.sortCol = action.meta.arg.sortCol;
        }
        if (action.meta?.arg?.sortKey !== undefined) {
          state.sortKey = action.meta.arg.sortKey;
        }
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = Array.isArray(action.payload)
          ? action.payload
          : (action.payload?.rows ?? []);
        state.total = action.payload?.total ?? state.data.length;
        if (action.meta?.arg?.filter !== undefined) {
          state.filter = action.meta.arg.filter;
        }
        if (action.meta?.arg?.sortCol !== undefined) {
          state.sortCol = action.meta.arg.sortCol;
        }
        if (action.meta?.arg?.sortKey !== undefined) {
          state.sortKey = action.meta.arg.sortKey;
        }
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setFilter, setSort } = tableSlice.actions;

const selectTableState = (state) => state.table;

export const selectTableData = createSelector(
  [selectTableState],
  (table) => table.data
);

export const selectTotalRows = createSelector(
  [selectTableState],
  (table) => table.total
);

export const selectIsLoading = createSelector(
  [selectTableState],
  (table) => table.loading
);

export const selectError = createSelector(
  [selectTableState],
  (table) => table.error
);

export const selectFilter = createSelector(
  [selectTableState],
  (table) => table.filter
);

export const selectSortCol = createSelector(
  [selectTableState],
  (table) => table.sortCol
);

export const selectSortKey = createSelector(
  [selectTableState],
  (table) => table.sortKey
);

export default tableSlice.reducer;
