# FEA - Frontend Assignments

This repository contains the progressive development of Frontend Assignments built with **React 19**, **Vite**, and **Tailwind CSS**.

---

## Assignment Breakdown

### Assignment 1: Hardcoded Table Component
- Built the initial user interface using React and Tailwind CSS.
- Implemented static table layout with styled header cells and hardcoded company data rows.
- Added visual styling: rounded borders, subtle drop shadows, alternating zebra striping (`even:bg-gray-200`), and interactive row hover effects (`hover:bg-blue-100`).

### Assignment 2 (FEA2): Prop-Driven Table Component
- Refactored the hardcoded table into a modular, reusable **`<Table />`** component.
- Made the table fully dynamic and data-agnostic by introducing two required props:
  - **`headers`**: Array of column definitions (`{ name, label }`). Uses `label` for table header text and `name` to match row keys.
  - **`data`**: Array of row objects. Dynamically renders cell values using `row[header.name]`.
- Updated parent component ([`App.jsx`](src/App.jsx)) to configure headers and pass props into `<Table headers={headers} data={tableData} />`.

### Assignment 3 (FEA3): REST API Server with `json-server` & Loading State
- Moved row data to an external [`db.json`](db.json) file served as a full mock REST API via **`json-server`**.
- Server runs locally at `http://localhost:3000/data` with built-in CORS support.
- Updated [`App.jsx`](src/App.jsx) to use:
  - **`useState`** to hold and manage table data fetched from the HTTP endpoint.
  - **`useState`** to manage `loading` state (defaults to `true`).
  - **`useEffect`** with the native `fetch` API to retrieve `http://localhost:3000/data`.
- Implements a prominent, centered loading screen with an animated spinner, bold text, and a **2-second real-time countdown timer** (`{countdown}s remaining`).
- Automatically transitions and renders `<Table />` once the 2-second countdown and data fetch complete.

### Assignment 4 (FEA4): Redux Toolkit State Management
- Replaced component-level local state with centralized state management using **Redux Toolkit** and **React-Redux**.
- **`src/store/tableSlice.js`**:
  - **`createAsyncThunk` (`fetchTableData`)**: Handles asynchronous fetching of table rows from `http://localhost:3000/data` with error handling.
  - **`createSlice` (`tableSlice`)**: Manages `data`, `loading`, and `error` states responding to `fetchTableData` lifecycle actions (`pending`, `fulfilled`, `rejected`).
  - **`createSelector` (`selectTableData`, `selectIsLoading`, `selectError`)**: Implements memoized selectors for optimal re-rendering and data derivation.
- **`src/store/store.js`**:
  - Configures the central Redux store using **`configureStore`** with the `tableReducer`.
- **`src/main.jsx`**:
  - Wraps the root `<App />` component in **`<Provider store={store}>`**.
- **`src/App.jsx`**:
  - Dispatches `fetchTableData` using **`useDispatch`**.
  - Reads data and loading state using **`useSelector`** with the memoized `selectTableData` and `selectIsLoading` selectors.

### Assignment 5 (FEA5): Filtering and Sorting
- Added interactive filtering and dynamic sorting controls directly above the table in the parent component ([`App.jsx`](src/App.jsx)).
- **Filter Feature**:
  - Rendered a filter text input above the table.
  - Tracked search text in local component state (`useState('')`).
  - Performs case-insensitive substring matching against each column in every row using `headers.some(...)`.
  - Dynamically renders only the rows matching the search query.
- **Sorting Feature**:
  - Rendered two dropdown controls above the table:
    1. **Column Dropdown**: Dynamically populated from table `headers` (e.g. `Company`, `Contact`, `Country`).
    2. **Order Dropdown**: Provides `Descending` and `Ascending` options.
  - Tracked sort state with `useState` (`sortData: { column: headers[0].name, order: 'descending' }`).
  - Default initial sort order is set to the **first column in descending order**.
  - Applied locale-aware string/number comparison (`localeCompare`) with direction toggling.
- **Performance Optimization**:
  - Leveraged **`useMemo`** to efficiently derive `filteredData` and `sortedData` without mutating the original dataset.

### Assignment 6 (FEA6): PropTypes Validation
- Added runtime prop type validation to the reusable **`<Table />`** component ([`Table.jsx`](src/Table.jsx)) using the official **[`prop-types`](https://www.npmjs.com/package/prop-types)** package.
- **PropTypes Schema**:
  - **`headers`**: Validated as `PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, label: PropTypes.string.isRequired })).isRequired`. Guarantees each column definition object contains required `name` and `label` strings.
  - **`data`**: Validated as `PropTypes.arrayOf(PropTypes.object).isRequired`. Guarantees table data is passed as an array of row objects.
- Added compile and runtime contract enforcement, preventing silent bugs or mismatched prop shapes during development.

### Assignment 7 (FEA7): Custom Cell Rendering & Country Flag Icons
- Added support for custom cell rendering via an optional `render(row)` function property on column headers.
- **`<Table />` Component Flexibility**:
  - When a header defines a `render` function (`header.render`), the table invokes `header.render(row)` to render custom JSX instead of directly displaying the raw string/value `row[header.name]`.
  - Updated `Table.propTypes` to validate optional `render: PropTypes.func`.
- **Country Flag Icons Integration**:
  - Installed and integrated the **[`country-flag-icons`](https://www.npmjs.com/package/country-flag-icons)** package (`country-flag-icons/react/3x2`).
  - Added a custom `render` function to the `country` column in [`App.jsx`](src/App.jsx) that maps country names (Germany, Mexico, Austria, UK, Canada, Italy) to ISO 3166-1 alpha-2 codes (`DE`, `MX`, `AT`, `GB`, `CA`, `IT`).
  - Renders the vector country flag icon alongside the country name within each table cell with accessible `title` attributes and smooth styling.

### Assignment 8 (FEA8): Column Sorting with Header Sort Icons
- Replaced the parent-level sort dropdowns with column-level header sorting directly inside the reusable **`<Table />`** component.
- **Header Configuration**:
  - Added `sortable: true` property in the header configuration for the first two columns (`company` and `contact`) in [`App.jsx`](src/App.jsx).
- **Internal Sorting State**:
  - Stored sorting configuration (`sortData: { column: null, order: null }`) directly within `<Table />` using `useState`.
  - Derived sorted rows dynamically using `useMemo` without mutating incoming props.
- **Interactive SVG Sort Icons**:
  - Rendered inline SVG vector icons for upward and downward arrows next to the header label for sortable columns.
  - **Initial State**: Sort icons are hidden when no sorting order is set.
  - **Hover State**: Hovering over a sortable column header reveals a downward arrow icon.
  - **Click to Sort Descending**: Clicking the sortable header or icon sorts the column in descending order, keeping the downward arrow visible.
  - **Click to Toggle Ascending**: Clicking the downward arrow icon toggles the column to ascending order, turning it into an upward arrow icon.
  - **Click to Remove Sorting**: Clicking the upward arrow icon resets sorting to `null`, reverting to the original dataset order.
- **PropTypes Schema Update**:
  - Updated `Table.propTypes` to validate optional `sortable: PropTypes.bool`.

### Assignment 9 (FEA9): Express Backend Server Integration & 100 Rows Dataset
- Integrated the application with a dedicated Node.js Express backend server (`table-be`) running at `http://localhost:8080`.
- Data is fetched from `GET http://localhost:8080/api`, responding with `{ rows, total }` containing 100 rows per page.
- **Redux Toolkit Integration (`tableSlice.js`)**:
  - Configured `API_URL` to `http://localhost:8080/api`.
  - Updated `extraReducers` to handle the `{ rows, total }` response format and extract `action.payload.rows`.
  - Added `selectTotalRows` selector.
- **Expanded Country Flag Icons**:
  - Expanded `country-flag-icons` support across all 20 international country codes present in the dataset (`ARE`, `AUS`, `BRA`, `CAN`, `CHN`, `DEU`, `ESP`, `FRA`, `GBR`, `IND`, `IRL`, `ITA`, `JPN`, `KOR`, `MEX`, `NLD`, `SGP`, `SWE`, `USA`, `ZAF`).
- **Enhanced Column Sorting**:
  - Enabled column-level sorting on the `country` column in addition to `company` and `contact`.
- **Project Scripts**:
### Assignment 10 (FEA10): Backend Filtering & Sorting with Query Parameters (`filter`, `sortCol`, `sortKey`)
- Replaced client-side filtering with backend query parameter `filter` (`http://localhost:8080/api?filter=...`).
- Replaced client-side sorting with backend query parameters `sortCol` (matching column key names: `company`, `contact`, `country`) and `sortKey` (`"asc"` / `"desc"`).
- **Redux Toolkit Integration (`tableSlice.js`)**:
  - Enhanced `fetchTableData` async thunk to accept `{ filter, sortCol, sortKey }` params and dynamically construct URL query parameters via `URL` and `URLSearchParams`.
  - Added Redux state tracking and selectors: `selectFilter`, `selectSortCol`, `selectSortKey`.
- **Reusable `<Table />` Component**:
  - Supports controlled mode via `sortCol`, `sortKey`, and `onSort(columnName, sortKey)` callback props.
  - Clicking sortable column headers cycles through `desc` (downward arrow) -> `asc` (upward arrow) -> `null` (reset).
  - Maintains accessible `aria-sort` values (`descending`, `ascending`, `none`) and interactive SVG sort icons.
  - Automatically avoids redundant client-side sorting when backend sorting is active.
- **Parent Component (`App.jsx`)**:
  - Passes backend `data` directly to `<Table />` without client-side row filtering.
  - Debounces `filter` search input updates (250ms) before dispatching API requests.
  - Immediately dispatches API requests with updated `sortCol` and `sortKey` when sortable table headers are clicked.

### Assignment 11 (FEA11): Infinite Scroll with Intersection Observer API (`page` and `limit`)
- Implemented infinite scroll using the native **Intersection Observer API** to automatically load more rows as the user scrolls to the bottom of the table.
- **Backend Pagination**:
  - Configured `limit=100` rows per page.
  - Passes `page` and `limit` query parameters to `GET http://localhost:8080/api?page=...&limit=100`.
- **Redux Toolkit Integration (`tableSlice.js`)**:
  - Enhanced `fetchTableData` to include `page` and `limit` in URL query parameters.
  - Handles initial load and filter/sort resets with `page: 1` (replacing rows) while appending rows on `page > 1`.
  - Added Redux state tracking and selectors: `selectIsFetchingMore`, `selectHasMore`, `selectCurrentPage`.
- **Intersection Observer & UX (`App.jsx`)**:
  - Renders a sentinel target element below the table monitored by an `IntersectionObserver`.
  - Automatically fetches the next page when the user reaches the end of current content.
  - Displays a bottom loading spinner indicator (`Loading more rows...`) while fetching subsequent batches.
  - Displays a completed status (`Showing all X rows`) once all rows have been loaded.
  - Automatically resets pagination back to page 1 whenever search filters or column sorting change.

### Assignment 12 (FEA12): Step Pagination with Page Caching (`limit=10`)
- Implemented step pagination with a 5-button navigation bar positioned below the table:
  - **Left arrow button (`<`)**: Navigates to the previous page (`currentPage - 1`); disabled when on the first page.
  - **Left page button**: Displays `currentPage - 1`; rendered empty and invisible (no border) when the first page is selected.
  - **Center page button**: Displays the current page number (`currentPage`) with active highlight styling; clicking navigates to the active page.
  - **Right page button**: Displays `currentPage + 1`; rendered empty and invisible (no border) when the last page is selected.
  - **Right arrow button (`>`)**: Navigates to the next page (`currentPage + 1`); disabled when on the last page.
- **Page Size**: Configured `limit=10` items per page.
- **Client-Side Page Caching**:
  - Checks Redux state `pages[targetPage]` before triggering network requests.
  - If data for the requested page already exists in the client cache, navigation occurs instantly without an HTTP call.
  - If no data exists for the target page, dispatches an API request: `GET http://localhost:8080/api?page=...&limit=10`.
  - Invalidates the page cache and resets to page 1 whenever `filter` or `sort` changes.
- **Redux Toolkit Integration (`tableSlice.js`)**:
  - Manages `data`, `pages` (page-to-rows map), `currentPage`, `total`, `limit`, `loading`, `pageLoading`, and `error`.
  - Exported memoized selectors: `selectTableData`, `selectTotalRows`, `selectCurrentPage`, `selectTotalPages`, `selectPageCache`, `selectIsPageLoading`.

### Assignment 13 (FEA13): Custom Hook for Infinite Scroll (`useInfiniteScroll`) & Table Integration
- Extracted the infinite scroll and `IntersectionObserver` logic out of `App.jsx` into a dedicated, reusable custom hook: [`src/hooks/useInfiniteScroll.js`](src/hooks/useInfiniteScroll.js).
  - Accepts `onLoadMore`, `hasMore`, `isLoading`, `rootMargin`, and `threshold` parameters.
  - Uses `useRef` to maintain a fresh callback reference to avoid redundant observer re-subscriptions.
  - Returns `{ sentinelRef }` to attach directly to any target DOM element.
- **Table Integration ([`src/Table.jsx`](src/Table.jsx))**:
  - Integrated `useInfiniteScroll` directly inside `<Table />`.
  - Added support for `onLoadMore`, `hasMore`, `isFetchingMore`, and `total` props.
  - Renders the sentinel element, bottom loading spinner, and completion status indicator directly within the table component hierarchy.
  - Documented and validated all new props using `PropTypes`.
- **Clean Architecture ([`src/App.jsx`](src/App.jsx))**:
  - Removed manual `IntersectionObserver` code from `App.jsx`, delegating scroll observation completely to `<Table />`.

---

## Component API (`<Table />`)

| Prop | Type | Validation (PropTypes) | Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| `headers` | `Array<{ name: string, label: string, render?: function, sortable?: boolean }>` | `PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string.isRequired, label: PropTypes.string.isRequired, render: PropTypes.func, sortable: PropTypes.bool })).isRequired` | Yes | Column configuration. `label` renders in `<th>`, `name` acts as key, optional `render` returns custom cell JSX, and optional `sortable` enables column sorting. |
| `data` | `Array<Record<string, any>>` | `PropTypes.arrayOf(PropTypes.object).isRequired` | Yes | Row data array where each row object has keys matching `header.name`. |
| `sortCol` | `string` | `PropTypes.string` | No | Active sort column key matching the response key name (`company`, `contact`, `country`). |
| `sortKey` | `string` | `PropTypes.string` | No | Active sort direction (`"asc"` or `"desc"`). |
| `onSort` | `function` | `PropTypes.func` | No | Callback invoked on column header click with `(columnName, sortKey)`. |
| `onLoadMore` | `function` | `PropTypes.func` | No | Callback invoked by `useInfiniteScroll` when the sentinel element intersects the viewport. |
| `hasMore` | `boolean` | `PropTypes.bool` | No | Indicates whether additional data pages exist to fetch (defaults to `true`). |
| `isFetchingMore` | `boolean` | `PropTypes.bool` | No | Controls display of the bottom loading spinner while loading subsequent batches. |
| `total` | `number` | `PropTypes.number` | No | Total rows count matching query used for the end-of-list indicator message. |



### Example Usage ([`App.jsx`](src/App.jsx))

```jsx
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
  { name: 'company', label: 'Company', sortable: true },
  { name: 'contact', label: 'Contact', sortable: true },
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

  const handleSearchChange = (e) => setSearchText(e.target.value);

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

  return (
    <div className="mx-auto mt-12 max-w-5xl px-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] py-16 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4" />
          <p className="text-3xl font-bold text-gray-800">Loading...</p>
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
              <label htmlFor="filter-input" className="text-sm font-semibold text-gray-700 whitespace-nowrap">Filter:</label>
              <input
                id="filter-input"
                type="text"
                placeholder="Search across all columns..."
                value={searchText}
                onChange={handleSearchChange}
                className="w-full flex-1 rounded-lg border border-gray-300 px-3.5 py-2 text-sm"
              />
            </div>
          </div>
          <Table headers={headers} data={filteredData} />
        </div>
      )}
    </div>
  );
}
```

### Table Component with Internal Sorting & Sort Icons ([`Table.jsx`](src/Table.jsx))

```jsx
import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';

function DownArrowIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3"
      />
    </svg>
  );
}

DownArrowIcon.propTypes = {
  className: PropTypes.string,
};

function UpArrowIcon({ className = 'h-4 w-4' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
      />
    </svg>
  );
}

UpArrowIcon.propTypes = {
  className: PropTypes.string,
};

export default function Table({ headers = [], data = [] }) {
  const [sortData, setSortData] = useState({
    column: null,
    order: null,
  });
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const handleSort = (columnName) => {
    setSortData((prev) => {
      if (prev.column !== columnName) {
        return { column: columnName, order: 'descending' };
      }
      if (prev.order === 'descending') {
        return { column: columnName, order: 'ascending' };
      }
      if (prev.order === 'ascending') {
        return { column: null, order: null };
      }
      return { column: columnName, order: 'descending' };
    });
  };

  const sortedData = useMemo(() => {
    if (!sortData.column || !sortData.order) {
      return data;
    }

    return [...data].sort((a, b) => {
      const valA = a[sortData.column];
      const valB = b[sortData.column];

      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;

      const comparison = String(valA).localeCompare(String(valB), undefined, {
        numeric: true,
        sensitivity: 'base',
      });

      return sortData.order === 'ascending' ? comparison : -comparison;
    });
  }, [data, sortData]);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md shadow-gray-400/60">
      <table className="w-full border-collapse text-left text-sm text-black">
        <thead>
          <tr className="bg-white">
            {headers.map((header) => {
              const isCurrent = sortData.column === header.name;
              const isDescending = isCurrent && sortData.order === 'descending';
              const isAscending = isCurrent && sortData.order === 'ascending';
              const isHovered = hoveredColumn === header.name;

              return (
                <th
                  key={header.name}
                  onClick={() => header.sortable && handleSort(header.name)}
                  onMouseEnter={() =>
                    header.sortable && setHoveredColumn(header.name)
                  }
                  onMouseLeave={() =>
                    header.sortable && setHoveredColumn(null)
                  }
                  className={`border border-gray-300 px-2 py-2 font-bold ${
                    header.sortable
                      ? 'cursor-pointer select-none group hover:bg-gray-50 transition-colors'
                      : ''
                  }`}
                  aria-sort={
                    !header.sortable
                      ? undefined
                      : isDescending
                      ? 'descending'
                      : isAscending
                      ? 'ascending'
                      : 'none'
                  }
                >
                  <div className="inline-flex items-center gap-1.5">
                    <span>{header.label}</span>
                    {header.sortable && (
                      <span
                        className="inline-flex items-center"
                        data-testid={`sort-icon-${header.name}`}
                      >
                        {isAscending ? (
                          <UpArrowIcon className="h-4 w-4 text-gray-800 opacity-100" />
                        ) : isDescending ? (
                          <DownArrowIcon className="h-4 w-4 text-gray-800 opacity-100" />
                        ) : (
                          <DownArrowIcon
                            className={`h-4 w-4 text-gray-400 transition-opacity duration-150 ${
                              isHovered
                                ? 'opacity-100'
                                : 'opacity-0 group-hover:opacity-100'
                            }`}
                          />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {sortedData.map((row, index) => (
            <tr
              key={row.id ?? index}
              className="hover:bg-blue-100 transition-colors duration-200 even:bg-gray-200"
            >
              {headers.map((header) => (
                <td
                  key={header.name}
                  className="border border-gray-300 px-2 py-2"
                >
                  {header.render ? header.render(row) : row[header.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

Table.propTypes = {
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      render: PropTypes.func,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
};
```

---

## Project Structure

```text
FEA1/
├── public/
│   └── favicon.svg      # Favicon
├── src/
│   ├── store/           # Redux Toolkit state management
│   │   ├── store.js     # Redux store configuration (configureStore)
│   │   └── tableSlice.js# Slice, createAsyncThunk & createSelector
│   ├── App.jsx          # Parent component with filter, sort, & Redux state
│   ├── Table.jsx        # Clean, reusable prop-driven Table component
│   ├── index.css        # Global stylesheet with Tailwind CSS directives
│   └── main.jsx         # React DOM entry point wrapped in Redux Provider
├── db.json              # Mock database served by json-server
├── index.html           # Main HTML document
├── package.json         # Project metadata & scripts
└── vite.config.js       # Vite build configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- `npm`

### Installation

```bash
npm install
```

*(Optional)* Install `json-server` globally if preferred:
```bash
npm install -g json-server
```

---

### Running the Application

This setup requires running both the mock backend API and the frontend development server:

#### Step 1: Start the Backend API Server
Run the Express backend server (serves on port 8080):
```bash
npm run server
```
The API endpoint will be live at: **`http://localhost:8080/api`**

#### Step 2: Start the React Frontend Server
In a separate terminal, launch the Vite dev server:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

### Production Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```
