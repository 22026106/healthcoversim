import { useEffect, useState } from 'react';
import { api } from '../api.js';
import QuoteList from '../components/QuoteList.jsx';

export default function ListPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    api
      .list()
      .then(setQuotes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm('Delete this quote? This cannot be undone.')) return;
    try {
      await api.remove(id);
      setQuotes((qs) => qs.filter((q) => q.id !== id));
    } catch (e) {
      alert(`Could not delete quote: ${e.message}`);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Quotes</h1>
      </div>
      {loading && <p>Loading…</p>}
      {error && <div className="alert alert-error">{error}</div>}
      {!loading && !error && <QuoteList quotes={quotes} onDelete={handleDelete} />}
    </div>
  );
}