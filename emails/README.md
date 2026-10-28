# Lead auto-reply email (GHL)

The customer gets this email immediately after submitting a form on the website.

- **Design:** `lead-auto-reply.html`
- **Logo:** loads from `https://rapidresponseplumbingandrestoration.com/email/logo.png` (`public/email/logo.png`). Don't delete or rename it.

## Settings
- **Subject:** `We got your request, {{contact.first_name}}. Help is on the way.`
- **Preview text:** already built into the HTML ("We'll call you shortly. If water is still leaking…")
- **From name:** `Rapid Response Plumbing & Restoration`
- **From email / Reply-to:** use an inbox the client actually checks, because the customers may reply to it.
  - The sending domain must be set up in GHL under **Settings → Email Services**, with a dedicated sending domain.
- **Merge fields:** `{{contact.first_name}}` (filled by the workflow's Create/Update Contact step from the webhook's `first_name`).

## Setup in GHL
1. **Marketing → Emails → Templates → + New → Code editor** (sometimes labeled "HTML" or "Import HTML").
2. Paste all of `lead-auto-reply.html`, name it **Website Lead Auto-Reply**, and save.
3. **Automation → Workflows → Website Lead workflow**. After **Create/Update Contact**, add the action **Send Email**:
   - **Template:** Website Lead Auto-Reply
   - Set the From name, From email, subject and Reply-to as above
4. Save and **Publish**.
5. Test it: submit the website form with your own name and email, and check the inbox, the spam folder and the phone view.

## Plain-text version (for the plain-text field, if GHL asks)

```
Hi {{contact.first_name}},

Thanks for contacting Rapid Response Plumbing & Restoration. A member of our team will call you shortly at the number you gave us to talk through what happened and set up your free inspection.

IS WATER STILL LEAKING OR DAMAGE SPREADING?
Don't wait for our call. We're available 24/7 and on the way in 1 hour or less.
Call 855-47-RAPID (855-477-2743)

WHILE YOU WAIT
1. Stop the water. If a pipe or fixture is leaking, shut off the main water valve.
2. Stay safe. Keep away from standing water near outlets or appliances, and from sewage or smoke-damaged areas.
3. Take photos. Pictures of the damage now help with your insurance claim later.
4. Move what you can. Get electronics, documents and valuables away from the water if it's safe to do so.

Filing an insurance claim? We work with all major insurance carriers and document the damage for your claim.

Talk soon,
The Rapid Response Team

Rapid Response Plumbing & Restoration
855-47-RAPID | rapidresponseplumbingandrestoration.com
You're receiving this email because you requested service on our website.
```
