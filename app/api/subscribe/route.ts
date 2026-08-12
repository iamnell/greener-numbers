import { NextResponse } from "next/server";
import { createServerClient } from "../../../lib/supabase/server";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const { email, consent } = await request.json().catch(() => ({}));
  if (typeof email !== "string" || !emailPattern.test(email)) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }
  if (consent !== true) {
    return NextResponse.json({ message: "Please confirm that you agree to receive the weekly brief." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  try {
    const { error } = await createServerClient().from("newsletter_subscribers").upsert(
      {
        email: normalizedEmail,
        consented_at: new Date().toISOString(),
        source: "website",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" },
    );
    if (error) throw error;
  } catch {
    return NextResponse.json({ message: "We could not save your subscription. Please try again." }, { status: 502 });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey || !publicationId) {
    return NextResponse.json({ message: "You're on the list. We'll email you when the weekly brief launches." });
  }

  const response = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ email: normalizedEmail, send_welcome_email: true, double_opt_override: "not_set", utm_source: "greenernumbers.com", utm_medium: "website", utm_campaign: "weekly_brief", referring_site: "https://greenernumbers.com" }),
  });
  if (!response.ok) return NextResponse.json({ message: "We could not save your subscription. Please try again." }, { status: 502 });
  return NextResponse.json({ message: "Check your inbox to confirm your subscription." });
}
