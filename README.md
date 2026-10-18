# Surender Verma — Personal Portfolio

A responsive personal website focused on digital marketing, website development, lead generation, workflow automation and digital safety awareness. It is configured for static deployment on GitHub Pages-compatible hosting or Vercel; `vercel.json` adds response security headers on Vercel.

## Technology and scope
- HTML5, CSS3 and vanilla JavaScript
- No framework, package install, build step, backend API, database, authentication, tracking scripts or third-party JavaScript
- Shared header/footer fragments are same-origin static files
- Contact form prepares text locally; it never sends form data to a server

Because this version has no API/database/authentication, SQL injection, server-side CSRF and database BOLA/IDOR do not apply to the current architecture. See `SECURITY.md` before adding any backend.

## Files
- `index.html` — home page
- `services.html` — service areas
- `work.html` — capabilities (not fabricated case studies)
- `about.html` — personal profile
- `contact.html` — copy-only message form
- `404.html` — not-found page
- `header.html`, `footer.html` — shared page fragments
- `style.css`, `app.js`, `config.js` — presentation, interaction and public site configuration
- `vercel.json` — Vercel security headers
- `robots.txt`, `sitemap.xml.template` — crawler files (finish sitemap setup only after choosing a real domain)
- `SECURITY.md` — security scope and deployment checklist

## Deploy on Vercel
1. Extract the ZIP and upload the files and folders to the root of a GitHub repository.
2. In Vercel, import that repository.
3. Use the static site defaults; no install or build command is required. The output/root directory is the repository root.
4. Deploy and verify `vercel.json` headers on the live site.

## Preview locally
The header/footer are loaded with same-origin `fetch()`, so do not double-click the HTML file. From this folder run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`. Vercel response headers only apply on Vercel, not the basic local server.

## Safe configuration
Edit `config.js` to change the public site tagline/announcement and, if desired, add email, phone, WhatsApp or website details you explicitly want public. All values in this file are delivered to every visitor and must be treated as public. Do not put API keys, credentials or secrets here. Contact fields are intentionally blank by default.

## Contact form limitations
The form validates and trims its fields in the browser, then copies a formatted message to the clipboard or displays it for manual copying if clipboard access is unavailable. It does not submit a network request, store a message or guarantee delivery. Do not ask visitors for passwords, financial details or sensitive documents.

## Sitemap
After configuring a real canonical domain, replace every `https://YOUR-DOMAIN.example` placeholder in `sitemap.xml.template`, save it as `sitemap.xml`, and add a `Sitemap: https://your-real-domain/sitemap.xml` line to `robots.txt`. Do not publish the placeholder template as an actual sitemap.
