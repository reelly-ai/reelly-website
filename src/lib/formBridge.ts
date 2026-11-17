// Takes over Webflow form submissions (which only work on Webflow hosting) and sends
// them to /api/forms, which forwards to the Integrations service (→ Kommo CRM). Keeps Webflow's success/error blocks
// (.w-form-done / .w-form-fail) and the form's redirect setting.
// Memberstack login/sign-up forms (data-ms-form) are left alone.

export type FormField = { name: string; label: string; placeholder?: string; type: string; value: string };

// Human-readable label of a field: <label for>, data-name, name.
function fieldLabel(el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): string {
  const byFor = el.id ? el.form?.querySelector<HTMLLabelElement>(`label[for="${CSS.escape(el.id)}"]`) : null;
  return (byFor?.textContent?.trim() || el.getAttribute("data-name") || el.name).trim();
}

function formFields(form: HTMLFormElement): FormField[] {
  const out: FormField[] = [];
  for (const el of Array.from(form.elements)) {
    if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement || el instanceof HTMLTextAreaElement)) continue;
    if (!el.name || el.disabled || el.name === "cf-turnstile-response" || el.name === "_hp") continue;
    if (el instanceof HTMLInputElement && ["submit", "button", "password", "file"].includes(el.type)) continue;
    if (el instanceof HTMLInputElement && ["checkbox", "radio"].includes(el.type) && !el.checked) continue;
    const type = el instanceof HTMLTextAreaElement ? "textarea" : el instanceof HTMLSelectElement ? "select" : el.type;
    const placeholder = el instanceof HTMLSelectElement ? "" : el.placeholder;
    out.push({ name: el.name, label: fieldLabel(el), placeholder, type, value: el.value });
  }
  return out;
}

// Posts a submission to /api/forms, which forwards it to the Integrations service → Kommo.
export function sendForm(form: string, fields: FormField[], hp?: string) {
  const utm: Record<string, string> = {};
  for (const [k, v] of new URLSearchParams(location.search)) if (k.startsWith("utm_")) utm[k] = v;
  return fetch("/api/forms", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      submission_id: crypto.randomUUID(),
      form,
      page: location.href,
      fields,
      utm,
      hp,
    }),
  }).catch(() => ({ ok: false }) as Response);
}

export function installFormBridge() {
  const w = window as unknown as { __formBridge?: boolean };
  if (w.__formBridge) return;
  w.__formBridge = true;

  window.addEventListener(
    "submit",
    async (e) => {
      const form = e.target as HTMLFormElement;
      if (!(form instanceof HTMLFormElement) || form.hasAttribute("data-ms-form")) return;
      const wrapper = form.closest(".w-form");
      if (!wrapper) return;
      e.preventDefault();
      e.stopImmediatePropagation();

      const done = wrapper.querySelector<HTMLElement>(".w-form-done");
      const fail = wrapper.querySelector<HTMLElement>(".w-form-fail");
      const button = form.querySelector<HTMLInputElement>('input[type="submit"], button[type="submit"]');
      const label = button?.value;
      if (button) {
        button.disabled = true;
        const wait = button.getAttribute("data-wait");
        if (wait) button.value = wait;
      }
      if (fail) fail.style.display = "none";

      const res = await sendForm(
        form.getAttribute("data-name") || form.name || form.id,
        formFields(form),
        form.querySelector<HTMLInputElement>('input[name="_hp"]')?.value,
      );
      const ok = res.ok;

      if (button) {
        button.disabled = false;
        if (label !== undefined) button.value = label;
      }
      if (!ok) {
        if (fail) fail.style.display = "block";
        return;
      }
      const redirect = form.getAttribute("data-redirect") || form.getAttribute("redirect");
      if (redirect) {
        location.href = redirect;
        return;
      }
      form.reset();
      form.style.display = "none";
      if (done) done.style.display = "block";
    },
    true,
  );

  // Hidden honeypot field for spam bots (replaces Webflow's Turnstile, which is tied to Webflow hosting).
  document.querySelectorAll<HTMLFormElement>(".w-form form:not([data-ms-form])").forEach((f) => {
    if (f.querySelector('input[name="_hp"]')) return;
    const hp = document.createElement("input");
    hp.type = "text";
    hp.name = "_hp";
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.setAttribute("aria-hidden", "true");
    hp.style.cssText = "position:absolute;left:-10000px;width:1px;height:1px;opacity:0";
    f.appendChild(hp);
  });
}
