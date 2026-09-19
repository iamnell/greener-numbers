import { database } from "../db";
import { isSupportedIncentiveJurisdiction } from "./incentive-jurisdictions";

export type PublishedIncentive = {
  id: string;
  program_name: string;
  geography_type: "federal" | "state" | "local" | "utility";
  geography_code: string;
  incentive_type: string;
  value_text: string | null;
  amount: number | null;
  currency: string | null;
  percentage: number | null;
  maximum_amount: number | null;
  benefit_basis: string | null;
  eligibility: string | null;
  effective_at: string | null;
  expires_at: string | null;
  status: "active" | "expired" | "unknown";
  source_url: string;
  source_publisher: string | null;
  source_updated_at: string | null;
  last_checked_at: string;
};

export async function listVerifiedIncentives(state?: string) {
  const normalizedState = state?.trim().toUpperCase();
  if (normalizedState && !isSupportedIncentiveJurisdiction(normalizedState)) {
    throw new Error("INVALID_STATE");
  }

  const { rows } = normalizedState
    ? await database().query("select id,program_name,geography_type,geography_code,incentive_type,value_text,amount,currency,percentage,maximum_amount,benefit_basis,eligibility,effective_at,expires_at,status,source_url,source_publisher,source_updated_at,last_checked_at from ev_incentives where status in ('active','unknown') and (geography_type='federal' or geography_code=$1) order by last_checked_at desc limit 100", [normalizedState])
    : await database().query("select id,program_name,geography_type,geography_code,incentive_type,value_text,amount,currency,percentage,maximum_amount,benefit_basis,eligibility,effective_at,expires_at,status,source_url,source_publisher,source_updated_at,last_checked_at from ev_incentives where status in ('active','unknown') order by last_checked_at desc limit 100");
  return rows as PublishedIncentive[];
}
