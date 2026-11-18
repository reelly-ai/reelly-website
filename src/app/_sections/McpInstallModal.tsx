"use client";

import { useEffect, useRef, useState } from "react";

// "Connect Reelly AI to Claude or ChatGPT" dialog (design: PRD-296 mcpSetup modal, settings variant).
// Reelly is not in the Claude / ChatGPT directories: it is added as a custom connector by URL,
// so the dialog gives a ready setup prompt that walks the assistant through it.

export type McpClient = "claude" | "chatgpt";

export const MCP_SERVER_URL = "https://mcp.reelly.ai/mcp/";
const OPEN_URL: Record<McpClient, string> = {
  claude: "https://claude.ai/new",
  chatgpt: "https://chatgpt.com/",
};

export const SETUP_PROMPT = `Help me connect Reelly AI to the assistant I'm using: Claude or ChatGPT. Reelly AI is an MCP server that lets the assistant search Dubai off-plan projects, see their units and prices, and generate PDF presentations. It is added as a custom connector with this server URL, so don't look for it in the Claude or ChatGPT directories:
${MCP_SERVER_URL}

Guide me one step at a time and wait for my confirmation before the next step. Reply in the language I write in. Menus change often: if my screen looks different from what you describe, ask me what I see instead of guessing menu names.

Step 1. Ask me which assistant I use (Claude or ChatGPT), where (web, desktop app, mobile app, or Claude Code) and whether my account is personal or part of a Team / Business / Enterprise workspace.

Step 2. Add Reelly AI as a custom connector with the URL above.

Step 3. Sign in with my Reelly account when the connector asks for it.

Step 4. Check that the connection actually works: search Reelly for projects in Dubai Creek Harbour and show me three of them with the price from and the handover quarter.

If nothing comes back, don't guess — tell me which of these is the problem and how to fix it: the connector is not added, the sign-in did not go through, or Reelly's tools are switched off for this chat.`;

// Brand marks (same paths as the product's settings/mcp page)
const CLAUDE_PATH =
  "m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246-1.4146-2.1675-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z";
const OPENAI_PATH =
  "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z";

export const BrandMark = ({
  which,
  size = 16,
}: {
  which: McpClient;
  size?: number;
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d={which === "claude" ? CLAUDE_PATH : OPENAI_PATH} />
  </svg>
);

const CopyIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="13" height="13" x="9" y="9" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);
const ExternalIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 17 17 7" />
    <path d="M7 7h10v10" />
  </svg>
);

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

const Step = ({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) => (
  <li className="rmcp-m-step">
    <span className="rmcp-m-num" aria-hidden="true">
      {n}
    </span>
    <p>
      <b>{title}</b> {children}
    </p>
  </li>
);

export default function McpInstallModal({
  client,
  onClose,
}: {
  client: McpClient | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const promptRef = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);
  const [urlCopied, setUrlCopied] = useState(false);
  const openRef = useRef<HTMLDivElement>(null);

  // after copying, bring the "Open Claude / ChatGPT" buttons into view on short screens
  useEffect(() => {
    if (copied) openRef.current?.scrollIntoView({ block: "nearest" });
  }, [copied]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (client && !d.open) {
      setCopied(false);
      setUrlCopied(false);
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!client && d.open) {
      d.close();
    }
  }, [client]);

  const handleClose = () => {
    document.documentElement.style.overflow = "";
    onClose();
  };

  const copyPrompt = async () => {
    if (await copyText(SETUP_PROMPT)) {
      setCopied(true);
    } else if (promptRef.current) {
      // Clipboard API blocked: select the prompt and try the legacy copy; the selection
      // stays, so it can still be copied by hand if that fails too.
      const r = document.createRange();
      r.selectNodeContents(promptRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(r);
      let ok = false;
      try {
        ok = document.execCommand("copy");
      } catch {
        /* ignore */
      }
      if (ok) setCopied(true);
    }
  };
  const copyUrl = async () => {
    if (await copyText(MCP_SERVER_URL)) {
      setUrlCopied(true);
      setTimeout(() => setUrlCopied(false), 1600);
    }
  };

  const order: McpClient[] =
    client === "chatgpt" ? ["chatgpt", "claude"] : ["claude", "chatgpt"];
  const name = (c: McpClient) => (c === "claude" ? "Claude" : "ChatGPT");

  return (
    <dialog
      ref={ref}
      className="rmcp-modal"
      aria-labelledby="rmcp-m-title"
      aria-describedby="rmcp-m-desc"
      onClose={handleClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close(); // click on the backdrop
      }}
    >
      <div className="rmcp-m-body">
        <button
          type="button"
          className="rmcp-m-close"
          aria-label="Close"
          onClick={() => ref.current?.close()}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 id="rmcp-m-title" className="rmcp-m-title">
          <span className="rmcp-m-logos" aria-hidden="true">
            <span className="rmcp-m-disc rmcp-m-disc-claude">
              <BrandMark which="claude" size={12} />
            </span>
            <span className="rmcp-m-disc rmcp-m-disc-gpt">
              <BrandMark which="chatgpt" size={12} />
            </span>
          </span>
          Connect Reelly AI to Claude or ChatGPT
        </h2>
        <p id="rmcp-m-desc" className="rmcp-m-desc">
          Reelly AI is added as a custom connector — the prompt below walks your
          assistant through it, step by step.
        </p>

        <ol className="rmcp-m-steps">
          <Step n={1} title="Copy the setup prompt">
            below and paste it into Claude or ChatGPT. It walks you through
            connecting Reelly step by step.
          </Step>
          <Step n={2} title="Approve access">
            once with your Reelly account.
          </Step>
          <Step n={3} title="Check that it works">
            — the prompt asks your assistant for three live projects and names
            what to fix if nothing comes back.
          </Step>
        </ol>

        <div className="rmcp-m-field">
          <p className="rmcp-m-label" id="rmcp-m-url-label">
            Reelly MCP server URL
          </p>
          <div className="rmcp-m-url">
            <code aria-labelledby="rmcp-m-url-label">{MCP_SERVER_URL}</code>
            <button
              type="button"
              onClick={copyUrl}
              aria-label="Copy server URL"
            >
              {urlCopied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>

        <div className="rmcp-m-prompt">
          <p className="rmcp-m-label">Setup prompt</p>
          <pre ref={promptRef} tabIndex={0}>
            {SETUP_PROMPT}
          </pre>
        </div>

        <div className="rmcp-m-free">
          <b>1,000 free requests</b> when you connect · <b>+2,000</b> once your
          profile is verified
        </div>

        <div className="rmcp-m-foot">
          <button
            type="button"
            className="rmcp-m-primary"
            onClick={copyPrompt}
            aria-live="polite"
          >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied
              ? "Copied — now paste it into your assistant"
              : "Copy setup prompt"}
          </button>
          {copied && (
            <div className="rmcp-m-open" ref={openRef}>
              {order.map((c) => (
                <a
                  key={c}
                  href={OPEN_URL[c]}
                  target="_blank"
                  rel="noopener"
                  className="rmcp-m-outline"
                >
                  <BrandMark which={c} />
                  Open {name(c)}
                  <ExternalIcon />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
