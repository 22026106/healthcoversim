import { Routes, Route, Link } from 'react-router-dom';
import NewQuotePage from './pages/NewQuotePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import ListPage from './pages/ListPage.jsx';
import EditQuotePage from './pages/EditQuotePage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/" className="brand">
          HealthCover<span>Sim</span>
        </Link>
        <nav>
          <Link to="/">Quotes</Link>
          <Link to="/new" className="btn btn-primary">
            + New Quote
          </Link>
        </nav>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/new" element={<NewQuotePage />} />
          <Route path="/quotes/:id" element={<DetailPage />} />
          <Route path="/quotes/:id/edit" element={<EditQuotePage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        HealthCoverSim — a learning simulator only. Not financial advice.
      </footer>
    </div>
  );
}