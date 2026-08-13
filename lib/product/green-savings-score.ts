/**
 * The unpublished Green Savings Score contract. It intentionally provides no
 * score formula until the underlying ZIP, equipment, and incentive datasets
 * have a reviewed methodology and release cadence.
 */
export type GreenSavingsInputs = {
  zip: string;
  monthlyElectricityKwh?: number;
  homeType?: "single-family" | "multifamily" | "other";
  heatingType?: "electric" | "gas" | "propane" | "oil" | "other";
  annualMiles?: number;
  currentVehicleMpg?: number;
  solarInterest?: boolean;
};

export type SavingsOpportunity = {
  id: "ev" | "solar" | "heat-pump" | "thermostat" | "leds";
  annualSavings?: number;
  confidence: "unavailable" | "screening" | "source-backed";
  requiredData: string[];
};

export type GreenSavingsAssessment = {
  score: null;
  status: "methodology-not-published";
  opportunities: SavingsOpportunity[];
  methodologyVersion: null;
};

export function createGreenSavingsAssessment(): GreenSavingsAssessment {
  return {
    score: null,
    status: "methodology-not-published",
    methodologyVersion: null,
    opportunities: [
      { id: "ev", confidence: "unavailable", requiredData: ["ZIP-to-state lookup", "electricity price", "gasoline price", "vehicle efficiency"] },
      { id: "solar", confidence: "unavailable", requiredData: ["roof/production model", "utility rules", "installed cost", "incentives"] },
      { id: "heat-pump", confidence: "unavailable", requiredData: ["heating fuel use", "climate data", "installed cost", "incentives"] },
      { id: "thermostat", confidence: "unavailable", requiredData: ["heating/cooling usage", "equipment type", "tariff"] },
      { id: "leds", confidence: "unavailable", requiredData: ["fixture count", "runtime", "electricity price"] },
    ],
  };
}
