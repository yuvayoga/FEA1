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
              key={row.id ?? `${row.company}-${row.contact}-${index}`}
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
