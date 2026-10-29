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
      const page = params?.page !== undefined ? params.page : (state?.page ?? 1);
      const limit = params?.limit !== undefined ? params.limit : (state?.limit ?? 100);

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
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(limit));

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      return { ...json, page, limit };
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
  isFetchingMore: false,
  error: null,
  filter: '',
  sortCol: null,
  sortKey: null,
  page: 1,
  limit: 100,
  hasMore: true,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.page = 1;
    },
    setSort: (state, action) => {
      state.sortCol = action.payload?.sortCol ?? null;
      state.sortKey = action.payload?.sortKey ?? null;
      state.page = 1;
    },
    resetPagination: (state) => {
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state, action) => {
        const page = action.meta?.arg?.page ?? 1;
        if (page === 1) {
          if (state.data.length === 0) {
            state.loading = true;
          }
          state.isFetchingMore = false;
        } else {
          state.isFetchingMore = true;
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
        state.isFetchingMore = false;

        const incomingRows = Array.isArray(action.payload)
          ? action.payload
          : (action.payload?.rows ?? []);
        const total = action.payload?.total ?? incomingRows.length;
        const page = action.payload?.page ?? 1;
        const limit = action.payload?.limit ?? 100;

        state.total = total;
        state.page = page;
        state.limit = limit;

        if (page === 1) {
          state.data = incomingRows;
        } else {
          state.data = [...state.data, ...incomingRows];
        }

        state.hasMore = state.data.length < total && incomingRows.length > 0;

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
        state.isFetchingMore = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setFilter, setSort, resetPagination } = tableSlice.actions;

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

export const selectIsFetchingMore = createSelector(
  [selectTableState],
  (table) => table.isFetchingMore
);

export const selectHasMore = createSelector(
  [selectTableState],
  (table) => table.hasMore
);

export const selectCurrentPage = createSelector(
  [selectTableState],
  (table) => table.page
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
