export const DEFAULT_CHARGING_EFFICIENCY = 0.9;

export type ChargingInputs = { milesPerYear: number; efficiencyKwhPer100Miles: number; electricityRate: number; homeChargingPercent: number; publicChargingPercent: number; publicChargingRate: number; chargingEfficiency?: number; batteryKwh?: number };
const safe = (value: number | undefined, fallback = 0) => Number.isFinite(value) ? Math.max(0, value ?? fallback) : fallback;

export function calculateChargingCost(input: ChargingInputs) {
  const miles = safe(input.milesPerYear);
  const efficiency = safe(input.efficiencyKwhPer100Miles);
  const lossFactor = Math.max(safe(input.chargingEfficiency, DEFAULT_CHARGING_EFFICIENCY), 0.01);
  const energyKwh = miles * efficiency / 100 / lossFactor;
  const homeShare = safe(input.homeChargingPercent) / 100;
  const publicShare = safe(input.publicChargingPercent) / 100;
  const normalizedHomeShare = homeShare + publicShare > 0 ? homeShare / (homeShare + publicShare) : 1;
  const homeKwh = energyKwh * normalizedHomeShare;
  const publicKwh = energyKwh - homeKwh;
  const homeCost = homeKwh * safe(input.electricityRate);
  const publicCost = publicKwh * safe(input.publicChargingRate, input.electricityRate);
  const annualCost = homeCost + publicCost;
  const fullChargeCost = safe(input.batteryKwh) * safe(input.electricityRate) / lossFactor;
  return { energyKwh, homeKwh, publicKwh, homeCost, publicCost, annualCost, monthlyCost: annualCost / 12, dailyCost: annualCost / 365, costPerMile: miles ? annualCost / miles : 0, costPer100Miles: miles ? annualCost / miles * 100 : 0, fullChargeCost };
}

export function calculateEvVsGas(input: ChargingInputs & { mpg: number; gasPrice: number }) {
  const ev = calculateChargingCost(input);
  const gasAnnualCost = safe(input.milesPerYear) / Math.max(safe(input.mpg), 0.1) * safe(input.gasPrice);
  const savings = gasAnnualCost - ev.annualCost;
  return { ...ev, gasAnnualCost, gasMonthlyCost: gasAnnualCost / 12, gasCostPerMile: safe(input.mpg) ? safe(input.gasPrice) / safe(input.mpg) : 0, monthlySavings: savings / 12, annualSavings: savings, fiveYearSavings: savings * 5 };
}

export type HomeChargerInputs = { chargerPrice: number; laborCost: number; electricalWork: number; permitCost: number; panelUpgrade: number; wiringCost: number; otherCost: number; federalIncentive: number; stateIncentive: number; utilityRebate: number; manufacturerRebate: number; otherRebate: number; annualSavings: number };
export function calculateHomeCharger(input: HomeChargerInputs) {
  const costs = [input.chargerPrice, input.laborCost, input.electricalWork, input.permitCost, input.panelUpgrade, input.wiringCost, input.otherCost].reduce((sum, value) => sum + safe(value), 0);
  const rebates = [input.federalIncentive, input.stateIncentive, input.utilityRebate, input.manufacturerRebate, input.otherRebate].reduce((sum, value) => sum + safe(value), 0);
  const netCost = Math.max(0, costs - rebates);
  const annualSavings = safe(input.annualSavings);
  return { grossCost: costs, rebates, netCost, annualSavings, paybackYears: annualSavings > 0 ? netCost / annualSavings : null };
}

export function calculateOffPeakSavings(input: { annualMiles: number; efficiencyKwhPer100Miles: number; peakRate: number; offPeakRate: number; offPeakPercent: number; chargingEfficiency?: number }) {
  const kwh = safe(input.annualMiles) * safe(input.efficiencyKwhPer100Miles) / 100 / Math.max(safe(input.chargingEfficiency, DEFAULT_CHARGING_EFFICIENCY), .01);
  const shifted = kwh * safe(input.offPeakPercent) / 100;
  const annualSavings = shifted * Math.max(0, safe(input.peakRate) - safe(input.offPeakRate));
  return { annualSavings, monthlySavings: annualSavings / 12, annualKwh: kwh };
}
