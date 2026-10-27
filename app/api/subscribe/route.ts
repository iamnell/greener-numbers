import { NextResponse } from "next/server";
import { database } from "../../../lib/db";

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
    await database().query("insert into newsletter_subscribers (email,consented_at,source,updated_at) values ($1,$2,$3,$4) on conflict (email) do update set consented_at=excluded.consented_at,source=excluded.source,updated_at=excluded.updated_at", [normalizedEmail, new Date().toISOString(), "website", new Date().toISOString()]);
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
