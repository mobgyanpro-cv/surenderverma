/* ==========================================================================
   PERSONAL BRAND ENGINE — Surender Verma (app.js)
   Fast, accessible, progressive enhancement, zero external dependencies
   ========================================================================== */

(function () {
  'use strict';

  // Utility selectors
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // 1. Dynamic Data Hydration from config.js
  function hydrateSiteData() {
    if (typeof SITE === 'undefined') return;

    // Brand and Name
    $$('[data-site="brand"]').forEach(el => { el.innerHTML = SITE.brand || 'Surender <span>Verma</span>'; });
    $$('[data-site="name"]').forEach(el => { el.textContent = SITE.name || 'Surender Verma'; });
    $$('[data-site="location"]').forEach(el => { el.textContent = SITE.location || 'Sirsa, Haryana, India'; });
    $$('[data-site="tagline"]').forEach(el => { el.textContent = SITE.tagline || ''; });

    // WhatsApp links
    const whatsappUrl = SITE.whatsapp 
      ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent('Hi Surender, I am reaching out via your website.')}` 
      : '#';
    $$('[data-wa]').forEach(el => {
      el.href = whatsappUrl;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
    });

    // Contact bindings (Preserves inner HTML for cards that contain child elements)
    $$('[data-c]').forEach(el => {
      const type = el.dataset.c;
      const isAnchor = el.tagName.toLowerCase() === 'a';

      if (type === 'email' && SITE.email) {
        if (isAnchor) {
          el.href = `mailto:${SITE.email}`;
          if (el.children.length === 0) {
            el.textContent = SITE.email;
          }
        } else {
          el.textContent = SITE.email;
        }
      } else if (type === 'phone' && (SITE.phone || SITE.phoneText)) {
        if (isAnchor) {
          el.href = `tel:${SITE.phone || SITE.phoneText}`;
          if (el.children.length === 0) {
            el.textContent = SITE.phoneText || SITE.phone;
          }
        } else {
          el.textContent = SITE.phoneText || SITE.phone;
        }
      } else if (type === 'linkedin' && SITE.linkedin) {
        if (isAnchor) {
          el.href = SITE.linkedin;
          el.target = '_blank';
          el.rel = 'noopener noreferrer';
        }
      } else if (type === 'instagram' && SITE.instagram) {
        if (isAnchor) {
          el.href = SITE.instagram;
          el.target = '_blank';
          el.rel = 'noopener noreferrer';
        }
      } else if (type === 'growthKaro' && SITE.growthKaro) {
        if (isAnchor) {
          el.href = SITE.growthKaro;
          el.target = '_blank';
          el.rel = 'noopener noreferrer';
        }
      } else if (type === 'year') {
        el.textContent = SITE.year || new Date().getFullYear();
      }
    });

    // Credibility Stats (Update all matching elements across entire page)
    if (SITE.stats) {
      if (SITE.stats.followers) {
        $$('[data-stat="followers"]').forEach(el => { el.textContent = SITE.stats.followers; });
      }
      if (SITE.stats.connections) {
        $$('[data-stat="connections"]').forEach(el => { el.textContent = SITE.stats.connections; });
      }
      if (SITE.stats.stories) {
        $$('[data-stat="stories"]').forEach(el => { el.textContent = SITE.stats.stories; });
      }
    }

    // CTA links
    $$('[data-cta-link]').forEach(el => {
      el.href = SITE.meetingLink || 'contact.html';
      if (!el.textContent.trim()) {
        el.textContent = SITE.cta || 'Book a call';
      }
    });
  }

  // 2. Mobile Navigation Toggle & Drawer
  function setupMobileNav() {
    const toggleBtn = $('#mobileNavToggle');
    const drawer = $('#mobileNavDrawer');
    if (!toggleBtn || !drawer) return;

    const closeDrawer = () => {
      drawer.classList.remove('open');
      document.body.classList.remove('drawer-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.textContent = '☰';
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = drawer.classList.toggle('open');
      document.body.classList.toggle('drawer-open', isOpen);
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Close when clicking ANY link or button inside mobile drawer
    $$('a', drawer).forEach(link => {
      link.addEventListener('click', closeDrawer);
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        closeDrawer();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // 3. Header Scroll Glass Effect
  function setupHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 4. Subtle Scroll Reveal (IntersectionObserver)
  function setupScrollReveal() {
    const elements = $$('.fade-up, .reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  // 5. Image Fallback Handling
  function setupImageFallbacks() {
    $$('img.hero-portrait-img').forEach(img => {
      const handleFallback = () => {
        if (!img.src.includes('surender-placeholder.svg')) {
          img.src = 'images/surender-placeholder.svg';
        }
      };
      img.addEventListener('error', handleFallback);
      if (img.complete && img.naturalWidth === 0) {
        handleFallback();
      }
    });
  }

  // 6. Highlight Active Navigation Item (Robust URL normalization)
  function highlightCurrentPage() {
    let currentPath = window.location.pathname.split('/').pop().toLowerCase();
    
    // Normalize index and clean URLs
    if (!currentPath || currentPath === '' || currentPath === 'index') {
      currentPath = 'index.html';
    } else if (!currentPath.includes('.')) {
      currentPath = currentPath + '.html';
    }

    const allLinks = $$('.nav-link, .mobile-nav-link');
    allLinks.forEach(link => {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      
      const href = (link.getAttribute('href') || '').toLowerCase().split('?')[0].split('#')[0];
      if (href === currentPath) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // 7. Contact Form Direct WhatsApp Integration & Topic Pre-selection
  function setupContactForm() {
    const form = $('#contactForm');
    const select = $('#interestSelect');
    const statusDiv = $('#formStatus');

    // Auto-select dropdown from URL query parameters (e.g. ?interest=career)
    if (select) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const interest = urlParams.get('interest');
        if (interest) {
          const opt = select.querySelector(`option[value="${interest}"]`);
          if (opt) select.value = interest;
        }
      } catch (e) {}
    }

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#nameInput') ? $('#nameInput').value.trim() : '';
      const contact = $('#contactInput') ? $('#contactInput').value.trim() : '';
      const topic = select && select.selectedIndex >= 0 ? select.options[select.selectedIndex].text : '';
      const message = $('#messageInput') ? $('#messageInput').value.trim() : '';

      const text = `Hi Surender,\n\nName: ${name}\nContact: ${contact}\nTopic: ${topic}\nMessage: ${message}`;
      const waNumber = (typeof SITE !== 'undefined' && SITE.whatsapp) ? SITE.whatsapp : '919817242747';
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
      
      // Provide instant user feedback
      if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = 'var(--color-primary-light, #EEF2FF)';
        statusDiv.style.border = '1px solid var(--border-color, #E3E9F4)';
        statusDiv.style.color = 'var(--text-main, #0B1B3A)';
        statusDiv.innerHTML = `Opening WhatsApp to send your message...<br><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; text-decoration: underline; color: var(--color-primary, #2F5BFF);">Click here if WhatsApp didn't open automatically →</a>`;
      }

      // Try opening WhatsApp in new tab
      const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
        // Pop-up blocked, redirect in current window
        window.location.href = waUrl;
      }
    });
  }

  // 8. Dark / Night Mode Engine
  function setupTheme() {
    const root = document.documentElement;
    const toggleBtns = $$('#themeToggle, .theme-toggle');

    function updateIcons(theme) {
      const isDark = theme === 'dark';
      toggleBtns.forEach(btn => {
        btn.innerHTML = isDark ? '☀️' : '🌙';
        btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Night Mode');
        btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Night Mode');
      });
    }

    const savedTheme = localStorage.getItem('sv-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    root.setAttribute('data-theme', currentTheme);
    updateIcons(currentTheme);

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('sv-theme', nextTheme);
        updateIcons(nextTheme);
      });
    });
  }

  // Initialize all modules when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    setupTheme();
    hydrateSiteData();
    setupMobileNav();
    setupHeaderScroll();
    setupScrollReveal();
    setupImageFallbacks();
    highlightCurrentPage();
    setupContactForm();
  });
})();
