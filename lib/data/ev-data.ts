import { createServerClient } from "../supabase/server";
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

  const client = createServerClient();
  let query = client
    .from("ev_incentives")
    .select("id,program_name,geography_type,geography_code,incentive_type,value_text,amount,currency,percentage,maximum_amount,benefit_basis,eligibility,effective_at,expires_at,status,source_url,source_publisher,source_updated_at,last_checked_at")
    .in("status", ["active", "unknown"])
    .order("last_checked_at", { ascending: false })
    .limit(100);

  if (normalizedState) {
    query = query.or(`geography_type.eq.federal,geography_code.eq.${normalizedState}`);
  }

  const { data, error } = await query;
  if (error) throw new Error("INCENTIVES_READ_FAILED");
  return data as PublishedIncentive[];
}
