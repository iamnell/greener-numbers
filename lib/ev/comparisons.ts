import { evVehicles } from "./vehicles";
export type GasVehicle = { slug: string; label: string; mpg: number; purchasePrice?: number };
export const gasVehicles: GasVehicle[] = [{ slug: "toyota-rav4", label: "Toyota RAV4", mpg: 30 }, { slug: "ford-f150", label: "Ford F-150", mpg: 20 }, { slug: "hyundai-tucson", label: "Hyundai Tucson", mpg: 28 }];
export const comparisonSeeds = [
  { slug: "tesla-model-y-vs-toyota-rav4", evId: "tesla-model-y-2025", gasSlug: "toyota-rav4" },
  { slug: "ford-f150-lightning-vs-f150", evId: "ford-f150-lightning-2025", gasSlug: "ford-f150" },
  { slug: "hyundai-ioniq-5-vs-tucson", evId: "hyundai-ioniq-5-2025", gasSlug: "hyundai-tucson" },
] as const;
export function getComparison(slug: string) { const seed = comparisonSeeds.find((item) => item.slug === slug); if (!seed) return null; return { ...seed, ev: evVehicles.find((item) => item.id === seed.evId), gas: gasVehicles.find((item) => item.slug === seed.gasSlug) }; }
