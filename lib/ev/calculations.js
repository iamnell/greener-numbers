const round = (value) => Math.round((Number.isFinite(value) ? value : 0) * 100) / 100;
const positive = (value) => Math.max(0, Number(value) || 0);

export function calculateChargingCost(input) {
  const annualMiles = positive(input.annualMiles);
  const efficiency = positive(input.efficiencyKwhPer100Miles);
  const loss = 1 + positive(input.chargingLossPercent) / 100;
  const annualEnergyKwh = annualMiles * efficiency / 100 * loss;
  const homeShare = Math.min(100, positive(input.homePercent)) / 100;
  const publicShare = 1 - homeShare;
  const homeRate = positive(input.homeRateCents) / 100;
  const publicRate = positive(input.publicRateCents) / 100;
  const homeAnnualCost = annualEnergyKwh * homeShare * homeRate;
  const publicAnnualCost = annualEnergyKwh * publicShare * publicRate;
  const combinedAnnualCost = homeAnnualCost + publicAnnualCost;
  const batteryKwh = positive(input.batteryKwh);
  return { annualEnergyKwh: round(annualEnergyKwh), homeAnnualCost: round(homeAnnualCost), publicAnnualCost: round(publicAnnualCost), combinedAnnualCost: round(combinedAnnualCost), monthlyCost: round(combinedAnnualCost / 12), dailyCost: round(combinedAnnualCost / 365), costPerMile: round(combinedAnnualCost / Math.max(annualMiles, 1)), costPer100Miles: round(combinedAnnualCost / Math.max(annualMiles, 1) * 100), costPerFullCharge: round(batteryKwh * loss * homeRate) };
}

export function calculateEvVsGas(input) {
  const ev = calculateChargingCost({ ...input, efficiencyKwhPer100Miles: input.evEfficiencyKwhPer100Miles ?? input.efficiencyKwhPer100Miles });
  const annualMiles = positive(input.annualMiles);
  const gasAnnualCost = annualMiles / Math.max(positive(input.gasMpg), .1) * positive(input.gasPrice);
  const annualSavings = gasAnnualCost - ev.combinedAnnualCost;
  return { ...ev, evAnnualCost: ev.combinedAnnualCost, evMonthlyCost: ev.monthlyCost, gasAnnualCost: round(gasAnnualCost), gasMonthlyCost: round(gasAnnualCost / 12), gasCostPerMile: round(gasAnnualCost / Math.max(annualMiles, 1)), annualSavings: round(annualSavings), monthlySavings: round(annualSavings / 12), fiveYearSavings: round(annualSavings * 5) };
}

export function calculateHomeCharger(input) {
  const grossInstallationCost = [input.chargerPrice, input.laborCost, input.electricalWork, input.permitCost, input.panelUpgrade, input.otherCost].reduce((sum, value) => sum + positive(value), 0);
  const totalIncentives = [input.federalIncentive, input.stateIncentive, input.utilityRebate, input.manufacturerRebate, input.otherRebate].reduce((sum, value) => sum + positive(value), 0);
  const netInstallationCost = Math.max(0, grossInstallationCost - totalIncentives);
  const annualFuelSavings = positive(input.annualFuelSavings);
  return { grossInstallationCost: round(grossInstallationCost), totalIncentives: round(totalIncentives), netInstallationCost: round(netInstallationCost), annualFuelSavings: round(annualFuelSavings), paybackYears: annualFuelSavings ? round(netInstallationCost / annualFuelSavings) : null };
}
