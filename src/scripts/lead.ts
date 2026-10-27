// Sends a lead form to the GHL inbound webhook as JSON, then redirects to the
// form's thank-you page. Forms opt in with data-lead and carry their settings
// as data attributes (see QuoteForm and VideoLeadForm). The webhook allows
// cross-origin POSTs, so no server function is needed.

function payload(form: HTMLFormElement) {
  const data: Record<string, string> = {};
  new FormData(form).forEach((value, key) => {
    if (typeof value === 'string' && key !== 'website') data[key] = value.trim();
  });
  const [first = '', ...rest] = (data.name ?? '').split(/\s+/);
  return {
    ...data,
    first_name: first,
    last_name: rest.join(' '),
    address1: data.address ?? '', // GHL's standard contact address field
    form_name: form.dataset.formName ?? 'Website form',
    page_url: location.href,
    submitted_at: new Date().toISOString(),
  };
}

export function wireLeadForms() {
  // Both form components call this; the flag keeps a form from sending twice.
  document.querySelectorAll<HTMLFormElement>('form[data-lead]:not([data-wired])').forEach((form) => {
    form.dataset.wired = '';
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const error = form.querySelector<HTMLElement>('.lead-error');
    const { endpoint = '', success = '/thank-you/' } = form.dataset;

    // The submit event only fires after the browser's required-field checks pass.
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (button?.disabled) return;
      // Honeypot: people never see the "website" field, bots fill it in.
      if ((form.elements.namedItem('website') as HTMLInputElement | null)?.value) {
        location.assign(success);
        return;
      }
      if (button) button.disabled = true;
      if (error) error.hidden = true;
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload(form)),
        });
        if (!res.ok) throw new Error(`Webhook returned ${res.status}`);
        location.assign(success);
      } catch {
        if (error) error.hidden = false;
        if (button) button.disabled = false;
      }
    });
  });
}
