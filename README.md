# Surender Verma — Personal Portfolio Website (surenderverma.cv)

A high-performance personal portfolio website for **Surender Verma** (Sirsa, Haryana, India) — Digital Builder, Technologist, and Cybersecurity Practitioner active since 2019.

## Core Identity & Positioning
- **Digital Builder & Technologist**: Fast, zero-bloat modern websites and digital experiences.
- **Next-Gen AI Video Studio**: Viral 9:16 reels, brand commercials, and custom talking avatars.
- **Google My Business Setup**: Complete verified Maps optimization, review generation, and local SEO.
- **Digital Safety Mission**: Pre-footer community authority helping 870+ victims navigate scams, MLMs, and malware for free.

## Tech Stack & Architecture
- **Semantic HTML5 & Modular CSS**: Sub-100ms load time, 100/100 Lighthouse performance.
- **Zero External Dependencies**: Pure vanilla JavaScript (`app.js`), no heavy frameworks or runtime bloat.
- **Native Dark/Light Theme**: Instant theme switching with zero flash of unstyled content (`localStorage` + media query).
- **Centralized Configuration**: All contact info, stats, and links live in `config.js`.

## Site Structure
```text
├── index.html                 # Homepage (Hero with micro-badges, portfolio preview, services, journey, digital safety mission, quick booking)
├── portfolio.html             # Dedicated Full Portfolio (Web development, AI video studio, GMB showcase)
├── web-development.html       # Commercial Service: High-Performance Web Development
├── gmb-setup.html             # Commercial Service: Google My Business & Local SEO
├── ai-video-production.html   # Commercial Service: Next-Gen AI Video Studio
├── digital-safety.html        # Community Impact: Cyber Fraud Triage & Free Guidance (870+ cases)
├── about.html                 # Full Story & Background (Since 2019, Gurugram, freelance evolution)
├── services.html              # Commercial Offerings & Pricing Scope Overview
├── contact.html               # Direct Contact (WhatsApp, Calendly 15-min scheduler, email)
├── style.css                  # Lightweight design system, responsive tokens, dark/light themes
├── app.js                     # Zero-dependency progressive enhancement engine
├── config.js                  # Centralized configuration & site metadata
├── images/
│   ├── surender-blue.jpg      # Hero portrait
│   ├── surender.jpg           # Profile avatar
│   ├── my-story-artwork.jpg   # Journey narrative visual
│   ├── surender-placeholder.svg # Vector fallback
│   ├── og-image.png           # 1200x630 social share preview card
│   └── apple-touch-icon.png   # 180x180 iOS touch icon
├── sitemap.xml                # Canonical XML sitemap
├── robots.txt                 # Search engine crawler configuration
└── HOW-TO-EDIT.txt            # Step-by-step editing and hosting guide
```

## Quick Deployment
Upload all files directly to **Vercel**, **Netlify**, **Cloudflare Pages**, **GitHub Pages**, or standard cPanel web hosting (`public_html`). Pure static HTML/CSS/JS with zero build steps required.
