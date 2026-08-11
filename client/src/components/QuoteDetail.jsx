function money(n) {
  return n === null || n === undefined ? '—' : `$${Number(n).toFixed(2)}`;
}

export default function QuoteDetail({ quote }) {
  const q = quote.quote;

  return (
    <div className="quote-detail">
      <section className="summary-cards">
        <div className="card card-highlight">
          <div className="card-label">Monthly premium</div>
          <div className="card-value">{money(q.monthlyPremium)}</div>
        </div>
        <div className="card">
          <div className="card-label">Yearly before discount</div>
          <div className="card-value">{money(q.yearlyBeforeDiscount)}</div>
        </div>
        {quote.paymentFrequency === 'Yearly' && (
          <div className="card card-highlight">
            <div className="card-label">Yearly after {q.discountPct}% discount</div>
            <div className="card-value">{money(q.yearlyAfterDiscount)}</div>
          </div>
        )}
      </section>

      {q.warnings.length > 0 && (
        <div className="alert alert-warning">
          {q.warnings.map((w, i) => (
            <p key={i}>⚠ {w}</p>
          ))}
        </div>
      )}

      <section className="breakdown">
        <h3>How this quote was calculated</h3>

        <table className="breakdown-table">
          <tbody>
            <tr>
              <th colSpan={2}>Hospital cover — {q.hospitalCover} (${q.hospitalTierPrice}/adult/month)</th>
            </tr>
            {q.applicants.map((a) => (
              <tr key={a.label}>
                <td>
                  {a.label} (age {a.age}, history: {a.coverHistory})
                  <br />
                  <span className="note">{a.lhcNote}</span>
                </td>
                <td>{money(a.hospitalPremium)}</td>
              </tr>
            ))}
            <tr className="subtotal-row">
              <td>Hospital total</td>
              <td>{money(q.hospitalTotal)}</td>
            </tr>

            <tr>
              <th colSpan={2}>
                Extras cover — {q.extrasCover} (${q.extrasTierPrice}/adult/month)
              </th>
            </tr>
            <tr className="subtotal-row">
              <td>Extras total ({q.numAdults} adult{q.numAdults > 1 ? 's' : ''})</td>
              <td>{money(q.extrasTotal)}</td>
            </tr>

            {q.familyUpgradeFee > 0 && (
              <tr>
                <td>Family upgrade fee</td>
                <td>{money(q.familyUpgradeFee)}</td>
              </tr>
            )}

            <tr className="total-row">
              <td>Monthly premium</td>
              <td>{money(q.monthlyPremium)}</td>
            </tr>
            <tr>
              <td>Yearly premium before discount (monthly × 12)</td>
              <td>{money(q.yearlyBeforeDiscount)}</td>
            </tr>
            {quote.paymentFrequency === 'Yearly' && (
              <tr className="total-row">
                <td>Yearly premium after {q.discountPct}% annual-payment discount</td>
                <td>{money(q.yearlyAfterDiscount)}</td>
              </tr>
            )}
          </tbody>
        </table>

        <p className="lhc-statement">{q.lhcStatement}</p>

        <p className="explainer">
          {quote.customerName}'s {quote.coverType.toLowerCase()} quote combines the hospital cover
          (with each applicant's Lifetime Health Cover loading applied individually) and extras
          cover, {quote.coverType === 'Family' && 'adds the flat $30/month family upgrade fee, '}
          then totals to a monthly premium.{' '}
          {quote.paymentFrequency === 'Yearly'
            ? `Because this customer pays yearly, the monthly premium is multiplied by 12 and then reduced by their ${q.discountPct}% annual-payment discount.`
            : 'Because this customer pays monthly, no annual-payment discount applies — only yearly payers receive that discount.'}
        </p>
      </section>

      {quote.notes && (
        <section className="notes">
          <h3>Notes</h3>
          <p>{quote.notes}</p>
        </section>
      )}
    </div>
  );
}