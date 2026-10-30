import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import TablePage from './pages/TablePage';
import AddCompanyPage from './pages/AddCompanyPage';

export default function App() {
  const location = useLocation();
  const isDark = location.pathname === '/add-company';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#020611] text-white' : 'bg-slate-100 text-slate-900'}`}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<TablePage />} />
          <Route path="/add-company" element={<AddCompanyPage />} />
        </Routes>
      </main>
    </div>
  );
}
