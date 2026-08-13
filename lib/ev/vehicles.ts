export type EvVehicle = { id: string; label: string; make: string; model: string; modelYear: number; batteryKwh: number; efficiencyKwhPer100Miles: number; epaRange: number; connectorType: string; sourceUrl: string };
// Small editorial starter set. Supabase ev_vehicles is the replaceable production source of truth.
export const evVehicles: EvVehicle[] = [
  { id: "tesla-model-y-2025", label: "2025 Tesla Model Y", make: "Tesla", model: "Model Y", modelYear: 2025, batteryKwh: 75, efficiencyKwhPer100Miles: 28, epaRange: 327, connectorType: "NACS", sourceUrl: "https://www.fueleconomy.gov/" },
  { id: "hyundai-ioniq-5-2025", label: "2025 Hyundai IONIQ 5", make: "Hyundai", model: "IONIQ 5", modelYear: 2025, batteryKwh: 84, efficiencyKwhPer100Miles: 31, epaRange: 318, connectorType: "CCS", sourceUrl: "https://www.fueleconomy.gov/" },
  { id: "chevrolet-equinox-ev-2025", label: "2025 Chevrolet Equinox EV", make: "Chevrolet", model: "Equinox EV", modelYear: 2025, batteryKwh: 85, efficiencyKwhPer100Miles: 29, epaRange: 319, connectorType: "CCS", sourceUrl: "https://www.fueleconomy.gov/" },
  { id: "ford-f150-lightning-2025", label: "2025 Ford F-150 Lightning", make: "Ford", model: "F-150 Lightning", modelYear: 2025, batteryKwh: 123, efficiencyKwhPer100Miles: 48, epaRange: 320, connectorType: "CCS", sourceUrl: "https://www.fueleconomy.gov/" },
];
