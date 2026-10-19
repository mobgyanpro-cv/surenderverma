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
    // Credibility Stats (Update all matching elements across entire page)
    if (SITE.stats) {
      if (SITE.stats.followers) {
        $$('[data-stat="followers"]').forEach(el => { el.textContent = SITE.stats.followers; });
      }
      if (SITE.stats.mlmFraud) {
        $$('[data-stat="mlmFraud"]').forEach(el => { el.textContent = SITE.stats.mlmFraud; });
      }
      if (SITE.stats.moneyFraud) {
        $$('[data-stat="moneyFraud"]').forEach(el => { el.textContent = SITE.stats.moneyFraud; });
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
        // slight timeout so the navigation starts smoothly
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
      // If user swiped right by more than 50px without excessive vertical movement
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
      // Do not alter header state while mobile drawer is actively open
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

  // 9. Viewport Fit & Zoom Boundary Lock (Snaps to 100% with zero blank margins)
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

  // 10. Testimonial Carousel / Slider Engine (Matching Reference Design: 20 Cards, Elevated Active Card, Infinite Seamless Loop)
  function setupTestimonialCarousel() {
    const wrap = $('#testimonialCarouselWrap') || $('.testimonial-carousel-wrap');
    const track = $('#testimonialTrack');
    const viewport = $('#testimonialViewport');
    const prevBtn = $('#testimonialPrev');
    const nextBtn = $('#testimonialNext');
    const dotsContainer = $('#testimonialDots');

    if (!wrap || !track || !viewport) return;

    // 20 Comprehensive Testimonials Data with top rectangular banners, reviewer details, and brand logos
    const testimonialsData = [
      {
        id: 1,
        banner: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=720&q=80",
        quote: "“Surender sir gave me total clarity on my professional positioning. Within 3 weeks of refining my LinkedIn approach and personal branding, I started receiving relevant inbound recruiter inquiries from high-growth tech companies.”",
        name: "Aman Sharma",
        role: "Software Engineer",
        company: "Bengaluru Tech",
        tag: "Career & Branding",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
      },
      {
        id: 2,
        banner: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=720&q=80",
        quote: "“Growth Karo overhauled our digital presence and marketing outreach. Surender cuts through the noise and provides actionable, no-nonsense growth frameworks that generated measurable traction for our business.”",
        name: "Rajesh Mehta",
        role: "Founder & MD",
        company: "Retail & E-commerce, Delhi",
        tag: "Growth Karo Client",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
      },
      {
        id: 3,
        banner: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80",
        quote: "“When our family was trapped in a fraudulent multi-level marketing scheme promising guaranteed returns, Surender guided us step-by-step through 1930 cyber reporting protocols. He saved our family savings. Truly a fearless fraud buster.”",
        name: "Pooja Rani",
        role: "Civil Services Aspirant",
        company: "Fraud Mentee, Haryana",
        tag: "Fraud Awareness",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
      },
      {
        id: 4,
        banner: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=720&q=80",
        quote: "“Surender sir's practical guidance on cyber safety, scam pattern identification, and incident response gave our entire community peace of mind. His dedication to social impact and helping people grow safely is truly inspiring.”",
        name: "Vikas Yadav",
        role: "Cyber Security Analyst",
        company: "Gurugram Advisory",
        tag: "Cyber Advisory",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg"
      },
      {
        id: 5,
        banner: "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=720&q=80",
        quote: "“My LinkedIn profile went from completely invisible to generating 15+ warm business enquiries every month. Surender sir taught me how to write high-converting thought leadership posts without sounding salesy.”",
        name: "Neha Kapoor",
        role: "HR Tech Consultant",
        company: "Mumbai Solutions",
        tag: "Personal Branding",
        logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg"
      },
      {
        id: 6,
        banner: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=720&q=80",
        quote: "“I lost ₹1.8 Lakh in a fake Part-Time YouTube Like Task scam. Sir promptly assisted me with bank lien requests and cyber portal evidence filing. Within 18 days, 85% of my frozen amount was released back!”",
        name: "Rohan Verma",
        role: "B.Tech Graduate",
        company: "Chandigarh Mentee",
        tag: "Fraud Free Bharat",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
      },
      {
        id: 7,
        banner: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=720&q=80",
        quote: "“Transitioning from non-IT to Tech seemed impossible until Surender sir restructured my resume and taught me how to highlight practical problem-solving. Got placed with a 75% salary hike.”",
        name: "Kavita Soni",
        role: "QA Automation Engineer",
        company: "Pune Tech",
        tag: "Career Coaching",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
      },
      {
        id: 8,
        banner: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=720&q=80",
        quote: "“Our startup needed rapid LinkedIn distribution for B2B client acquisition. Surender designed our entire founder-led growth funnel. Result: our demo conversion doubled in 60 days.”",
        name: "Aditya Sen",
        role: "Co-Founder",
        company: "FinEdge Solutions, Hyderabad",
        tag: "Growth Karo Client",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
      },
      {
        id: 9,
        banner: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=720&q=80",
        quote: "“My close friend had invested our college savings into a cryptocurrency MLM chain. Surender sir exposed their shell registration and pyramid math within 1 hour, saving 12 students from bankruptcy.”",
        name: "Sunil Choudhary",
        role: "Agri-Business Founder",
        company: "Jaipur Agro",
        tag: "MLM Scam Defense",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
      },
      {
        id: 10,
        banner: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=720&q=80",
        quote: "“The mock interview session with Surender sir was a game-changer. He pointed out micro-habits in my communication and helped me answer behavioral questions with confidence. Cleared my dream MNC interview!”",
        name: "Priya Nair",
        role: "Associate Product Manager",
        company: "Noida Product Hub",
        tag: "Resume & Interview",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Payoneer_logo.svg"
      },
      {
        id: 11,
        banner: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=720&q=80",
        quote: "“Online APK loan app blackmailers were harassing my family with morphed photos. Surender sir gave me the exact legal shield, complaint format, and mental support to shut them down completely.”",
        name: "Manish Goyal",
        role: "Senior Accountant",
        company: "Indore Finance",
        tag: "Fraud Awareness",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
      },
      {
        id: 12,
        banner: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=720&q=80",
        quote: "“Surender's frameworks for content creation are second to none. He doesn't just teach theory; he analyzes your niche, helps you craft hooks, and builds authority that attracts international clients.”",
        name: "Deepak Rawat",
        role: "Lead Product Designer",
        company: "Remote Global",
        tag: "Personal Branding",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
      },
      {
        id: 13,
        banner: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=720&q=80",
        quote: "“We had zero social proof when launching our agency. Surender’s Growth Karo strategic positioning enabled us to close 3 enterprise retainers within our very first quarter.”",
        name: "Ananya Banerjee",
        role: "Director",
        company: "CreativePulse Media, Kolkata",
        tag: "Growth Karo Client",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
      },
      {
        id: 14,
        banner: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=720&q=80",
        quote: "“Our SME suffered an unauthorized email takeover and spoofed vendor invoice payment. Surender acted within 30 minutes, guiding forensic logs capture and bank freeze. Saved ₹14 Lakh.”",
        name: "Harish Chandra",
        role: "Managing Director",
        company: "Auto Components, Faridabad",
        tag: "Cyber Advisory",
        logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg"
      },
      {
        id: 15,
        banner: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=720&q=80",
        quote: "“As a tier-3 college student, I had no guidance on modern tech roadmaps. Surender sir broke down the exact skills, GitHub proof-of-work, and cold-outreach system that landed me my first high-paying remote job.”",
        name: "Gaurav Mishra",
        role: "Full Stack Developer",
        company: "Lucknow Tech",
        tag: "Career Coaching",
        logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg"
      },
      {
        id: 16,
        banner: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=720&q=80",
        quote: "“Surender's awareness session on fake trading apps and Telegram stock tips opened my eyes. He prevented my retirement fund from being siphoned into a fraudulent Dubai broker portal.”",
        name: "Col. R.K. Joshi (Retd.)",
        role: "Veteran & Community Mentor",
        company: "Dehradun Social",
        tag: "Fraud Free Bharat",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg"
      },
      {
        id: 17,
        banner: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=720&q=80",
        quote: "“Within 6 months of Surender sir's personal branding cohort, I crossed 18,000 followers and got invited as a keynote speaker at two national tech summits. Worth 10x the investment!”",
        name: "Simran Kaur",
        role: "AI Specialist & Speaker",
        company: "Chandigarh AI Hub",
        tag: "Personal Branding",
        logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg"
      },
      {
        id: 18,
        banner: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=720&q=80",
        quote: "“If you want genuine digital scale without inflated vanity metrics, Surender Verma is the mentor you need. Growth Karo helped us build an authentic high-ticket acquisition flywheel.”",
        name: "Arjun Singhania",
        role: "Co-Founder",
        company: "EduTech Horizon, Ahmedabad",
        tag: "Growth Karo Client",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Payoneer_logo.svg"
      },
      {
        id: 19,
        banner: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=720&q=80",
        quote: "“A fraudulent network marketing syndicate was targeting youth in our district with fake wellness products and recruiting chains. Surender spearheaded the evidence dossier that shut down their local hub.”",
        name: "Pawan Deshmukh",
        role: "Social Worker & Activist",
        company: "Nagpur Citizens Forum",
        tag: "MLM Scam Defense",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg"
      },
      {
        id: 20,
        banner: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=720&q=80",
        quote: "“Surender's 1-on-1 mentorship gave me executive presence and strategic thinking. He helped me negotiate my promotion to VP of Engineering with absolute confidence. Truly a life mentor.”",
        name: "Tarun Bhatia",
        role: "VP of Engineering",
        company: "SaaS Global, Gurugram",
        tag: "Career & Leadership",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
      }
    ];

    const totalCards = testimonialsData.length;

    // Helper: Build a slide HTML node from item data
    function createSlideNode(item, originalIdx) {
      const slide = document.createElement('div');
      slide.className = 'testimonial-slide';
      slide.setAttribute('role', 'group');
      slide.setAttribute('aria-roledescription', 'slide');
      slide.setAttribute('data-original-index', originalIdx);

      slide.innerHTML = `
        <div class="testimonial-card-el">
          <div class="t-card-banner">
            <img 
              src="${item.banner}" 
              alt="${item.name}" 
              class="t-card-banner-img" 
              loading="lazy"
              onerror="this.onerror=null; this.src='images/surender.jpg';"
            >
            <span class="t-card-tag">${item.tag}</span>
          </div>
          <div class="t-card-body">
            <p class="t-card-quote">${item.quote}</p>
            <div class="t-card-author-block">
              <h4 class="t-card-name">${item.name}</h4>
              <p class="t-card-role">${item.role} • ${item.company}</p>
              <div class="t-card-logo-wrap">
                <img src="${item.logo}" alt="${item.company}" class="t-card-logo" onerror="this.style.display='none';">
              </div>
            </div>
          </div>
        </div>
      `;
      return slide;
    }

    // Populate track with Clones for Infinite Loop [Clones before] + [Originals] + [Clones after]
    track.innerHTML = '';
    const clonesCount = 3; // 3 clones at start and end for smooth seamless transitions

    // Clone last 3 items to prepend
    for (let i = totalCards - clonesCount; i < totalCards; i++) {
      track.appendChild(createSlideNode(testimonialsData[i], i));
    }

    // Append 20 original items
    testimonialsData.forEach((item, idx) => {
      track.appendChild(createSlideNode(item, idx));
    });

    // Clone first 3 items to append
    for (let i = 0; i < clonesCount; i++) {
      track.appendChild(createSlideNode(testimonialsData[i], i));
    }

    // Populate clickable pagination dots (1 to 20)
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      testimonialsData.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = `carousel-dot${idx === 0 ? ' active' : ''}`;
        dot.type = 'button';
        dot.setAttribute('aria-label', `Go to testimonial slide ${idx + 1}`);
        dot.setAttribute('role', 'tab');
        dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
        dot.addEventListener('click', () => {
          goToOriginalSlide(idx);
          restartAutoPlay();
        });
        dotsContainer.appendChild(dot);
      });
    }

    const allSlideNodes = $$('.testimonial-slide', track);
    const dots = dotsContainer ? $$('.carousel-dot', dotsContainer) : [];

    // Current internal index starts at first original item (index = clonesCount)
    let currentIndex = clonesCount;
    let isTransitioning = false;
    let autoPlayTimer = null;
    const autoPlayInterval = 3500; // 3.5 seconds as requested

    function updateCarouselPosition(animate = true) {
      if (!animate) {
        track.style.transition = 'none';
      } else {
        track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      }

      const activeSlide = allSlideNodes[currentIndex];
      if (activeSlide && viewport) {
        const slideOffset = activeSlide.offsetLeft;
        const slideWidth = activeSlide.offsetWidth;
        const viewportWidth = viewport.offsetWidth;
        // Center the active slide in the viewport
        const targetTranslateX = slideOffset - (viewportWidth / 2) + (slideWidth / 2);
        track.style.transform = `translateX(-${targetTranslateX}px)`;
      }

      // Update active-slide styling (elevated, scale(1.05), translateY(-18px))
      allSlideNodes.forEach((node, idx) => {
        const isActive = idx === currentIndex;
        node.classList.toggle('active-slide', isActive);
        node.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      // Update dots pagination
      const currentOriginalIdx = (currentIndex - clonesCount + totalCards) % totalCards;
      dots.forEach((dot, idx) => {
        const isActive = idx === currentOriginalIdx;
        dot.classList.toggle('active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    // Seamless Infinite Loop Boundary Reset
    track.addEventListener('transitionend', () => {
      isTransitioning = false;
      // If reached end clones -> snap back to corresponding original item without animation
      if (currentIndex >= clonesCount + totalCards) {
        currentIndex = clonesCount;
        updateCarouselPosition(false);
      }
      // If reached start clones -> snap forward to corresponding original item without animation
      else if (currentIndex < clonesCount) {
        currentIndex = clonesCount + totalCards - 1;
        updateCarouselPosition(false);
      }
    });

    function nextSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updateCarouselPosition(true);
    }

    function prevSlide() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updateCarouselPosition(true);
    }

    function goToOriginalSlide(originalIdx) {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex = clonesCount + originalIdx;
      updateCarouselPosition(true);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        restartAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        restartAutoPlay();
      });
    }

    // Allow clicking on neighboring inactive cards to center them
    allSlideNodes.forEach((slide, idx) => {
      slide.addEventListener('click', () => {
        if (idx !== currentIndex) {
          currentIndex = idx;
          updateCarouselPosition(true);
          restartAutoPlay();
        }
      });
    });

    // Touch Swipe Gesture Support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 40) {
        if (swipeDistance < 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    }

    // Keyboard Arrow navigation when focused
    wrap.setAttribute('tabindex', '0');
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
        restartAutoPlay();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
        restartAutoPlay();
      }
    });

    // Auto-slide management: 3.5s interval with mouseenter pause and mouseleave resume
    function startAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
      autoPlayTimer = setInterval(nextSlide, autoPlayInterval);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    function restartAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    wrap.addEventListener('mouseenter', stopAutoPlay);
    wrap.addEventListener('mouseleave', startAutoPlay);

    window.addEventListener('resize', () => {
      updateCarouselPosition(false);
    }, { passive: true });

    // Initial positioning with brief delay to let layout settle
    setTimeout(() => {
      updateCarouselPosition(false);
    }, 60);

    startAutoPlay();
  }

  // Initialize all modules when DOM is ready
  document.addEventListener('DOMContentLoaded', () => {
    setupViewportFit();
    setupTheme();
    hydrateSiteData();
    setupMobileNav();
    setupHeaderScroll();
    setupScrollReveal();
    setupImageFallbacks();
    highlightCurrentPage();
    setupContactForm();
    setupTestimonialCarousel();
  });
})();
