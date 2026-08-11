import { Routes, Route, Link } from 'react-router-dom';

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
          <Route path="/" element={<div>List page coming soon</div>} />
          <Route path="/new" element={<div>New quote page coming soon</div>} />
        </Routes>
      </main>

      <footer className="app-footer">
        HealthCoverSim — a learning simulator only. Not financial advice.
      </footer>
    </div>
  );
}