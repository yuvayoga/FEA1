import React from 'react';

import './App.css';

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
      <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md shadow-gray-400/60">
        <table className="w-full border-collapse text-left text-sm text-black">
          <thead>
            <tr className="bg-white">
              <th className="border border-gray-300 px-2 py-2 font-bold">Company</th>
              <th className="border border-gray-300 px-2 py-2 font-bold">Contact</th>
              <th className="border border-gray-300 px-2 py-2 font-bold">Country</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((row) => (
              <tr
                key={row.id}
                className=" hover:bg-blue-100 transistion-colors duration-200 even:bg-gray-200"
              >
                <td className="border border-gray-300 px-2 py-2">
                  {row.company}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {row.contact}
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  {row.country}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}
