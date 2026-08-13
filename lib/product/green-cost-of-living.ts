export type GreenCostOfLivingDataset = {
  geography: { type: "state" | "city"; code: string; name: string };
  electricity?: { annualCost: number; sourceUrl: string; period: string };
  gasoline?: { annualCost: number; sourceUrl: string; period: string };
  ev?: { annualEnergyCost: number; sourceUrl: string; period: string };
  solar?: { annualizedEconomics: number; sourceUrl: string; period: string };
  incentives?: { value: number; sourceUrl: string; verifiedAt: string };
};

/** Rankings remain unavailable until every compared geography has comparable sources and a published methodology. */
export function canPublishGreenCostOfLivingIndex(rows: GreenCostOfLivingDataset[]) {
  return rows.length >= 2 && rows.every((row) => row.electricity && row.gasoline && row.ev && row.solar && row.incentives);
}
