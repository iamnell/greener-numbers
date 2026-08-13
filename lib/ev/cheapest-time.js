const round = (value) => Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
const positive = (value) => Math.max(0, Number(value) || 0);

export function calculateOffPeakSavings(input) {
  const annualMiles = positive(input.annualMiles);
  const efficiency = positive(input.efficiencyKwhPer100Miles);
  const chargingLoss = 1 + positive(input.chargingLossPercent) / 100;
  const peakRate = positive(input.peakRateCents) / 100;
  const offPeakRate = positive(input.offPeakRateCents) / 100;
  const offPeakShare = Math.min(100, positive(input.offPeakPercent)) / 100;
  const annualKwh = annualMiles * efficiency / 100 * chargingLoss;
  const allPeakAnnualCost = annualKwh * peakRate;
  const mixedAnnualCost = annualKwh * (offPeakShare * offPeakRate + (1 - offPeakShare) * peakRate);
  const annualSavings = allPeakAnnualCost - mixedAnnualCost;
  return { annualKwh: round(annualKwh), allPeakAnnualCost: round(allPeakAnnualCost), mixedAnnualCost: round(mixedAnnualCost), annualSavings: round(annualSavings), monthlySavings: round(annualSavings / 12) };
}
