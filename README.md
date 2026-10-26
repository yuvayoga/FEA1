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

---

## Component API (`<Table />`)

| Prop | Type | Description |
| :--- | :--- | :--- |
| `headers` | `Array<{ name: string, label: string }>` | Column configuration. `label` renders in `<th>`, and `name` acts as the object key. |
| `data` | `Array<Record<string, any>>` | Row data array where each row object has keys matching `header.name`. |

### Example Usage ([`App.jsx`](src/App.jsx))

```jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Table from './Table';
import {
  fetchTableData,
  selectTableData,
  selectIsLoading,
  selectError,
} from './store/tableSlice';

const headers = [
  { name: 'company', label: 'Company' },
  { name: 'contact', label: 'Contact' },
  { name: 'country', label: 'Country' },
];

export default function App() {
  const dispatch = useDispatch();
  const data = useSelector(selectTableData);
  const loading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const [countdown, setCountdown] = useState(2);

  // FEA5 State: Filter query & sort configuration
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

  const handleSearchChange = (e) => setSearchText(e.target.value);
  const handleColumnChange = (e) =>
    setSortData((prev) => ({ ...prev, column: e.target.value }));
  const handleOrderChange = (e) =>
    setSortData((prev) => ({ ...prev, order: e.target.value }));

  // Substring match across all columns
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

  // Sort rows based on sortData
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

      const isAscending =
        sortData.order === 'ascending' || sortData.order === 'asc';
      return isAscending ? comparison : -comparison;
    });
  }, [filteredData, sortData]);

  return (
    <div className="mx-auto mt-12 max-w-5xl px-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] py-16 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4" />
          <p className="text-3xl font-bold text-gray-800">Loading...</p>
          <span className="mt-3 px-4 py-1 text-sm font-semibold text-black-600">
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
              <label htmlFor="filter-input" className="text-sm font-semibold text-gray-700">Filter:</label>
              <input
                id="filter-input"
                type="text"
                placeholder="Search across all columns..."
                value={searchText}
                onChange={handleSearchChange}
                className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-1.5 text-sm"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label htmlFor="sort-column" className="text-sm font-semibold text-gray-700">Sort by:</label>
                <select id="sort-column" value={sortData.column} onChange={handleColumnChange} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm">
                  {headers.map((h) => <option key={h.name} value={h.name}>{h.label}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="sort-order" className="text-sm font-semibold text-gray-700">Order:</label>
                <select id="sort-order" value={sortData.order} onChange={handleOrderChange} className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm">
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

#### Step 1: Start the JSON API Server
Run the `json-server` mock backend (serves `db.json` on port 3000):
```bash
npm run server
```
*Or using the global/npx command directly:*
```bash
npx json-server db.json
```
The API endpoint will be live at: **`http://localhost:3000/data`**

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
