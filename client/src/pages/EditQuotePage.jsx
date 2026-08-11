import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import QuoteForm from '../components/QuoteForm.jsx';

export default function EditQuotePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(id)
      .then((q) =>
        setInitialValues({
          customerName: q.customerName,
          coverType: q.coverType,
          applicant1Age: q.applicant1Age,
          applicant1CoverHistory: q.applicant1CoverHistory,
          applicant2Age: q.applicant2Age ?? '',
          applicant2CoverHistory: q.applicant2CoverHistory ?? '',
          hospitalCover: q.hospitalCover,
          extrasCover: q.extrasCover,
          paymentFrequency: q.paymentFrequency,
          annualDiscount: q.annualDiscount ?? '',
          notes: q.notes ?? '',
        })
      )
      .catch((e) => setError(e.message));
  }, [id]);

  async function handleSubmit(payload) {
    await api.update(id, payload);
    navigate(`/quotes/${id}`);
  }

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!initialValues) return <p>Loading…</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Edit Quote</h1>
      </div>
      <QuoteForm initialValues={initialValues} submitLabel="Save changes" onSubmit={handleSubmit} />
    </div>
  );
}