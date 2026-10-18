# Security notes and scope

## Architecture
This is a static HTML, CSS, and vanilla JavaScript portfolio. It has no application API, database, authentication, session management, payment flow, or server-side form handler. Do not describe it as a full-stack authenticated application.

## Current safeguards
- Vercel response headers include a Content Security Policy, anti-framing controls, MIME sniffing protection, a restrictive referrer policy, and a limited Permissions Policy.
- The page uses no third-party JavaScript libraries and no externally hosted fonts.
- The shared header/footer partial loader is limited to a fixed allowlist of same-origin files, rejects redirects/cross-origin responses and unexpected content types, removes executable/embed nodes and inline event attributes, and inserts configuration values as text.
- Site search renders text via DOM APIs and only links to a fixed set of local pages.
- The contact form is a client-side message-preparation convenience. It copies the message to the visitor's clipboard or displays it for manual copying; it does not upload or send the data.
- Contact details are unset by default. Do not place secrets or API keys in `config.js`; all browser-delivered configuration is public.

## Risks that are not applicable to this static version
SQL injection and database BOLA/IDOR are not applicable because there is no database or protected API. Server-side CSRF protections are not applicable because the form does not submit a request. If an API, account system, or database is introduced later, implement and test authentication, per-resource authorization, CSRF defenses where appropriate, parameterized queries, rate limits, validation, logging, and concurrency controls before launch. Do not infer schema, auth behavior, or dependency versions.

## Deployment checklist
1. Deploy through HTTPS. Keep `vercel.json` security headers enabled and verify the live responses in browser developer tools.
2. Test navigation, search, keyboard focus, reduced-motion preferences and mobile layouts.
3. Replace contact settings only with contact details you explicitly want public.
4. Use a real canonical domain before publishing a sitemap; the template intentionally contains a placeholder.
5. Do not request or store passwords, financial details or identity documents through this static contact form.

## Reporting
No dedicated security contact has been configured. If this repository is public, use GitHub's private vulnerability reporting/security advisory feature when available. Avoid posting exploitable details in a public issue.
