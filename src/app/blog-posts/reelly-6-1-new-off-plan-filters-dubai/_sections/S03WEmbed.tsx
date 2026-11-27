const SLUG = "reelly-6-1-new-off-plan-filters-dubai";
const POST_URL = `https://reelly.ai/blog-posts/${SLUG}`;
const IMAGE = `https://reelly.ai/news/${SLUG}/cover.jpg`;

const faq: [string, string][] = [
  ["What are the new filters in Reelly 6.1?", "Furnishing, Branded project and Down payment, with sorting by Lowest down payment."],
  ["Can I find branded residences in Dubai off-plan?", "Yes. Turn on the Branded project filter to see only branded projects."],
  ["Which currencies can I use in a Sales Offer now?", "INR, AUD, CNY, PKR, SAR, SGD and KZT were added in this release, in the PDF and in the platform currency switcher."],
  ["Do the new filters work in Claude and ChatGPT?", "Yes. Project search through Reelly in Claude and ChatGPT supports the furnishing, branded project and down payment filters."],
  ["Where do I find Reelly?", "On soft.reelly.io. Sign in and open the project search."],
];

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "Reelly 6.1: New Off-Plan Filters and Smarter Sales Offers for Dubai Agents",
    description:
      "Reelly 6.1 adds off-plan filters for furnishing, branded projects and down payment, seven new Sales Offer currencies and a cleaner project list.",
    image: [IMAGE],
    datePublished: "2026-11-27",
    dateModified: "2026-11-27",
    mainEntityOfPage: POST_URL,
    url: POST_URL,
    author: { "@type": "Organization", name: "Reelly", url: "https://reelly.ai" },
    publisher: { "@type": "Organization", name: "Reelly", url: "https://reelly.ai" },
    keywords: "off-plan property search filters Dubai, branded residences Dubai off-plan, low down payment off-plan Dubai, furnished off-plan Dubai, Reelly 6.1",
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
      <meta property="og:title" content="Reelly 6.1: New Off-Plan Filters for Dubai Brokers" />
      {" "}
      <meta property="og:description" content="New off-plan filters, seven more Sales Offer currencies and a smoother Claude and ChatGPT connection. See what Reelly 6.1 changes for agents." />
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
