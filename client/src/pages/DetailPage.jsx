import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import QuoteDetail from '../components/QuoteDetail.jsx';

export default function DetailPage() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get(id)
      .then(setQuote)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading…</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!quote) return null;

  return (
    <div>
      <div className="page-header">
        <h1>{quote.customerName}</h1>
        <div className="row-actions">
          <Link to={`/quotes/${id}/edit`} className="btn">
            Edit
          </Link>
          <Link to="/" className="btn">
            Back to list
          </Link>
        </div>
      </div>
      <QuoteDetail quote={quote} />
    </div>
  );
}