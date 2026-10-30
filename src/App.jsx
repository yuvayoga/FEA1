import { useState, useEffect, useRef } from 'react';
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
  setCurrentPage,
  selectTableData,
  selectTotalRows,
  selectCurrentPage,
  selectTotalPages,
  selectPageCache,
  selectIsPageLoading,
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
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const pageCache = useSelector(selectPageCache);
  const isPageLoading = useSelector(selectIsPageLoading);
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
      await dispatch(fetchTableData({ page: 1, limit: 10 })).unwrap().catch(() => {});
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
          limit: 10,
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
        limit: 10,
      })
    );
  };

  // Step pagination navigation handler
  // Requirement: "If there is no data for the page the user is navigating to make a fetch call"
  const handleNavigatePage = (targetPage) => {
    if (targetPage < 1 || targetPage > totalPages || targetPage === currentPage) return;

    const cachedPage = pageCache[targetPage];
    if (cachedPage && cachedPage.length > 0) {
      // Page data exists in client cache: avoid network fetch
      dispatch(setCurrentPage(targetPage));
    } else {
      // No data for this page: make a fetch call
      dispatch(
        fetchTableData({
          filter: searchText,
          sortCol: sortRef.current.sortCol,
          sortKey: sortRef.current.sortKey,
          page: targetPage,
          limit: 10,
        })
      );
    }
  };

  const hasLeftPage = currentPage > 1;
  const hasRightPage = currentPage < totalPages;

  return (
    <div className="mx-auto mt-12 max-w-5xl px-4 pb-16">
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
          />

          {/* Step Pagination Controls */}
          <div className="flex flex-col items-center justify-center pt-4">
            <div className="flex items-center justify-center gap-2">
              {/* Left arrow button */}
              <button
                id="pagination-prev"
                type="button"
                aria-label="Previous page"
                disabled={!hasLeftPage}
                onClick={() => handleNavigatePage(currentPage - 1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition shadow-sm ${
                  !hasLeftPage
                    ? 'border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 cursor-pointer'
                }`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {/* Left page button (currentPage - 1): empty and invisible if first page is selected */}
              <button
                id="pagination-left-page"
                type="button"
                aria-label={hasLeftPage ? `Page ${currentPage - 1}` : 'Empty page button'}
                disabled={!hasLeftPage}
                onClick={() => hasLeftPage && handleNavigatePage(currentPage - 1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                  hasLeftPage
                    ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm cursor-pointer'
                    : 'invisible pointer-events-none'
                }`}
              >
                {hasLeftPage ? currentPage - 1 : ''}
              </button>

              {/* Center page button: contains current page number */}
              <button
                id="pagination-center-page"
                type="button"
                aria-label={`Page ${currentPage}`}
                aria-current="page"
                onClick={() => handleNavigatePage(currentPage)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-blue-600 bg-blue-600 text-white font-semibold text-sm shadow-sm cursor-default"
              >
                {currentPage}
              </button>

              {/* Right page button (currentPage + 1): empty and invisible if last page is selected */}
              <button
                id="pagination-right-page"
                type="button"
                aria-label={hasRightPage ? `Page ${currentPage + 1}` : 'Empty page button'}
                disabled={!hasRightPage}
                onClick={() => hasRightPage && handleNavigatePage(currentPage + 1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition ${
                  hasRightPage
                    ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 shadow-sm cursor-pointer'
                    : 'invisible pointer-events-none'
                }`}
              >
                {hasRightPage ? currentPage + 1 : ''}
              </button>

              {/* Right arrow button */}
              <button
                id="pagination-next"
                type="button"
                aria-label="Next page"
                disabled={!hasRightPage}
                onClick={() => handleNavigatePage(currentPage + 1)}
                className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition shadow-sm ${
                  !hasRightPage
                    ? 'border-gray-200 bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 active:bg-gray-100 cursor-pointer'
                }`}
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>

            {/* Pagination status info */}
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
              <span>
                Page {currentPage} of {totalPages} ({total} rows)
              </span>
              {isPageLoading && (
                <div className="flex items-center gap-1 text-blue-600">
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
                  <span>Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
