import { Route, Routes, NavLink } from 'react-router-dom';
import LogsPage from './pages/LogsPage';
import LogDetailPage from './pages/LogDetailPage';

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Logs de Lotes - Freitas Leiloeiro</h1>
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>
            Logs
          </NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<LogsPage />} />
          <Route path="/logs/:id" element={<LogDetailPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
