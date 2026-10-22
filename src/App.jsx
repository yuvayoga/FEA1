import React from 'react';
import './App.css';
import Table, { TableComponent } from './Table';

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

export { Table, TableComponent };
