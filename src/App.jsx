import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  AE,
  AT,
  AU,
  BR,
  CA,
  CN,
  DE,
  ES,
  FR,
  GB,
  IE,
  IN,
  IT,
  JP,
  KR,
  MX,
  NL,
  SE,
  SG,
  US,
  ZA,
} from 'country-flag-icons/react/3x2';
import Table from './Table';
import {
  fetchTableData,
  selectTableData,
  selectTotalRows,
  selectIsFetchingMore,
  selectHasMore,
  selectCurrentPage,
  selectError,
} from './store/tableSlice';

const FLAG_ICONS = {
  // ISO 3166-1 alpha-3 codes from backend API
  ARE: AE,
  AUS: AU,
  BRA: BR,
  CAN: CA,
  CHN: CN,
  DEU: DE,
  ESP: ES,
  FRA: FR,
  GBR: GB,
  IND: IN,
  IRL: IE,
  ITA: IT,
  JPN: JP,
  KOR: KR,
  MEX: MX,
  NLD: NL,
  SGP: SG,
  SWE: SE,
  USA: US,
  ZAF: ZA,
  // ISO 3166-1 alpha-2 codes
  AE,
  AT,
  AU,
  BR,
  CA,
  CN,
  DE,
  ES,
  FR,
  GB,
  IE,
  IN,
  IT,
  JP,
  KR,
  MX,
  NL,
  SE,
  SG,
  US,
  ZA,
  // Full names for backwards compatibility
  Germany: DE,
  Mexico: MX,
  Austria: AT,
  UK: GB,
  'United Kingdom': GB,
  Canada: CA,
  Italy: IT,
  'United States': US,
};

const headers = [
  { name: 'company', label: 'Company', sortable: true },
  { name: 'contact', label: 'Contact', sortable: true },
  {
    name: 'country',
    label: 'Country',
    sortable: true,
    render: (row) => {
      const Flag = FLAG_ICONS[row.country];
      return Flag ? (
        <span className="inline-flex items-center gap-2">
          <Flag title={row.country} className="h-4 w-6 rounded-xs shadow-xs" />
          <span>{row.country}</span>
        </span>
      ) : (
        row.country
      );
    },
  },
];

export default function App() {
  const dispatch = useDispatch();
  const data = useSelector(selectTableData);
  const total = useSelector(selectTotalRows);
  const isFetchingMore = useSelector(selectIsFetchingMore);
  const hasMore = useSelector(selectHasMore);
  const currentPage = useSelector(selectCurrentPage);
  const error = useSelector(selectError);
  const [countdown, setCountdown] = useState(2);
  const [initialLoading, setInitialLoading] = useState(true);

  const [searchText, setSearchText] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortKey, setSortKey] = useState(null);

  const sortRef = useRef({ sortCol, sortKey });

  useEffect(() => {
    sortRef.current = { sortCol, sortKey };
  }, [sortCol, sortKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(async () => {
      await dispatch(fetchTableData({ page: 1, limit: 100 })).unwrap().catch(() => {});
      setInitialLoading(false);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  // Debounced search query param updates
  useEffect(() => {
    if (initialLoading) return;

    const timer = setTimeout(() => {
      dispatch(
        fetchTableData({
          filter: searchText,
          sortCol: sortRef.current.sortCol,
          sortKey: sortRef.current.sortKey,
          page: 1,
          limit: 100,
        })
      );
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText, initialLoading, dispatch]);

  // Handle column header sort updates via query params
  const handleSort = (column, direction) => {
    setSortCol(column);
    setSortKey(direction);
    dispatch(
      fetchTableData({
        filter: searchText,
        sortCol: column,
        sortKey: direction,
        page: 1,
        limit: 100,
      })
    );
  };

  // Infinite scroll load more handler
  const handleLoadMore = useCallback(() => {
    if (!hasMore || isFetchingMore || initialLoading) return;
    dispatch(
      fetchTableData({
        filter: searchText,
        sortCol: sortRef.current.sortCol,
        sortKey: sortRef.current.sortKey,
        page: currentPage + 1,
        limit: 100,
      })
    );
  }, [hasMore, isFetchingMore, initialLoading, searchText, currentPage, dispatch]);

  return (
    <div className="mx-auto mt-12 max-w-5xl px-4">
      {initialLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] py-16 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4" />
          <p className="text-3xl font-bold text-gray-800">
            Loading...
          </p>
          <span className="mt-3 px-4 py-1 text-sm font-semibold text-gray-600">
            {countdown}s remaining
          </span>
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-600">
          <p className="font-semibold">Error loading table data:</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-sm">
            <div className="flex w-full items-center gap-3">
              <label
                htmlFor="filter-input"
                className="text-sm font-semibold text-gray-700 whitespace-nowrap"
              >
                Filter:
              </label>
              <input
                id="filter-input"
                type="text"
                placeholder="Search across all columns..."
                value={searchText}
                onChange={handleSearchChange}
                className="w-full flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <Table
            headers={headers}
            data={data}
            sortCol={sortCol || undefined}
            sortKey={sortKey || undefined}
            onSort={handleSort}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            isFetchingMore={isFetchingMore}
            total={total}
          />
        </div>
      )}
    </div>
  );
}
