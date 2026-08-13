export type AnalyticsEvent = "ev_calculator_started" | "ev_calculator_completed" | "ev_vehicle_selected" | "ev_vs_gas_completed" | "home_charger_calculation_completed" | "charger_finder_search" | "incentive_search" | "affiliate_click" | "installer_lead_click";
export function trackEvent(event: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("greener-numbers:analytics", { detail: { event, properties } }));
}
