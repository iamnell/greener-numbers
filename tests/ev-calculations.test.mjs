import assert from "node:assert/strict";
import test from "node:test";
import { calculateChargingCost, calculateEvVsGas, calculateHomeCharger } from "../lib/ev/calculations.js";
import { calculateOffPeakSavings } from "../lib/ev/cheapest-time.js";

test("charging-cost calculation separates home and public electricity costs including charging loss", () => {
  const result = calculateChargingCost({ annualMiles: 12000, efficiencyKwhPer100Miles: 28, homeRateCents: 16, publicRateCents: 42, homePercent: 80, chargingLossPercent: 10, batteryKwh: 75 });
  assert.equal(result.annualEnergyKwh, 3696);
  assert.equal(result.costPerFullCharge, 13.2);
  assert.equal(result.homeAnnualCost, 473.09);
  assert.equal(result.publicAnnualCost, 310.46);
  assert.equal(result.combinedAnnualCost, 783.55);
  assert.equal(result.costPer100Miles, 6.53);
});

test("EV versus gas compares the same annual miles and returns positive savings when EV energy is cheaper", () => {
  const result = calculateEvVsGas({ annualMiles: 12000, evEfficiencyKwhPer100Miles: 28, homeRateCents: 16, publicRateCents: 42, homePercent: 80, chargingLossPercent: 10, gasMpg: 28, gasPrice: 3.5 });
  assert.equal(result.evAnnualCost, 783.55);
  assert.equal(result.gasAnnualCost, 1500);
  assert.equal(result.annualSavings, 716.45);
  assert.equal(result.fiveYearSavings, 3582.25);
  assert.equal(result.gasCostPerMile, 0.13);
});

test("off-peak charging calculation caps a nonsensical off-peak share and reports the rate-shift savings", () => {
  const result = calculateOffPeakSavings({ annualMiles: 12000, efficiencyKwhPer100Miles: 25, chargingLossPercent: 0, peakRateCents: 30, offPeakRateCents: 10, offPeakPercent: 125 });
  assert.equal(result.annualKwh, 3000);
  assert.equal(result.mixedAnnualCost, 300);
  assert.equal(result.annualSavings, 600);
  assert.equal(result.monthlySavings, 50);
});

test("home charger calculation subtracts only entered incentives and does not invent payback when savings are zero", () => {
  const result = calculateHomeCharger({ chargerPrice: 600, laborCost: 500, electricalWork: 250, permitCost: 100, panelUpgrade: 0, otherCost: 0, federalIncentive: 0, stateIncentive: 150, utilityRebate: 250, manufacturerRebate: 0, otherRebate: 0, annualFuelSavings: 760 });
  assert.equal(result.grossInstallationCost, 1450);
  assert.equal(result.totalIncentives, 400);
  assert.equal(result.netInstallationCost, 1050);
  assert.equal(result.paybackYears, 1.38);
  assert.equal(calculateHomeCharger({ chargerPrice: 1000, laborCost: 0, electricalWork: 0, permitCost: 0, panelUpgrade: 0, otherCost: 0, federalIncentive: 0, stateIncentive: 0, utilityRebate: 0, manufacturerRebate: 0, otherRebate: 0, annualFuelSavings: 0 }).paybackYears, null);
});
