const HOSPITAL_PRICES = { None: 0, Basic: 90, Bronze: 120, Silver: 160, Gold: 220 };
const EXTRAS_PRICES = { None: 0, Basic: 25, Standard: 45, Premium: 70 };
const FAMILY_UPGRADE_FEE = 30;

const LHC_STATEMENT =
  'Lifetime Health Cover loading applies only to hospital cover. It does not apply to extras cover.';

function adultCount(coverType) {
  return coverType === 'Single' ? 1 : 2;
}

function calcLhcLoading(age, history, hospitalCover) {
  if (hospitalCover === 'None') {
    return { loadingPct: 0, warning: false, note: 'No hospital cover selected — nothing to load.' };
  }
  if (history === 'Yes') {
    return { loadingPct: 0, warning: false, note: 'Had hospital cover before — no loading.' };
  }
  if (history === 'Not sure') {
    return {
      loadingPct: 0,
      warning: true,
      note: 'Cover history unknown — LHC loading has not been applied. This quote may be inaccurate.',
    };
  }
  if (age <= 30) {
    return { loadingPct: 0, warning: false, note: 'Age 30 or under — no loading applies.' };
  }
  const loadingPct = (age - 30) * 2;
  return {
    loadingPct,
    warning: false,
    note: `Age ${age}, no prior hospital cover → (${age} − 30) × 2% = ${loadingPct}% loading.`,
  };
}

function round2(n) {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function computeQuote(input) {
  const {
    coverType,
    applicant1Age,
    applicant1CoverHistory,
    applicant2Age,
    applicant2CoverHistory,
    hospitalCover,
    extrasCover,
    paymentFrequency,
    annualDiscount,
  } = input;

  const numAdults = adultCount(coverType);
  const hospitalTierPrice = HOSPITAL_PRICES[hospitalCover];
  const extrasTierPrice = EXTRAS_PRICES[extrasCover];

  const applicants = [];

  const a1Loading = calcLhcLoading(applicant1Age, applicant1CoverHistory, hospitalCover);
  applicants.push({
    label: 'Applicant 1',
    age: applicant1Age,
    coverHistory: applicant1CoverHistory,
    lhcLoadingPct: a1Loading.loadingPct,
    lhcNote: a1Loading.note,
    warning: a1Loading.warning,
    hospitalPremium: round2(hospitalTierPrice * (1 + a1Loading.loadingPct / 100)),
  });

  if (numAdults === 2) {
    const a2Loading = calcLhcLoading(applicant2Age, applicant2CoverHistory, hospitalCover);
    applicants.push({
      label: 'Applicant 2',
      age: applicant2Age,
      coverHistory: applicant2CoverHistory,
      lhcLoadingPct: a2Loading.loadingPct,
      lhcNote: a2Loading.note,
      warning: a2Loading.warning,
      hospitalPremium: round2(hospitalTierPrice * (1 + a2Loading.loadingPct / 100)),
    });
  }

  const hospitalTotal = round2(applicants.reduce((sum, a) => sum + a.hospitalPremium, 0));
  const extrasTotal = round2(extrasTierPrice * numAdults);
  const familyUpgradeFee = coverType === 'Family' ? FAMILY_UPGRADE_FEE : 0;

  const monthlyPremium = round2(hospitalTotal + extrasTotal + familyUpgradeFee);
  const yearlyBeforeDiscount = round2(monthlyPremium * 12);

  const isYearly = paymentFrequency === 'Yearly';
  const discountPct = isYearly ? Number(annualDiscount) || 0 : 0;
  const yearlyAfterDiscount = isYearly
    ? round2(yearlyBeforeDiscount * (1 - discountPct / 100))
    : null;

  const warnings = applicants
    .filter((a) => a.warning)
    .map((a) => `${a.label}: cover history is unknown — LHC loading has not been applied. This quote may be inaccurate.`);

  return {
    lhcStatement: LHC_STATEMENT,
    numAdults,
    hospitalCover,
    extrasCover,
    hospitalTierPrice,
    extrasTierPrice,
    applicants,
    hospitalTotal,
    extrasTotal,
    familyUpgradeFee,
    monthlyPremium,
    paymentFrequency,
    discountPct,
    yearlyBeforeDiscount,
    yearlyAfterDiscount,
    warnings,
  };
}

module.exports = { computeQuote, HOSPITAL_PRICES, EXTRAS_PRICES, FAMILY_UPGRADE_FEE, LHC_STATEMENT };