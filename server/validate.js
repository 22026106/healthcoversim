const VALID_COVER_TYPES = ['Single', 'Couple', 'Family'];
const VALID_HISTORY = ['Yes', 'No', 'Not sure'];
const VALID_HOSPITAL = ['None', 'Basic', 'Bronze', 'Silver', 'Gold'];
const VALID_EXTRAS = ['None', 'Basic', 'Standard', 'Premium'];
const VALID_FREQUENCY = ['Monthly', 'Yearly'];

function isAgeValid(age) {
  const n = Number(age);
  return Number.isInteger(n) && n >= 18 && n <= 100;
}

function validateQuoteInput(input) {
  const errors = [];
  const {
    customerName,
    coverType,
    applicant1Age,
    applicant1CoverHistory,
    applicant2Age,
    applicant2CoverHistory,
    hospitalCover,
    extrasCover,
    paymentFrequency,
    annualDiscount,
  } = input || {};

  if (!customerName || !String(customerName).trim()) {
    errors.push('Customer name is required.');
  }

  if (!VALID_COVER_TYPES.includes(coverType)) {
    errors.push('Cover type must be Single, Couple, or Family.');
  }

  if (!VALID_HOSPITAL.includes(hospitalCover)) {
    errors.push('Hospital cover level is required.');
  }

  if (!VALID_EXTRAS.includes(extrasCover)) {
    errors.push('Extras cover level is required.');
  }

  if (!VALID_FREQUENCY.includes(paymentFrequency)) {
    errors.push('Payment frequency must be Monthly or Yearly.');
  }

  if (applicant1Age === undefined || applicant1Age === null || applicant1Age === '') {
    errors.push('Applicant 1 age is required.');
  } else if (!isAgeValid(applicant1Age)) {
    errors.push('Applicant 1 age must be a whole number between 18 and 100.');
  }

  if (!VALID_HISTORY.includes(applicant1CoverHistory)) {
    errors.push('Applicant 1 cover history is required (Yes / No / Not sure).');
  }

  if (coverType === 'Couple' || coverType === 'Family') {
    if (applicant2Age === undefined || applicant2Age === null || applicant2Age === '') {
      errors.push('Applicant 2 age is required for Couple or Family cover.');
    } else if (!isAgeValid(applicant2Age)) {
      errors.push('Applicant 2 age must be a whole number between 18 and 100.');
    }
    if (!VALID_HISTORY.includes(applicant2CoverHistory)) {
      errors.push('Applicant 2 cover history is required for Couple or Family cover (Yes / No / Not sure).');
    }
  }

  if (paymentFrequency === 'Yearly') {
    const d = Number(annualDiscount);
    if (Number.isNaN(d) || d < 0 || d > 10) {
      errors.push('Annual payment discount must be a number between 0 and 10 (percent).');
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateQuoteInput };