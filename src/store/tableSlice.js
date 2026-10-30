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
      const page = params?.page !== undefined ? params.page : (state?.currentPage ?? 1);
      const limit = params?.limit !== undefined ? params.limit : (state?.limit ?? 10);

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
  pages: {},
  total: 0,
  loading: true,
  pageLoading: false,
  error: null,
  filter: '',
  sortCol: null,
  sortKey: null,
  currentPage: 1,
  limit: 10,
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      const page = action.payload;
      state.currentPage = page;
      if (state.pages[page]) {
        state.data = state.pages[page];
      }
    },
    clearPageCache: (state) => {
      state.pages = {};
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.currentPage = 1;
      state.pages = {};
    },
    setSort: (state, action) => {
      state.sortCol = action.payload?.sortCol ?? null;
      state.sortKey = action.payload?.sortKey ?? null;
      state.currentPage = 1;
      state.pages = {};
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.pages = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state, action) => {
        if (state.data.length === 0 && !state.pages[1]) {
          state.loading = true;
        } else {
          state.pageLoading = true;
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
        state.pageLoading = false;

        const incomingRows = Array.isArray(action.payload)
          ? action.payload
          : (action.payload?.rows ?? []);
        const total = action.payload?.total ?? incomingRows.length;
        const page = action.payload?.page ?? 1;
        const limit = action.payload?.limit ?? 10;

        state.total = total;
        state.currentPage = page;
        state.limit = limit;

        // Store page in cache
        state.pages[page] = incomingRows;
        state.data = incomingRows;

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
        state.pageLoading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { setCurrentPage, clearPageCache, setFilter, setSort, resetPagination } =
  tableSlice.actions;

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

export const selectIsPageLoading = createSelector(
  [selectTableState],
  (table) => table.pageLoading
);

export const selectCurrentPage = createSelector(
  [selectTableState],
  (table) => table.currentPage
);

export const selectLimit = createSelector(
  [selectTableState],
  (table) => table.limit
);

export const selectTotalPages = createSelector(
  [selectTotalRows, selectLimit],
  (total, limit) => Math.max(1, Math.ceil(total / (limit || 10)))
);

export const selectPageCache = createSelector(
  [selectTableState],
  (table) => table.pages
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
