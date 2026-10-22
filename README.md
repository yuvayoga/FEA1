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

---

## Component API (`<Table />`)

| Prop | Type | Description |
| :--- | :--- | :--- |
| `headers` | `Array<{ name: string, label: string }>` | Column configuration. `label` renders in `<th>`, and `name` acts as the object key. |
| `data` | `Array<Record<string, any>>` | Row data array where each row object has keys matching `header.name`. |

### Example Usage ([`App.jsx`](src/App.jsx))

```jsx
import React, { useState, useEffect } from 'react';
import Table from './Table';

const headers = [
  { name: 'company', label: 'Company' },
  { name: 'contact', label: 'Contact' },
  { name: 'country', label: 'Country' },
];

const API_URL = 'http://localhost:3000/data';

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(() => {
      fetch(API_URL)
        .then((res) => res.json())
        .then((json) => {
          setData(json);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load table data:', err);
          setLoading(false);
        });
    }, 2000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="mx-auto mt-12 max-w-5xl px-4">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[45vh] py-16 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 mb-4" />
          <p className="text-3xl font-bold text-gray-800">Loading...</p>
          <span className="mt-3 inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-semibold text-blue-600">
            {countdown}s remaining
          </span>
        </div>
      ) : (
        <Table headers={headers} data={data} />
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
│   ├── App.css          # Tailwind CSS directives
│   ├── App.jsx          # Parent component with useEffect & fetch
│   ├── Table.jsx        # Reusable prop-driven Table component
│   ├── index.css        # Global stylesheet
│   └── main.jsx         # React DOM entry point
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
