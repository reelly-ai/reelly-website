"use client";

import { useState } from "react";
import "./McpBlock.css";
import McpInstallModal, { BrandMark, MCP_SERVER_URL, type McpClient } from "./McpInstallModal";

const s = {
  accent: "rmcp-accent",
  after: "rmcp-after",
  api: "rmcp-api",
  apiBtn: "rmcp-api-btn",
  apiIcon: "rmcp-api-icon",
  apiSub: "rmcp-api-sub",
  apiText: "rmcp-api-text",
  apiTitle: "rmcp-api-title",
  bar: "rmcp-bar",
  big: "rmcp-big",
  btn: "rmcp-btn",
  btnClaude: "rmcp-btn-claude",
  btnLight: "rmcp-btn-light",
  card: "rmcp-card",
  chip: "rmcp-chip",
  chips: "rmcp-chips",
  container: "rmcp-container",
  copy: "rmcp-copy",
  copyText: "rmcp-copy-text",
  divided: "rmcp-divided",
  dot: "rmcp-dot",
  emiratesTitle: "rmcp-emirates-title",
  eyebrow: "rmcp-eyebrow",
  eyebrowSmall: "rmcp-eyebrow-small",
  grid3: "rmcp-grid3",
  installs: "rmcp-installs",
  lede: "rmcp-lede",
  left: "rmcp-left",
  mid: "rmcp-mid",
  muted: "rmcp-muted",
  panel: "rmcp-panel",
  panelLabel: "rmcp-panel-label",
  period: "rmcp-period",
  right: "rmcp-right",
  section: "rmcp-section",
  smallLabel: "rmcp-small-label",
  title: "rmcp-title",
  url: "rmcp-url",
  urlRow: "rmcp-url-row",
};


// Reelly MCP Server · API announcement block on the home page
// (design: "00 · Reelly AI Ecosystem · main site" board, lime accent replaced by the site indigo).
//
// TODO(live stats): the numbers below are a snapshot from the design board. They should come
// from catalogue_stats (same source as GET /api/mcp/home), which today needs a signed-in session.
// If the stats request fails, hide the catalogue cards instead of showing zeros.
const MCP_URL = MCP_SERVER_URL;
// Install buttons open the "Connect Reelly AI" dialog with the setup prompt (McpInstallModal.tsx).
const API_PAGE = "/api-extended";

const catalogue = [
  { value: "2,275", label: "published projects" },
  { value: "40,000+", label: "unit availability" },
  { value: "499", label: "developers" },
];
const catalogueMore = [
  { value: "3,038", label: "buildings" },
  { value: "3,364", label: "payment plans" },
  { value: "6,613", label: "points of interest" },
];
const moving = [
  { value: "+73", label: "new projects", period: "last 30 days" },
  { value: "611", label: "projects updated", period: "last 24 hours" },
  { value: "9,026", label: "new units", period: "last 30 days" },
];
const emirates: [string, string][] = [
  ["Dubai", "1,612"],
  ["Abu Dhabi", "170"],
  ["Ras Al Khaimah", "91"],
  ["Sharjah", "66"],
  ["Ajman", "32"],
  ["Umm Al Quwain", "15"],
  ["Fujairah", "1"],
];

const Arrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

export default function McpBlock() {
  const [copied, setCopied] = useState(false);
  const [install, setInstall] = useState<McpClient | null>(null);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the URL stays visible and selectable */
    }
  };

  return (
    <section className={s.section} aria-labelledby="mcp-title">
      <div className={s.container}>
        <div className={s.card}>
          <div className={s.left}>
            <div className={s.eyebrow}>
              <span className={s.dot} aria-hidden="true" />
              REELLY MCP SERVER · API
            </div>
            <h2 id="mcp-title" className={s.title}>
              The entire UAE off-plan market, inside your AI agent.
            </h2>
            <p className={s.lede}>
              Connect Reelly to Claude or ChatGPT in one click, right here. Start free with 1,000 requests, +2,000 for a verified profile.
            </p>
            <div className={s.installs}>
              <button type="button" onClick={() => setInstall("claude")} className={`${s.btn} ${s.btnClaude}`} aria-haspopup="dialog">
                <BrandMark which="claude" />
                Install in Claude
              </button>
              <button type="button" onClick={() => setInstall("chatgpt")} className={`${s.btn} ${s.btnLight}`} aria-haspopup="dialog">
                <BrandMark which="chatgpt" />
                Install in ChatGPT
              </button>
            </div>
            <div>
              <div className={s.smallLabel} id="mcp-manual">OR ADD IT MANUALLY IN ANY MCP CLIENT</div>
              <div className={s.urlRow}>
                <code className={s.url} aria-labelledby="mcp-manual">{MCP_URL}</code>
                <button type="button" className={s.copy} onClick={copy} aria-label="Copy MCP server URL">
                  {copied ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect width="13" height="13" x="9" y="9" rx="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                  <span className={s.copyText}>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
            </div>
            <a href={API_PAGE} className={s.api}>
              <span className={s.apiIcon} aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 18 6-6-6-6" />
                  <path d="m8 6-6 6 6 6" />
                </svg>
              </span>
              <span className={s.apiText}>
                <span className={s.apiTitle}>Building your own product? Use the Reelly API</span>
                <span className={s.apiSub}>20 read-only endpoints · 53 data fields per project · daily updates</span>
              </span>
              <span className={s.apiBtn}>
                API details <Arrow />
              </span>
            </a>
          </div>

          <div className={s.right}>
            <div className={s.panel}>
              <div className={s.panelLabel}>IN THE CATALOGUE</div>
              <div className={`${s.grid3} ${s.divided}`}>
                {catalogue.map((x) => (
                  <div key={x.label}>
                    <div className={s.big}>{x.value}</div>
                    <div className={s.bar} aria-hidden="true" />
                    <div className={s.muted}>{x.label}</div>
                  </div>
                ))}
              </div>
              <div className={`${s.grid3} ${s.after}`}>
                {catalogueMore.map((x) => (
                  <div key={x.label}>
                    <div className={s.mid}>{x.value}</div>
                    <div className={s.muted}>{x.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className={s.panel}>
              <div className={`${s.eyebrow} ${s.eyebrowSmall}`}>
                <span className={s.dot} aria-hidden="true" />
                ALWAYS MOVING
              </div>
              <div className={`${s.grid3} ${s.divided}`}>
                {moving.map((x) => (
                  <div key={x.label}>
                    <div className={`${s.mid} ${s.accent}`}>{x.value}</div>
                    <div className={s.muted}>
                      {x.label}
                      <br />
                      <span className={s.period}>{x.period}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className={s.after}>
                <div className={s.emiratesTitle}>United Arab Emirates — all 7 emirates, 153 districts</div>
                <ul className={s.chips}>
                  {emirates.map(([name, n]) => (
                    <li key={name} className={s.chip}>
                      {name} <strong>{n}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <McpInstallModal client={install} onClose={() => setInstall(null)} />
    </section>
  );
}
