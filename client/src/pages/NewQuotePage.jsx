import { useNavigate } from 'react-router-dom';
import QuoteForm from '../components/QuoteForm.jsx';
import { api } from '../api.js';

export default function NewQuotePage() {
  const navigate = useNavigate();

  async function handleSubmit(payload) {
    const created = await api.create(payload);
    navigate(`/quotes/${created.id}`);
  }

  return (
    <div>
      <div className="page-header">
        <h1>New Quote</h1>
      </div>
      <QuoteForm submitLabel="Create quote" onSubmit={handleSubmit} />
    </div>
  );
}