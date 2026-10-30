import { NavLink, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isDarkPortal = location.pathname === '/add-company';

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        isDarkPortal
          ? 'border-b border-cyan-950 bg-[#020611]/85 backdrop-blur-md text-white'
          : 'border-b border-gray-200 bg-white/85 backdrop-blur-md text-gray-900 shadow-xs'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Brand */}
        <NavLink
          to="/"
          className={`flex items-center gap-2 text-lg font-bold transition ${
            isDarkPortal ? 'text-white hover:text-cyan-300' : 'text-gray-900 hover:text-blue-600'
          }`}
        >
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl font-black text-sm shadow-sm text-white ${
              isDarkPortal
                ? 'bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 shadow-cyan-500/25'
                : 'bg-gradient-to-tr from-blue-600 to-indigo-500'
            }`}
          >
            N
          </span>
          <span>NEXUS Directory</span>
        </NavLink>

        {/* Navigation links */}
        <nav className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                isActive
                  ? isDarkPortal
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-400/40'
                    : 'bg-blue-50 text-blue-700 font-semibold'
                  : isDarkPortal
                  ? 'text-cyan-200/60 hover:bg-cyan-950/40 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            All Companies
          </NavLink>

          <NavLink
            to="/add-company"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white font-semibold shadow-sm shadow-cyan-500/30'
                  : isDarkPortal
                  ? 'bg-cyan-950/40 text-cyan-200 hover:bg-cyan-900/50 hover:text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
              }`
            }
          >
            <span className="font-bold">+</span>
            <span>Add Company</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
