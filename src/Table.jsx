export default function Table({ headers = [], data = [] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-300 bg-white shadow-md shadow-gray-400/60">
      <table className="w-full border-collapse text-left text-sm text-black">
        <thead>
          <tr className="bg-white">
            {headers.map((header) => (
              <th
                key={header.name}
                className="border border-gray-300 px-2 py-2 font-bold"
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, index) => (
            <tr
              key={row.id ?? index}
              className="hover:bg-blue-100 transition-colors duration-200 even:bg-gray-200"
            >
              {headers.map((header) => (
                <td
                  key={header.name}
                  className="border border-gray-300 px-2 py-2"
                >
                  {row[header.name]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
