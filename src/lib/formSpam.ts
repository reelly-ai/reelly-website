// Spam guard for /api/forms.
//
// From 20.11.2026 a bot posts the contact form ~6 times an hour with random strings in every
// text field ("IKcGfQ3p2m", "jjsNWFCzcl", "9FDtUcrF2wMz3yUV12wF…") and real people's emails.
// The honeypot is added by formBridge in the browser, so a bot posting JSON straight to
// /api/forms never sees it. Checked on every site submission since 17.11 (600): this rule
// drops all 574 bot ones and none of the real or test ones.

type Field = { name: string; label: string; type: string; value: string };

// Normal word shapes: "dubai", "Dubai", "DAMAC", "2026".
const WORD = /^(?:[a-z]+|[A-Z][a-z]+|[A-Z]+|\d+)$/;
const CONTACT = /e-?mail|phone|tel/i;

// One token of 8+ letters/digits with no normal word casing: "IKcGfQ3p2m", "jjsNWFCzcl".
export function looksRandom(value: string): boolean {
  const s = value.trim();
  return s.length >= 8 && /^[A-Za-z0-9]+$/.test(s) && !WORD.test(s);
}

// Bot submission: no free-text field contains a space, and at least two of them are random tokens.
// Email and phone fields are ignored (the bot fills them with real-looking values).
export function isGibberish(fields: Field[]): boolean {
  const texts = fields
    .filter((f) => !CONTACT.test(`${f.type} ${f.name} ${f.label}`))
    .map((f) => f.value.trim())
    .filter(Boolean);
  return texts.length >= 2 && texts.every((t) => !/\s/.test(t)) && texts.filter(looksRandom).length >= 2;
}

// Per-IP burst limit, per server instance. A person reviewing the site filled 7 forms in 3 minutes
// (17.11), so the limit stays well above that.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 10;
const hits = new Map<string, number[]>();

export function rateLimited(ip: string, now = Date.now()): boolean {
  if (!ip) return false;
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [key, times] of hits) if (!times.some((t) => now - t < WINDOW_MS)) hits.delete(key);
  }
  return recent.length > MAX_PER_WINDOW;
}

export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "";
}
