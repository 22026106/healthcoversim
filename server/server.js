const express = require('express');
const cors = require('cors');
require('./db');

const quotesRouter = require('./routes/quotes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/quotes', quotesRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ error: 'Bad request.', details: [err.message] });
});

app.listen(PORT, () => {
  console.log(`HealthCoverSim API listening on http://localhost:${PORT}`);
});