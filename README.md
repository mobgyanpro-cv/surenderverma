# Surender Verma — Personal Brand Website (surenderverma.cv)

A clean, calm, and trustworthy personal brand website for **Surender Verma** (Sirsa, Haryana, India) — Founder & CEO at Growth Karo, Cyber Security Consultant, AI & Career Coach, and Social Worker / "Fraud Buster".

## Core Principles & Design System
- **60-30-10 Color System**:
  - `60%`: `#F7F9FC` (calm, spacious background)
  - `30%`: `#FFFFFF` surfaces, `#0B1B3A` text, `#5B6B85` muted text, `#E3E9F4` borders, and `#0B1B3A` dark testimonials section
  - `10%`: `#2F5BFF` primary buttons & links, `#FFB547` amber fraud highlights, `#12B886` success green
- **Typography**: Strictly **Poppins** Google Font with max two weights (`400` Regular and `600` Bold), tight heading letter-spacing (`-0.03em`), and line-height `1.68`.
- **Subtle Motion**: Smooth scroll reveals (`.fade-up` with `IntersectionObserver`). No heavy canvas particles, no 3D tilts, no marquees. Fully respects `prefers-reduced-motion`.
- **Single Primary Button Style**: `.btn-primary` with `#2F5BFF`.
- **Centralized Config**: Contact details, WhatsApp, LinkedIn, email, and location live only in `config.js`.

## Site Structure
```text
├── index.html        # Home (Hero with portrait, credibility strip, expertise cards, bio, Growth Karo, Fraud Buster, testimonials, final CTA)
├── about.html        # About Surender (Bio, Sirsa roots, timeline milestones, IGNOU education, core values, civil volunteering)
├── services.html     # Work With Me (Career coaching, personal branding, Growth Karo, cyber defense, 3-step process, FAQ)
├── awareness.html    # Fraud Awareness & Safety Guide (Common scams, warning signs, emergency action plan, official 1930 / cybercrime.gov.in details)
├── contact.html      # Contact (Direct WhatsApp, LinkedIn, Instagram, email cards, responsive 2-column layout, inquiry form)
├── work.html         # Canonical redirect to services.html
├── style.css         # Complete design system tokens, responsive utilities, WCAG-compliant contrasts
├── app.js            # Lightweight vanilla JS for hydration, active nav, mobile drawer, scroll header, and image fallback
├── config.js         # Centralized personal brand configuration
├── header.html       # Source header partial
├── footer.html       # Source footer partial
├── images/
│   ├── surender.jpg              # Executive portrait image (replaceable with user photo)
│   ├── surender-placeholder.svg  # Elegant vector fallback avatar (zero developer text)
│   ├── og-image.png              # High-res 1200x630 social share preview card (WhatsApp, LinkedIn, Twitter)
│   └── apple-touch-icon.png      # 180x180 Apple Touch Icon for iOS home screens
├── sitemap.xml       # Canonical XML sitemap
├── robots.txt        # Web crawler configuration
└── HOW-TO-EDIT.txt   # Step-by-step editing and hosting guide
```

## Quick Deployment
Upload all files directly to **Vercel**, **Netlify**, **GitHub Pages**, or any standard cPanel web host (`public_html`). Pure static HTML/CSS/JS with zero dependencies and no build steps.
