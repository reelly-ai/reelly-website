import { NextResponse } from "next/server";
import { clientIp, isGibberish, rateLimited } from "@/lib/formSpam";

// Receives submissions from every form on the site and forwards them server-to-server
// to the Reelly Integrations service (POST /webhooks/website), which creates the
// Kommo CRM lead in the right pipeline and stage. No third-party relay (Zapier etc.).
//
// Env vars (Vercel → Project → Settings → Environment Variables):
//   INTEGRATIONS_URL              base URL of the Integrations service, e.g. https://….up.railway.app
//   INTEGRATIONS_WEBHOOK_SECRET   same value as WEBSITE_WEBHOOK_SECRET on the Integrations service

type Field = { name: string; label: string; placeholder?: string; type: string; value: string };
type Body = {
  submission_id?: string;
  form?: string;
  page?: string;
  fields?: Field[] | Record<string, string>;
  utm?: Record<string, string>;
  hp?: string;
};

const clip = (v: unknown, n: number) => String(v ?? "").slice(0, n);

// Accepts the Webflow bridge's field list and the BRM landing's plain {key: value} object.
function normalizeFields(fields: Body["fields"]): Field[] {
  if (Array.isArray(fields)) {
    return fields.slice(0, 60).map((f) => ({
      name: clip(f?.name, 100),
      label: clip(f?.label, 200),
      placeholder: clip(f?.placeholder, 200),
      type: clip(f?.type, 20),
      value: clip(f?.value, 5000),
    }));
  }
  return Object.entries(fields ?? {})
    .slice(0, 60)
    .map(([k, v]) => ({ name: clip(k, 100), label: clip(k, 200), type: /email/i.test(k) ? "email" : /phone/i.test(k) ? "tel" : "text", value: clip(v, 5000) }));
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
  // Honeypot: real people never fill this hidden field.
  if (body.hp) return NextResponse.json({ ok: true });

  const ip = clientIp(req);
  if (rateLimited(ip)) {
    console.warn(`Forms: rate limited "${clip(body.form, 100)}" from ${ip}`);
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  // Bot spam (random strings in every text field): answer ok so the bot doesn't adapt, create no lead.
  if (isGibberish(normalizeFields(body.fields))) {
    console.warn(`Forms: spam dropped "${clip(body.form, 100)}" from ${ip}`);
    return NextResponse.json({ ok: true });
  }

  const base = process.env.INTEGRATIONS_URL;
  const secret = process.env.INTEGRATIONS_WEBHOOK_SECRET;
  if (!base || !secret) {
    console.error("Forms: INTEGRATIONS_URL / INTEGRATIONS_WEBHOOK_SECRET are not configured");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 500 });
  }

  const utm = Object.fromEntries(
    Object.entries(body.utm ?? {})
      .filter(([k]) => k.startsWith("utm_"))
      .map(([k, v]) => [clip(k, 30), clip(v, 250)]),
  );
  const payload = {
    submission_id: clip(body.submission_id || crypto.randomUUID(), 64),
    form: clip(body.form || "Unnamed form", 100),
    page_url: clip(body.page, 500),
    submitted_at: new Date().toISOString(),
    fields: normalizeFields(body.fields),
    utm,
  };

  try {
    const res = await fetch(new URL("/webhooks/website", base), {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${secret}` },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) {
      console.error(`Forms: Integrations responded ${res.status} for "${payload.form}" (${payload.submission_id})`);
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
  } catch (err) {
    console.error(`Forms: Integrations unreachable for "${payload.form}" (${payload.submission_id})`, err);
    return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
