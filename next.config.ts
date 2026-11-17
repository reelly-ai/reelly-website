import type { NextConfig } from "next";

// Primary domain. reelly.io, www.reelly.io and www.reelly.ai all 301 here, keeping path and query.
const CANONICAL = "https://reelly.ai";

// Old Webflow 301s (Site settings → Publishing → 301 redirects), with chains collapsed
// to their final page. Targets that no longer exist go to the home page.
const legacy: [string, string][] = [
  ["/for-agent", "/agent"],
  ["/old-home", "/"],
  // /buyers (old buyer beta page) was removed; it is not offered any more.
  ["/buyers", "/"],
  // /investor is hidden (source kept in src/app/_hidden/investor).
  ["/investor", "/"],
  ["/old-home-3", "/"],
  ["/old-home-4", "/"],
  ["/lending-for-the-developer", "/for-developer"],
  ["/developer", "/for-developer"],
  ["/developor", "/for-developer"],
  ["/1", "/for-developer"],
  ["/ukr-invest-club-alexey-shchevlyagin", "/"],
  ["/alexey-shchevlyagin", "/"],
  ["/sityscape", "/"],
  ["/cityscape", "/"],
  ["/password/registration", "/password/sign-up"],
  ["/password/password", "/password/sign-up"],
  ["/www.reelly.io", "/"],
  ["/reelly.io", "/"],
  ["/en", "/"],
  ["/5", "/"],
  ["/company", "/about-company"],
  ["/company-about", "/about-company"],
  ["/proptech", "/about-company"],
  ["/ai", "/api"],
  ["/api-copy", "/api"],
  ["/api-promo", "/api"],
  ["/lead-magnet-page", "/"],
  ["/lead-magnet-page-2", "/"],
  ["/guide", "/"],
  ["/portal-guide", "/"],
  ["/ohana", "/agency-leaders"],
  ["/b2b-services-for-real-estate-developers", "/for-developer"],
  // Developer pages are merged into one landing (public/brm/index.html served at /for-developer).
  ["/brm-for-developer", "/for-developer"],
  ["/colsulting", "/for-developer"],
  ["/consulting", "/for-developer"],
  ["/white-label", "/for-developer"],
  ["/white-labal", "/for-developer"],
  ["/brm", "/for-developer"],
  ["/brm/index.html", "/for-developer"],
  ["/thank-you-page-assistant", "/"],
  ["/thank-you-page-beta", "/"],
];

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // Old paths on a secondary domain go straight to the final page on reelly.ai (one hop).
      ...legacy.map(([source, destination]) => ({
        source,
        has: [{ type: "host" as const, value: "(?:www\\.)?reelly\\.io|www\\.reelly\\.ai" }],
        destination: CANONICAL + destination,
        statusCode: 301 as const,
      })),
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "(?:www\\.)?reelly\\.io|www\\.reelly\\.ai" }],
        destination: `${CANONICAL}/:path*`,
        statusCode: 301 as const,
      },
      ...legacy.map(([source, destination]) => ({ source, destination, statusCode: 301 as const })),
    ];
  },
  async rewrites() {
    return [{ source: "/for-developer", destination: "/brm/index.html" }];
  },
};

export default nextConfig;
