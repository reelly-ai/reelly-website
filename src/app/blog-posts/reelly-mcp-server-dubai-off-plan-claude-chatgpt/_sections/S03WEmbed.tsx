const SLUG = "reelly-mcp-server-dubai-off-plan-claude-chatgpt";
const POST_URL = `https://reelly.ai/blog-posts/${SLUG}`;
const IMAGE = `https://reelly.ai/news/${SLUG}/cover.jpg`;

const faq: [string, string][] = [
  ["What is the Reelly MCP server?", "It is a connector that lets Claude, ChatGPT and other MCP clients search and compare UAE off-plan projects from the Reelly database."],
  ["What is the server address?", "https://mcp.reelly.ai/mcp/ (add it as a custom connector by URL)."],
  ["Is it free?", "You can start free with 1,000 requests; a verified profile adds 2,000. Paid plans start from 73 AED per month."],
  ["Can it make a client presentation?", "Yes, it generates a branded PDF presentation of a project."],
  ["Which assistants does it work with?", "Claude and ChatGPT, plus Claude Code, Codex and any MCP-compatible client."],
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "Reelly MCP Server Is Live: Search Dubai Off-Plan Projects Inside Claude and ChatGPT",
    description:
      "Connect Reelly to Claude or ChatGPT and search 2,300+ UAE off-plan projects, compare payment plans and generate client PDFs. Start free.",
    image: [IMAGE],
    datePublished: "2026-11-27",
    dateModified: "2026-11-27",
    mainEntityOfPage: POST_URL,
    url: POST_URL,
    author: { "@type": "Organization", name: "Reelly", url: "https://reelly.ai" },
    publisher: { "@type": "Organization", name: "Reelly", url: "https://reelly.ai" },
    keywords: "Dubai real estate MCP server, UAE off-plan MCP connector, Claude, ChatGPT, off-plan projects Dubai",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  },
];

export default function S03WEmbed() {
  return (
    <div className="w-embed">
      <meta property="og:title" content="Reelly MCP Server: Dubai Off-Plan Data in Claude & ChatGPT" />
      {" "}
      <meta property="og:description" content="Ask Claude or ChatGPT about UAE off-plan projects, prices and payment plans. Reelly MCP server: 2,300+ projects, 500+ developers. Start free." />
      {" "}
      <meta property="og:image" content={`/news/${SLUG}/cover.jpg`} />
      {" "}
      <meta property="og:url" content={SLUG} />
      {" "}
      <meta property="og:type" content="article" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
