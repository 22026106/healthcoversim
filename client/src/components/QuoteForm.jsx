import { useState } from 'react';

const HOSPITAL_LEVELS = ['None', 'Basic', 'Bronze', 'Silver', 'Gold'];
const EXTRAS_LEVELS = ['None', 'Basic', 'Standard', 'Premium'];
const HISTORY_OPTIONS = ['Yes', 'No', 'Not sure'];

const emptyForm = {
  customerName: '',
  coverType: 'Single',
  applicant1Age: '',
  applicant1CoverHistory: '',
  applicant2Age: '',
  applicant2CoverHistory: '',
  hospitalCover: 'None',
  extrasCover: 'None',
  paymentFrequency: 'Monthly',
  annualDiscount: '',
  notes: '',
};

function validate(form) {
  const errors = [];
  if (!form.customerName.trim()) errors.push('Customer name is required.');
  if (!['Single', 'Couple', 'Family'].includes(form.coverType)) errors.push('Cover type is required.');
  if (!HOSPITAL_LEVELS.includes(form.hospitalCover)) errors.push('Hospital cover level is required.');
  if (!EXTRAS_LEVELS.includes(form.extrasCover)) errors.push('Extras cover level is required.');
  if (!['Monthly', 'Yearly'].includes(form.paymentFrequency)) errors.push('Payment frequency is required.');

  const a1 = Number(form.applicant1Age);
  if (form.applicant1Age === '' || !Number.isInteger(a1) || a1 < 18 || a1 > 100) {
    errors.push('Applicant 1 age must be a whole number between 18 and 100.');
  }
  if (!HISTORY_OPTIONS.includes(form.applicant1CoverHistory)) {
    errors.push('Applicant 1 cover history is required.');
  }

  const needsApplicant2 = form.coverType === 'Couple' || form.coverType === 'Family';
  if (needsApplicant2) {
    const a2 = Number(form.applicant2Age);
    if (form.applicant2Age === '' || !Number.isInteger(a2) || a2 < 18 || a2 > 100) {
      errors.push('Applicant 2 age must be a whole number between 18 and 100.');
    }
    if (!HISTORY_OPTIONS.includes(form.applicant2CoverHistory)) {
      errors.push('Applicant 2 cover history is required.');
    }
  }

  if (form.paymentFrequency === 'Yearly') {
    const d = Number(form.annualDiscount);
    if (form.annualDiscount === '' || Number.isNaN(d) || d < 0 || d > 10) {
      errors.push('Annual payment discount must be a number between 0 and 10 (percent).');
    }
  }

  return errors;
}

export default function QuoteForm({ initialValues, submitLabel, onSubmit }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const needsApplicant2 = form.coverType === 'Couple' || form.coverType === 'Family';

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError(null);
    const clientErrors = validate(form);
    setErrors(clientErrors);
    if (clientErrors.length > 0) return;

    const payload = {
      ...form,
      applicant1Age: Number(form.applicant1Age),
      applicant2Age: needsApplicant2 ? Number(form.applicant2Age) : null,
      applicant2CoverHistory: needsApplicant2 ? form.applicant2CoverHistory : null,
      annualDiscount: form.paymentFrequency === 'Yearly' ? Number(form.annualDiscount) : 0,
    };

    setSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setServerError({ message: err.message, details: err.details });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="quote-form" onSubmit={handleSubmit} noValidate>
      {errors.length > 0 && (
        <div className="alert alert-error">
          <strong>Please fix the following:</strong>
          <ul>
            {errors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {serverError && (
        <div className="alert alert-error">
          <strong>{serverError.message}</strong>
          {serverError.details && serverError.details.length > 0 && (
            <ul>
              {serverError.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <fieldset>
        <legend>Customer</legend>
        <label>
          Customer name
          <input
            type="text"
            required
            value={form.customerName}
            onChange={(e) => update('customerName', e.target.value)}
            placeholder="e.g. Jordan Lee"
          />
        </label>

        <label>
          Cover type
          <select value={form.coverType} onChange={(e) => update('coverType', e.target.value)}>
            <option value="Single">Single</option>
            <option value="Couple">Couple</option>
            <option value="Family">Family</option>
          </select>
        </label>
        {form.coverType === 'Family' && (
          <p className="hint">
            Family cover automatically adds a $30/month upgrade fee. Dependants' ages aren't
            collected individually.
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend>Applicant 1</legend>
        <label>
          Age
          <input
            type="number"
            min="18"
            max="100"
            required
            value={form.applicant1Age}
            onChange={(e) => update('applicant1Age', e.target.value)}
          />
        </label>
        <label>
          Had hospital cover before?
          <select
            value={form.applicant1CoverHistory}
            onChange={(e) => update('applicant1CoverHistory', e.target.value)}
          >
            <option value="">Select…</option>
            {HISTORY_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      {needsApplicant2 && (
        <fieldset>
          <legend>Applicant 2</legend>
          <label>
            Age
            <input
              type="number"
              min="18"
              max="100"
              required
              value={form.applicant2Age}
              onChange={(e) => update('applicant2Age', e.target.value)}
            />
          </label>
          <label>
            Had hospital cover before?
            <select
              value={form.applicant2CoverHistory}
              onChange={(e) => update('applicant2CoverHistory', e.target.value)}
            >
              <option value="">Select…</option>
              {HISTORY_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </label>
        </fieldset>
      )}

      <fieldset>
        <legend>Cover levels</legend>
        <label>
          Hospital cover
          <select value={form.hospitalCover} onChange={(e) => update('hospitalCover', e.target.value)}>
            {HOSPITAL_LEVELS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
        <label>
          Extras cover
          <select value={form.extrasCover} onChange={(e) => update('extrasCover', e.target.value)}>
            {EXTRAS_LEVELS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </fieldset>

      <fieldset>
        <legend>Payment</legend>
        <label>
          Payment frequency
          <select
            value={form.paymentFrequency}
            onChange={(e) => update('paymentFrequency', e.target.value)}
          >
            <option value="Monthly">Monthly</option>
            <option value="Yearly">Yearly</option>
          </select>
        </label>
        {form.paymentFrequency === 'Yearly' && (
          <label>
            Annual payment discount (%)
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              required
              value={form.annualDiscount}
              onChange={(e) => update('annualDiscount', e.target.value)}
              placeholder="0–10"
            />
          </label>
        )}
      </fieldset>

      <fieldset>
        <legend>Notes (optional)</legend>
        <label>
          <textarea
            rows={3}
            value={form.notes || ''}
            onChange={(e) => update('notes', e.target.value)}
            placeholder="Anything else worth noting about this quote"
          />
        </label>
      </fieldset>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}