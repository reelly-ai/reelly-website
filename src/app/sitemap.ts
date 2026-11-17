import type { MetadataRoute } from "next";
import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const BASE = "https://reelly.ai";
// Pages that should not be in search: sign-in/sign-up live in the product app.
// Static pages served from public/ via rewrites in next.config.ts.
const EXTRA = ["/for-developer"];
const EXCLUDE = new Set(["/password/login", "/password/sign-up"]);

// Every folder under src/app with a page.tsx is a public URL (built at build time).
function routes(dir: string, prefix = ""): string[] {
  const out: string[] = existsSync(join(dir, "page.tsx")) ? [prefix || "/"] : [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (!e.isDirectory() || /^[_(\[@.]/.test(e.name)) continue;
    out.push(...routes(join(dir, e.name), `${prefix}/${e.name}`));
  }
  return out;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...routes(join(process.cwd(), "src/app")), ...EXTRA]
    .filter((r) => !EXCLUDE.has(r))
    .sort()
    .map((r) => ({
      url: BASE + (r === "/" ? "" : r),
      changeFrequency: r.startsWith("/blog-posts/") || r.startsWith("/terms/") ? "yearly" : "monthly",
      priority: r === "/" ? 1 : r.startsWith("/blog-posts/") || r.startsWith("/terms/") ? 0.5 : 0.8,
    }));
}
