import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DE, MX, AT, GB, CA, IT } from 'country-flag-icons/react/3x2';
import Table from './Table';
import {
  fetchTableData,
  selectTableData,
  selectIsLoading,
  selectError,
} from './store/tableSlice';

const FLAG_ICONS = {
  Germany: DE,
  Mexico: MX,
  Austria: AT,
  UK: GB,
  'United Kingdom': GB,
  Canada: CA,
  Italy: IT,
  DE,
  MX,
  AT,
  GB,
  CA,
  IT,
};

const headers = [
  { name: 'company', label: 'Company' },
  { name: 'contact', label: 'Contact' },
  {
    name: 'country',
    label: 'Country',
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
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [countdown, setCountdown] = useState(2);

  const [searchText, setSearchText] = useState('');
  const [sortData, setSortData] = useState({
    column: headers[0].name,
    order: 'descending',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      dispatch(fetchTableData());
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [dispatch]);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleColumnChange = (e) => {
    setSortData((prev) => ({
      ...prev,
      column: e.target.value,
    }));
  };

  const handleOrderChange = (e) => {
    setSortData((prev) => ({
      ...prev,
      order: e.target.value,
    }));
  };

  const filteredData = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return data;

    return data.filter((row) =>
      headers.some((header) => {
        const cellValue = row[header.name];
        if (cellValue === null || cellValue === undefined) return false;
        return String(cellValue).toLowerCase().includes(query);
      })
    );
  }, [data, searchText]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const valA = a[sortData.column];
      const valB = b[sortData.column];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      const comparison = String(valA).localeCompare(String(valB), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      const isAscending = sortData.order === 'ascending';
      return isAscending ? comparison : -comparison;
    });
  }, [filteredData, sortData]);

  return (
    <div className="mx-auto mt-12 max-w-5xl px-4">
      {loading ? (
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
          <div className="flex flex-col gap-4 rounded-xl border border-gray-300 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
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
                className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-column"
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  Sort by:
                </label>
                <select
                  id="sort-column"
                  value={sortData.column}
                  onChange={handleColumnChange}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {headers.map((header) => (
                    <option key={header.name} value={header.name}>
                      {header.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="sort-order"
                  className="text-sm font-semibold text-gray-700 whitespace-nowrap"
                >
                  Order:
                </label>
                <select
                  id="sort-order"
                  value={sortData.order}
                  onChange={handleOrderChange}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="descending">Descending</option>
                  <option value="ascending">Ascending</option>
                </select>
              </div>
            </div>
          </div>

          <Table headers={headers} data={sortedData} />
        </div>
      )}
    </div>
  );
}
