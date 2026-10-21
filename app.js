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
      } else if (type === 'year') {
        el.textContent = SITE.year || new Date().getFullYear();
      }
    });

    // Credibility Stats (Update all matching elements across entire page)
    if (SITE.stats) {
      if (SITE.stats.followers) {
        $$('[data-stat="followers"]').forEach(el => { el.textContent = SITE.stats.followers; });
      }
      if (SITE.stats.mlmFraud) {
        $$('[data-stat="mlmFraud"]').forEach(el => { el.textContent = SITE.stats.mlmFraud; });
      }
      if (SITE.stats.malwareCleanup) {
        $$('[data-stat="malwareCleanup"]').forEach(el => { el.textContent = SITE.stats.malwareCleanup; });
      }
      if (SITE.stats.moneyFraud) {
        $$('[data-stat="moneyFraud"]').forEach(el => { el.textContent = SITE.stats.moneyFraud; });
      }
      if (SITE.stats.startYear) {
        $$('[data-stat="startYear"]').forEach(el => { el.textContent = SITE.stats.startYear; });
      }
      if (SITE.stats.experience) {
        $$('[data-stat="experience"]').forEach(el => { el.textContent = SITE.stats.experience; });
      }
      if (SITE.stats.connections) {
        $$('[data-stat="connections"]').forEach(el => { el.textContent = SITE.stats.connections; });
      }
      if (SITE.stats.stories) {
        $$('[data-stat="stories"]').forEach(el => { el.textContent = SITE.stats.stories; });
      }
    }

    // CTA links (Calendly or Contact Page)
    $$('[data-cta-link]').forEach(el => {
      const link = SITE.meetingLink || 'https://calendly.com/bizsocialsurender/30min';
      el.href = link;
      if (link.startsWith('http')) {
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      }
      if (!el.textContent.trim()) {
        el.textContent = SITE.cta || 'Book a call';
      }
    });
  }

  // 2. Mobile Navigation Toggle & Slide-out Drawer
  function setupMobileNav() {
    const toggleBtn = $('#mobileNavToggle');
    const drawer = $('#mobileNavDrawer');
    if (!toggleBtn || !drawer) return;

    // Ensure backdrop exists
    let backdrop = $('#mobileNavBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'mobileNavBackdrop';
      backdrop.className = 'mobile-nav-backdrop';
      backdrop.setAttribute('aria-hidden', 'true');
    }

    // CRITICAL: Ensure drawer & backdrop are attached directly to document.body!
    // This prevents any parent sticky/backdrop-filter context (like .site-header) from breaking position:fixed.
    if (backdrop.parentElement !== document.body) {
      document.body.appendChild(backdrop);
    }
    if (drawer.parentElement !== document.body) {
      document.body.appendChild(drawer);
    }

    const closeBtn = $('#mobileNavClose');

    const openDrawer = () => {
      drawer.classList.add('open');
      backdrop.classList.add('open');
      document.body.classList.add('drawer-open');
      toggleBtn.classList.add('is-active');
      toggleBtn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    };

    const closeDrawer = () => {
      drawer.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('drawer-open');
      toggleBtn.classList.remove('is-active');
      toggleBtn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    };

    const toggleDrawer = (e) => {
      if (e) e.stopPropagation();
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    };

    toggleBtn.addEventListener('click', toggleDrawer);

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeDrawer();
      });
    }

    backdrop.addEventListener('click', closeDrawer);

    // Prevent background scrolling through the backdrop on touch devices
    backdrop.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });

    // Close when clicking ANY link or CTA button inside mobile drawer
    $$('a', drawer).forEach(link => {
      link.addEventListener('click', () => {
        setTimeout(closeDrawer, 120);
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });

    // Touch Swipe-to-Close gesture for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;

    drawer.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchCurrentX = touchStartX;
    }, { passive: true });

    drawer.addEventListener('touchmove', (e) => {
      touchCurrentX = e.touches[0].clientX;
    }, { passive: true });

    drawer.addEventListener('touchend', (e) => {
      const diffX = touchCurrentX - touchStartX;
      const diffY = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (diffX > 50 && diffY < 85) {
        closeDrawer();
      }
    }, { passive: true });

    // Highlight active link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    $$('.drawer-link, .mobile-nav-link', drawer).forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || (currentPage === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });

    // Auto-close if screen resized to desktop size
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1100 && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // 3. Smart Shrinking Header with Scroll Progress
  function setupHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;

    // Ensure progress indicator exists
    let progressBar = $('#headerScrollProgress');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'headerScrollProgress';
      progressBar.className = 'header-scroll-progress';
      progressBar.setAttribute('aria-hidden', 'true');
      header.appendChild(progressBar);
    }

    let ticking = false;

    const updateHeader = () => {
      if (document.body.classList.contains('drawer-open')) {
        ticking = false;
        return;
      }

      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Shrink header smoothly when scrolled down past 25px
      if (scrollY > 25) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Update reading progress bar width
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = progress.toFixed(1) + '%';
      }

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    updateHeader();
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

  // 5. Animated Number Counter for Credibility Stats
  function setupStatCounters() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const statElements = $$('.stat-num');
    if (!statElements.length || !('IntersectionObserver' in window)) return;

    const animateCount = (el) => {
      const rawText = el.textContent.trim();
      const match = rawText.match(/^(\d+)(\+?)$/);
      if (!match) return;

      const target = parseInt(match[1], 10);
      const suffix = match[2] || '';
      const duration = 1400; // ms
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statElements.forEach(el => observer.observe(el));
  }

  // 6. Image Fallback Handling
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

  // 6. Highlight Active Navigation Item
  function highlightCurrentPage() {
    let currentPath = window.location.pathname.split('/').pop().toLowerCase();
    
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

    if (select) {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const interest = urlParams.get('interest') || urlParams.get('service');
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
      
      if (statusDiv) {
        statusDiv.style.display = 'block';
        statusDiv.style.backgroundColor = 'var(--color-primary-light, #EEF2FF)';
        statusDiv.style.border = '1px solid var(--border-color, #E3E9F4)';
        statusDiv.style.color = 'var(--text-main, #0B1B3A)';
        statusDiv.innerHTML = `Opening WhatsApp to send your message...<br><a href="${waUrl}" target="_blank" rel="noopener noreferrer" style="font-weight: 600; text-decoration: underline; color: var(--color-primary, #2F5BFF);">Click here if WhatsApp didn't open automatically →</a>`;
      }

      const win = window.open(waUrl, '_blank', 'noopener,noreferrer');
      if (!win || win.closed || typeof win.closed === 'undefined') {
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

  // 9. Viewport Fit & Zoom Boundary Lock
  function setupViewportFit() {
    const snapToBoundary = () => {
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', () => {
        if (window.visualViewport.scale <= 1.01) {
          snapToBoundary();
        }
      });
      window.visualViewport.addEventListener('scroll', () => {
        if (window.visualViewport.scale <= 1.01 && window.scrollX !== 0) {
          snapToBoundary();
        }
      });
    }

    window.addEventListener('resize', snapToBoundary, { passive: true });
    window.addEventListener('orientationchange', snapToBoundary, { passive: true });
  }

  // Initialize all modules when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    setupViewportFit();
    setupTheme();
    hydrateSiteData();
    setupMobileNav();
    setupHeaderScroll();
    setupScrollReveal();
    setupStatCounters();
    setupImageFallbacks();
    highlightCurrentPage();
    setupContactForm();
  });
})();
