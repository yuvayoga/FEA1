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
- Updated parent component ([`App.jsx`](src/App.jsx)) to configure headers and pass `tableData` into `<Table headers={headers} data={tableData} />`.

---

## Component API (`<Table />`)

| Prop | Type | Description |
| :--- | :--- | :--- |
| `headers` | `Array<{ name: string, label: string }>` | Column configuration. `label` renders in `<th>`, and `name` acts as the object key. |
| `data` | `Array<Record<string, any>>` | Row data array where each row object has keys matching `header.name`. |

### Example Usage

```jsx
import React from 'react';
import Table from './Table';

const headers = [
  { name: 'company', label: 'Company' },
  { name: 'contact', label: 'Contact' },
  { name: 'country', label: 'Country' },
];

const tableData = [
  { id: 1, company: 'Alfreds Futterkiste', contact: 'Maria Anders', country: 'Germany' },
  { id: 2, company: 'Centro comercial Moctezuma', contact: 'Francisco Chang', country: 'Mexico' },
  { id: 3, company: 'Ernst Handel', contact: 'Roland Mendel', country: 'Austria' },
  { id: 4, company: 'Island Trading', contact: 'Helen Bennett', country: 'UK' },
  { id: 5, company: 'Laughing Bacchus Winecellars', contact: 'Yoshi Tannamuri', country: 'Canada' },
  { id: 6, company: 'Magazzini Alimentari Riuniti', contact: 'Giovanni Rovelli', country: 'Italy' },
];

export default function App() {
  return (
    <div className="mx-auto mt-12 max-w-5xl px-4">
      <Table headers={headers} data={tableData} />
    </div>
  );
}
```

---

## Project Structure

```text
FEA1/
├── public/              # Static assets
├── src/
│   ├── App.css          # Tailwind CSS directives
│   ├── App.jsx          # Parent component passing headers & tableData
│   ├── Table.jsx        # Reusable prop-driven Table component
│   ├── index.css        # Global stylesheet
│   └── main.jsx         # React DOM entry point
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

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Linting

```bash
npm run lint
```
