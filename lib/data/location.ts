/**
 * Server-side contract for future ZIP-aware calculators. Providers must return
 * source URLs and freshness rather than filling missing values with estimates.
 */
export type LocationContext = { zip: string; stateCode: string; stateName: string };
export type SourceBackedValue = { value: number; unit: string; sourceUrl: string; sourceName: string; updatedAt: string };
export type LocationEnergyProfile = { location: LocationContext; electricityRate?: SourceBackedValue; gasolinePrice?: SourceBackedValue; incentives?: Array<{ title: string; sourceUrl: string; lastVerifiedAt: string }> };
export interface LocationDataProvider { getProfile(zip: string): Promise<LocationEnergyProfile | null>; }

/** Deliberately empty until a ZIP-to-state and authoritative rate provider is configured. */
export const locationDataProvider: LocationDataProvider | null = null;
