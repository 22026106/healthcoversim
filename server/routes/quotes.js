const express = require('express');
const db = require('../db');
const { computeQuote } = require('../calc');
const { validateQuoteInput } = require('../validate');

const router = express.Router();

function rowToCalcInput(row) {
  return {
    coverType: row.cover_type,
    applicant1Age: row.applicant1_age,
    applicant1CoverHistory: row.applicant1_cover_history,
    applicant2Age: row.applicant2_age,
    applicant2CoverHistory: row.applicant2_cover_history,
    hospitalCover: row.hospital_cover,
    extrasCover: row.extras_cover,
    paymentFrequency: row.payment_frequency,
    annualDiscount: row.annual_discount,
  };
}

function rowWithQuote(row) {
  const quote = computeQuote(rowToCalcInput(row));
  return {
    id: row.id,
    customerName: row.customer_name,
    coverType: row.cover_type,
    applicant1Age: row.applicant1_age,
    applicant1CoverHistory: row.applicant1_cover_history,
    applicant2Age: row.applicant2_age,
    applicant2CoverHistory: row.applicant2_cover_history,
    hospitalCover: row.hospital_cover,
    extrasCover: row.extras_cover,
    paymentFrequency: row.payment_frequency,
    annualDiscount: row.annual_discount,
    notes: row.notes,
    createdAt: row.created_at,
    quote,
  };
}

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM quotes ORDER BY created_at DESC, id DESC').all();
  res.json(rows.map(rowWithQuote));
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Quote not found.' });
  res.json(rowWithQuote(row));
});

router.post('/', (req, res) => {
  const input = req.body;
  const { valid, errors } = validateQuoteInput(input);
  if (!valid) return res.status(400).json({ error: 'Invalid quote data.', details: errors });

  const isCouple = input.coverType === 'Couple' || input.coverType === 'Family';

  const stmt = db.prepare(`
    INSERT INTO quotes (
      customer_name, cover_type,
      applicant1_age, applicant1_cover_history,
      applicant2_age, applicant2_cover_history,
      hospital_cover, extras_cover,
      payment_frequency, annual_discount, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      input.customerName.trim(),
      input.coverType,
      Number(input.applicant1Age),
      input.applicant1CoverHistory,
      isCouple ? Number(input.applicant2Age) : null,
      isCouple ? input.applicant2CoverHistory : null,
      input.hospitalCover,
      input.extrasCover,
      input.paymentFrequency,
      input.paymentFrequency === 'Yearly' ? Number(input.annualDiscount) : 0,
      input.notes ? String(input.notes) : null
    );
    const row = db.prepare('SELECT * FROM quotes WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(rowWithQuote(row));
  } catch (err) {
    res.status(400).json({ error: 'Could not save quote.', details: [err.message] });
  }
});

router.put('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Quote not found.' });

  const input = req.body;
  const { valid, errors } = validateQuoteInput(input);
  if (!valid) return res.status(400).json({ error: 'Invalid quote data.', details: errors });

  const isCouple = input.coverType === 'Couple' || input.coverType === 'Family';

  const stmt = db.prepare(`
    UPDATE quotes SET
      customer_name = ?, cover_type = ?,
      applicant1_age = ?, applicant1_cover_history = ?,
      applicant2_age = ?, applicant2_cover_history = ?,
      hospital_cover = ?, extras_cover = ?,
      payment_frequency = ?, annual_discount = ?, notes = ?
    WHERE id = ?
  `);

  try {
    stmt.run(
      input.customerName.trim(),
      input.coverType,
      Number(input.applicant1Age),
      input.applicant1CoverHistory,
      isCouple ? Number(input.applicant2Age) : null,
      isCouple ? input.applicant2CoverHistory : null,
      input.hospitalCover,
      input.extrasCover,
      input.paymentFrequency,
      input.paymentFrequency === 'Yearly' ? Number(input.annualDiscount) : 0,
      input.notes ? String(input.notes) : null,
      req.params.id
    );
    const row = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
    res.json(rowWithQuote(row));
  } catch (err) {
    res.status(400).json({ error: 'Could not update quote.', details: [err.message] });
  }
});

router.delete('/:id', (req, res) => {
  const existing = db.prepare('SELECT * FROM quotes WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Quote not found.' });
  db.prepare('DELETE FROM quotes WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

module.exports = router;