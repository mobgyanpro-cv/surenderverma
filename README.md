# Surender Verma — Personal & Consulting Website

A modern, fast, accessible portfolio and consulting website for **Surender Verma**, featuring digital marketing, web engineering, workflow automation, and cyber safety awareness.

## Key Features
- **Dual-Theme Support**: Dark Mode (default high-tech aesthetic) & Light Mode with instant toggle and `localStorage` memory.
- **Command Palette (`Ctrl + K`)**: Instant keyboard search for pages, services, and direct contact actions.
- **Embedded Architecture**: Headers and footers are embedded directly into each static page, eliminating CORS blocks on `file:///`, preventing layout shifts, and maximizing search engine SEO.
- **Interactive Particle Background**: Lightweight 60fps canvas animation with cursor interaction and auto-pause.
- **Direct Contact Integrations**: WhatsApp click-to-chat, phone call links, and an interactive inquiry form.
- **100% Static**: Ready for instant deployment to Vercel, Netlify, GitHub Pages, cPanel, or any web host.

## Project Structure
```text
├── index.html        # Home landing page with hero & service overview
├── services.html     # Deep dive into Websites, Marketing, Automation & Safety
├── work.html         # Interactive capability showcase with category filters
├── about.html        # Bio, skill proficiency meters, values & timeline
├── contact.html      # Direct contact cards & project inquiry form
├── style.css         # Modern dual-theme CSS variables & responsive layout
├── app.js            # Particle canvas, theme switcher, Ctrl+K modal & mailer
├── config.js         # Central site configuration (name, email, phone, links)
├── header.html       # Source header partial
├── footer.html       # Source footer partial
├── robots.txt        # Search crawler directives
├── sitemap.xml       # Canonical SEO sitemap
└── HOW-TO-EDIT.txt   # Step-by-step editing and hosting guide
```

## Quick Deployment
Simply upload the entire folder contents to your web hosting provider or connect this repository to **Vercel** / **Netlify** / **GitHub Pages**. No build step or package manager required.
