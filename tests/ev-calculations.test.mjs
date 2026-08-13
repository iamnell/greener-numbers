import test from "node:test";
import assert from "node:assert/strict";
import { calculateChargingCost, calculateEvVsGas, calculateHomeCharger, calculateOffPeakSavings } from "../lib/ev/calculations.ts";

test("charging costs include configurable charging losses and blended rates", () => {
  const result = calculateChargingCost({ milesPerYear: 12000, efficiencyKwhPer100Miles: 30, electricityRate: .18, homeChargingPercent: 80, publicChargingPercent: 20, publicChargingRate: .45, batteryKwh: 75 });
  assert.equal(Math.round(result.energyKwh), 4000);
  assert.equal(Math.round(result.annualCost), 936);
  assert.equal(Math.round(result.fullChargeCost), 15);
});

test("EV versus gas comparison reports annual and five-year savings", () => {
  const result = calculateEvVsGas({ milesPerYear: 12000, efficiencyKwhPer100Miles: 30, electricityRate: .18, homeChargingPercent: 100, publicChargingPercent: 0, publicChargingRate: .45, mpg: 28, gasPrice: 3.4 });
  assert.ok(result.annualSavings > 0);
  assert.equal(result.fiveYearSavings, result.annualSavings * 5);
});

test("home charger net cost never drops below zero and payback avoids division by zero", () => {
  const result = calculateHomeCharger({ chargerPrice: 500, laborCost: 500, electricalWork: 0, permitCost: 0, panelUpgrade: 0, wiringCost: 0, otherCost: 0, federalIncentive: 1200, stateIncentive: 0, utilityRebate: 0, manufacturerRebate: 0, otherRebate: 0, annualSavings: 0 });
  assert.equal(result.netCost, 0);
  assert.equal(result.paybackYears, null);
});

test("off-peak savings are zero when the off-peak rate is not lower", () => {
  assert.equal(calculateOffPeakSavings({ annualMiles: 12000, efficiencyKwhPer100Miles: 30, peakRate: .12, offPeakRate: .15, offPeakPercent: 80 }).annualSavings, 0);
});
