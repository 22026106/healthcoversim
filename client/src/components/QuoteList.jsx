import { Link } from 'react-router-dom';

function money(n) {
  return `$${Number(n).toFixed(2)}`;
}

export default function QuoteList({ quotes, onDelete }) {
  if (quotes.length === 0) {
    return <p className="empty-state">No quotes yet. Create your first one to get started.</p>;
  }

  return (
    <table className="quote-table">
      <thead>
        <tr>
          <th>Customer</th>
          <th>Cover</th>
          <th>Hospital / Extras</th>
          <th>Monthly est.</th>
          <th>Yearly est.</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {quotes.map((q) => (
          <tr key={q.id}>
            <td>
              <Link to={`/quotes/${q.id}`}>{q.customerName}</Link>
            </td>
            <td>{q.coverType}</td>
            <td>
              {q.hospitalCover} / {q.extrasCover}
            </td>
            <td>{money(q.quote.monthlyPremium)}</td>
            <td>
              {q.paymentFrequency === 'Yearly'
                ? money(q.quote.yearlyAfterDiscount)
                : money(q.quote.yearlyBeforeDiscount)}
              {q.quote.warnings.length > 0 && <span className="badge-warning"> ⚠</span>}
            </td>
            <td className="row-actions">
              <Link to={`/quotes/${q.id}`} className="btn btn-small">
                View
              </Link>
              <Link to={`/quotes/${q.id}/edit`} className="btn btn-small">
                Edit
              </Link>
              <button className="btn btn-small btn-danger" onClick={() => onDelete(q.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}