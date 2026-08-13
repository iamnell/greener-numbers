export type AnalyticsEvent = "ev_calculator_started" | "ev_calculator_completed" | "ev_vehicle_selected" | "ev_vs_gas_completed" | "home_charger_calculation_completed" | "calculator_cta_click" | "newsletter_signup" | "charger_finder_search" | "incentive_search" | "affiliate_click" | "installer_lead_click" | "news_to_calculator_click" | "guide_to_calculator_click";

// Event boundary only: no analytics provider is configured yet. Never pass precise location,
// address, VIN, email, or other personal data through this function.
export function track(event: AnalyticsEvent, properties: Record<string, string | number | boolean> = {}) {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("greener-numbers:analytics", { detail: { event, properties } }));
}
