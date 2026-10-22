import React, { useState, useEffect } from 'react';
import './App.css';
import Table, { TableComponent } from './Table';

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
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((json) => {
          setData(json);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch from json-server:', error);
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
          <p className="text-3xl font-bold text-gray-800">
            Loading...
          </p>
          <span className="mt-3 px-4 py-1 text-sm font-semibold text-black-600">
            {countdown}s remaining
          </span>
        </div>
      ) : (
        <Table headers={headers} data={data} />
      )}
    </div>
  );
}

export { Table, TableComponent };
