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

    // Contact bindings
    $$('[data-c]').forEach(el => {
      const type = el.dataset.c;
      if (type === 'email' && SITE.email) {
        el.href = `mailto:${SITE.email}`;
        el.textContent = SITE.email;
      } else if (type === 'phone' && (SITE.phone || SITE.phoneText)) {
        el.href = `tel:${SITE.phone || SITE.phoneText}`;
        el.textContent = SITE.phoneText || SITE.phone;
      } else if (type === 'linkedin' && SITE.linkedin) {
        el.href = SITE.linkedin;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      } else if (type === 'instagram' && SITE.instagram) {
        el.href = SITE.instagram;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      } else if (type === 'growthKaro' && SITE.growthKaro) {
        el.href = SITE.growthKaro;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      } else if (type === 'year') {
        el.textContent = SITE.year || new Date().getFullYear();
      }
    });

    // Credibility Stats
    if (SITE.stats) {
      if ($('[data-stat="followers"]')) $('[data-stat="followers"]').textContent = SITE.stats.followers || '11,700+';
      if ($('[data-stat="connections"]')) $('[data-stat="connections"]').textContent = SITE.stats.connections || '500+';
      if ($('[data-stat="stories"]')) $('[data-stat="stories"]').textContent = SITE.stats.stories || '100+';
    }

    // CTA links
    $$('[data-cta-link]').forEach(el => {
      el.href = SITE.meetingLink || 'contact.html';
      if (!el.textContent.trim()) {
        el.textContent = SITE.cta || 'Book a call';
      }
    });
  }

  // 2. Mobile Navigation Toggle
  function setupMobileNav() {
    const toggleBtn = $('#mobileNavToggle');
    const drawer = $('#mobileNavDrawer');
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = drawer.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggleBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Close when clicking a link inside mobile drawer
    $$('.mobile-nav-link', drawer).forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.textContent = '☰';
      });
    });

    // Close when clicking outside drawer
    document.addEventListener('click', (e) => {
      if (drawer.classList.contains('open') && !drawer.contains(e.target) && !toggleBtn.contains(e.target)) {
        drawer.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.textContent = '☰';
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
    const elements = $$('.fade-up');
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
    $$('img').forEach(img => {
      img.addEventListener('error', () => {
        if (img.classList.contains('hero-portrait-img')) {
          img.src = 'images/surender-placeholder.svg';
        }
      });
    });
  }

  // 6. Highlight Active Navigation Item
  function highlightCurrentPage() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // 7. Contact Form Direct WhatsApp Integration & Topic Pre-selection
  function setupContactForm() {
    const form = $('#contactForm');
    const select = $('#interestSelect');

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
      
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // Initialize all modules when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    hydrateSiteData();
    setupMobileNav();
    setupHeaderScroll();
    setupScrollReveal();
    setupImageFallbacks();
    highlightCurrentPage();
    setupContactForm();
  });
})();
