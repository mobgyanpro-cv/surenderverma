/* ==========================================================================
   Surender Verma — Modern Interactive Engine (app.js)
   Fast, accessible, progressive enhancement, zero external dependencies
   ========================================================================== */

(function () {
  'use strict';

  // Helper query utilities
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const PAGE = document.body.dataset.p || '';

  // Theme Management (Supports system preference + localStorage)
  function setupTheme() {
    const root = document.documentElement;
    const themeBtn = $('#th');
    
    // Check saved or preferred theme
    let currentTheme = 'dark'; // default modern tech dark aesthetic
    try {
      const saved = localStorage.getItem('sv-theme');
      if (saved === 'light' || saved === 'dark') {
        currentTheme = saved;
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        currentTheme = 'light';
      }
    } catch (e) {}

    root.dataset.theme = currentTheme;
    updateThemeIcon(currentTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = root.dataset.theme === 'light' ? 'dark' : 'light';
        root.dataset.theme = nextTheme;
        updateThemeIcon(nextTheme);
        try {
          localStorage.setItem('sv-theme', nextTheme);
        } catch (e) {}
      });
    }

    function updateThemeIcon(theme) {
      if (!themeBtn) return;
      themeBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
      themeBtn.setAttribute('title', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
      themeBtn.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
    }
  }

  // Fallback dynamic partial loader (only used if header/footer not already embedded)
  async function loadPartial(file, position) {
    try {
      const response = await fetch(file);
      if (!response.ok) throw new Error(`Could not load ${file}`);
      let markup = await response.text();
      markup = markup.replace(/\{\{(\w+)\}\}/g, (match, key) => (typeof SITE !== 'undefined' && SITE[key]) ? SITE[key] : '');
      document.body.insertAdjacentHTML(position, markup);
    } catch (err) {
      console.warn(`Partial ${file} could not be loaded via fetch. If opening locally, embedded HTML is used.`, err);
    }
  }

  // Populate dynamic contact and brand details from config.js
  function hydrateSiteData() {
    if (typeof SITE === 'undefined') return;

    // Replace inline {{key}} template strings if any remain in DOM
    const bodyHtml = document.body.innerHTML;
    if (bodyHtml.includes('{{')) {
      document.body.innerHTML = bodyHtml.replace(/\{\{(\w+)\}\}/g, (m, key) => SITE[key] ?? '');
    }

    const whatsappUrl = SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : '#';

    // WhatsApp buttons & links
    $$('[data-wa]').forEach(link => {
      if (SITE.whatsapp) {
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      } else {
        link.style.display = 'none';
      }
    });

    // Specific contact bindings
    $$('[data-c]').forEach(link => {
      const type = link.dataset.c;
      if (type === 'email' && SITE.email) {
        link.href = `mailto:${SITE.email}`;
        link.textContent = SITE.email;
      } else if (type === 'phone' && SITE.phone) {
        link.href = `tel:${SITE.phone}`;
        link.textContent = `Call ${SITE.phoneText || SITE.phone}`;
      } else if (type === 'wa' && SITE.whatsapp) {
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = `WhatsApp ${SITE.phoneText || SITE.whatsapp}`;
      } else if (type === 'site' && SITE.website) {
        link.href = SITE.website;
        link.textContent = SITE.website.replace(/^https?:\/\//, '');
      }
    });

    // Mark current active navigation link
    $$('nav a[data-p]').forEach(link => {
      link.classList.toggle('on', link.dataset.p === PAGE);
    });
  }

  // Setup Header Scroll, Mobile Menu & Announcement
  function setupHeader() {
    const header = $('#hd');
    const nav = $('#nv');
    const menuBtn = $('#bg');
    if (!header) return;

    // Mobile menu toggle
    if (menuBtn && nav) {
      const closeMenu = () => {
        nav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.textContent = '☰';
        document.body.style.overflow = '';
      };

      menuBtn.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(isOpen));
        menuBtn.textContent = isOpen ? '✕' : '☰';
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
    }

    // Announcement dismiss
    const ann = $('#ann');
    const annClose = $('#annx');
    if (ann && annClose) {
      annClose.addEventListener('click', () => {
        ann.classList.add('x');
        try { sessionStorage.setItem('sv-ann-closed', '1'); } catch (e) {}
      });
      try {
        if (sessionStorage.getItem('sv-ann-closed')) ann.classList.add('x');
      } catch (e) {}
    }

    // Smart scroll hide/show
    let prevY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      header.classList.toggle('sc', y > 20);
      if (y > prevY && y > 350 && (!nav || !nav.classList.contains('open'))) {
        header.classList.add('hide');
      } else {
        header.classList.remove('hide');
      }
      prevY = y;
    }, { passive: true });
  }

  // Command Palette Search (Ctrl + K)
  function setupCommandPalette() {
    const searchBtn = $('#srch');
    const modal = $('#cp');
    const input = $('#cpi');
    const list = $('#cpl');
    if (!modal || !input || !list) return;

    const wa = typeof SITE !== 'undefined' && SITE.whatsapp ? `https://wa.me/${SITE.whatsapp}` : '#';
    const email = typeof SITE !== 'undefined' && SITE.email ? `mailto:${SITE.email}` : '#';
    const tel = typeof SITE !== 'undefined' && SITE.phone ? `tel:${SITE.phone}` : '#';

    const searchCatalog = [
      { title: 'Home', desc: 'Main landing page and overview', url: 'index.html', icon: '🏠' },
      { title: 'Websites & Landing Pages', desc: 'WordPress, custom design & high-converting layouts', url: 'services.html#websites', icon: '🌐' },
      { title: 'Digital Marketing & Lead Gen', desc: 'SEO, campaigns and client funnels', url: 'services.html#marketing', icon: '📈' },
      { title: 'Automation & AI Workflows', desc: 'n8n, APIs, spreadsheets and bots', url: 'services.html#automation', icon: '⚙️' },
      { title: 'Digital Safety & Fraud Awareness', desc: 'Checklists, cyber literacy & safe practices', url: 'services.html#security', icon: '🛡️' },
      { title: 'Capabilities & Showcase', desc: 'Detailed view of services and practical execution', url: 'work.html', icon: '💼' },
      { title: 'About Surender Verma', desc: 'Background, skills proficiency & journey', url: 'about.html', icon: '👤' },
      { title: 'Contact & Inquiry Form', desc: 'Get in touch for projects or consulting', url: 'contact.html', icon: '✉️' },
      { title: 'Chat on WhatsApp', desc: 'Instant chat at +91 95959 58383', url: wa, icon: '💬', external: true },
      { title: 'Send Direct Email', desc: 'Email contact@surenderverma.com', url: email, icon: '📧', external: true },
      { title: 'Call on Phone', desc: 'Call +91 95959 58383', url: tel, icon: '📞', external: true }
    ];

    let currentItems = searchCatalog;
    let selectedIdx = 0;

    const renderList = () => {
      if (currentItems.length === 0) {
        list.innerHTML = '<li style="padding:14px 18px; color:var(--ink-muted); text-align:center;">No matching pages or actions found</li>';
        return;
      }
      list.innerHTML = currentItems.map((item, i) => `
        <li>
          <a href="${item.url}" class="${i === selectedIdx ? 'sel' : ''}" ${item.external ? 'target="_blank" rel="noopener"' : ''}>
            <span style="margin-right:8px">${item.icon}</span>
            <strong>${item.title}</strong>
            <small style="display:block; font-size:0.75rem; color:var(--ink-secondary); margin-top:2px">${item.desc}</small>
          </a>
        </li>
      `).join('');
    };

    const openModal = () => {
      modal.hidden = false;
      input.value = '';
      currentItems = searchCatalog;
      selectedIdx = 0;
      renderList();
      input.focus();
    };

    const closeModal = () => {
      modal.hidden = true;
      if (searchBtn) searchBtn.focus();
    };

    if (searchBtn) searchBtn.addEventListener('click', openModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    list.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) closeModal();
    });

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      currentItems = searchCatalog.filter(it =>
        it.title.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)
      );
      selectedIdx = 0;
      renderList();
    });

    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        modal.hidden ? openModal() : closeModal();
      }
      if (modal.hidden) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIdx = Math.min(selectedIdx + 1, currentItems.length - 1);
        renderList();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIdx = Math.max(selectedIdx - 1, 0);
        renderList();
      } else if (e.key === 'Enter' && currentItems[selectedIdx]) {
        e.preventDefault();
        const target = currentItems[selectedIdx];
        if (target.external) window.open(target.url, '_blank');
        else window.location.href = target.url;
        closeModal();
      }
    });
  }

  // Interactive 3D Canvas Background (3D Polyhedral Core & Depth Starfield)
  function setupCanvas() {
    const canvas = $('#c');
    if (!canvas || !canvas.getContext || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, animationId;
    let mouse = { x: -1000, y: -1000 };
    let currMouseX = 0, currMouseY = 0;

    // 3D Icosahedron Base Vertices (Golden Ratio)
    const phi = (1 + Math.sqrt(5)) / 2;
    const baseVertices = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];

    // Normalize vertices
    const vLen = Math.hypot(1, phi);
    const icoRadius = 145;
    const vertices = baseVertices.map(v => [
      (v[0] / vLen) * icoRadius,
      (v[1] / vLen) * icoRadius,
      (v[2] / vLen) * icoRadius
    ]);

    // Icosahedron Edges (connecting pairs of vertices)
    const edges = [];
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const d = Math.hypot(
          vertices[i][0] - vertices[j][0],
          vertices[i][1] - vertices[j][1],
          vertices[i][2] - vertices[j][2]
        );
        // Golden ratio distance between adjacent vertices
        if (Math.abs(d - (2 * icoRadius / vLen)) < 15) {
          edges.push([i, j]);
        }
      }
    }

    // 3D Floating Particles Field
    let particles3D = [];
    const initParticles = () => {
      const count = Math.min(65, Math.floor(width / 20));
      particles3D = Array.from({ length: count }, () => {
        const r = 80 + Math.random() * (Math.min(width, height) * 0.45);
        const theta = Math.random() * Math.PI * 2;
        const phiAngle = (Math.random() - 0.5) * Math.PI;
        return {
          x: r * Math.cos(theta) * Math.cos(phiAngle),
          y: r * Math.sin(phiAngle),
          z: r * Math.sin(theta) * Math.cos(phiAngle),
          speed: (Math.random() * 0.008 + 0.004) * (Math.random() < 0.5 ? 1 : -1),
          radius: Math.random() * 1.8 + 1,
          orbitR: r,
          theta: theta,
          phi: phiAngle
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    if (canvas.parentElement) {
      canvas.parentElement.addEventListener('pointermove', (e) => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
      });
      canvas.parentElement.addEventListener('pointerleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
      });
    }

    let rotX = 0.2, rotY = 0.3, rotZ = 0;
    const cameraZ = 450;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isLight = document.documentElement.dataset.theme === 'light';
      const centerX = width * 0.72; // Position 3D core subtly behind the hero card
      const centerY = height * 0.5;

      // Auto rotation
      rotX += 0.0025;
      rotY += 0.0035;

      // Mouse interactive tilt with lerp
      if (mouse.x > 0) {
        const targetMX = (mouse.y / height - 0.5) * 0.75;
        const targetMY = (mouse.x / width - 0.5) * 0.75;
        currMouseX += (targetMX - currMouseX) * 0.04;
        currMouseY += (targetMY - currMouseY) * 0.04;
      } else {
        currMouseX += (0 - currMouseX) * 0.02;
        currMouseY += (0 - currMouseY) * 0.02;
      }

      const totalRotX = rotX + currMouseX;
      const totalRotY = rotY + currMouseY;

      // Precalculate trig
      const cosX = Math.cos(totalRotX), sinX = Math.sin(totalRotX);
      const cosY = Math.cos(totalRotY), sinY = Math.sin(totalRotY);

      // 3D Point Rotation & Projection Helper
      const project3D = (x, y, z) => {
        // Rotate Y
        let x1 = x * cosY - z * sinY;
        let z1 = z * cosY + x * sinY;
        // Rotate X
        let y2 = y * cosX - z1 * sinX;
        let z2 = z1 * cosX + y * sinX;

        const scale = cameraZ / (cameraZ + z2);
        return {
          x: x1 * scale + centerX,
          y: y2 * scale + centerY,
          z: z2,
          scale: scale
        };
      };

      // Project vertices of 3D icosahedron
      const projectedVerts = vertices.map(v => project3D(v[0], v[1], v[2]));

      // Draw 3D Edges with depth cueing
      edges.forEach(([i, j]) => {
        const p1 = projectedVerts[i];
        const p2 = projectedVerts[j];
        const avgZ = (p1.z + p2.z) / 2;
        const depthAlpha = Math.max(0.08, Math.min(0.55, 0.32 + avgZ / 500));

        ctx.strokeStyle = isLight
          ? `rgba(37, 99, 235, ${depthAlpha * 0.85})`
          : `rgba(96, 165, 250, ${depthAlpha})`;
        ctx.lineWidth = Math.max(0.8, (p1.scale + p2.scale) * 0.75);

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw 3D Glowing Vertices
      projectedVerts.forEach(p => {
        const depthAlpha = Math.max(0.2, Math.min(0.9, 0.5 + p.z / 400));
        ctx.fillStyle = isLight
          ? `rgba(37, 99, 235, ${depthAlpha})`
          : `rgba(52, 211, 153, ${depthAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render 3D Orbiting Particles Field
      particles3D.forEach(pt => {
        pt.theta += pt.speed;
        const px = pt.orbitR * Math.cos(pt.theta) * Math.cos(pt.phi);
        const py = pt.orbitR * Math.sin(pt.phi);
        const pz = pt.orbitR * Math.sin(pt.theta) * Math.cos(pt.phi);

        const proj = project3D(px, py, pz);
        const alpha = Math.max(0.12, Math.min(0.75, 0.45 + proj.z / 500));

        ctx.fillStyle = isLight
          ? `rgba(37, 99, 235, ${alpha})`
          : `rgba(147, 197, 253, ${alpha})`;

        ctx.beginPath();
        ctx.arc(proj.x, proj.y, Math.max(0.8, pt.radius * proj.scale), 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = window.requestAnimationFrame(render);
    };

    render();

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) window.cancelAnimationFrame(animationId);
      else render();
    });
  }

  // 3D Holographic Card Interactive Physics (Spring Tilt & Dynamic Specular Sheen)
  function setupHero3DTilt() {
    const scene = $('.hero-3d-scene');
    const card = $('.hero-3d-card');
    if (!scene || !card) return;

    let bounds = scene.getBoundingClientRect();
    let targetRx = 0, targetRy = 0;
    let currRx = 0, currRy = 0;
    let isHovered = false;

    window.addEventListener('resize', () => {
      bounds = scene.getBoundingClientRect();
    }, { passive: true });

    scene.addEventListener('pointerenter', () => {
      isHovered = true;
      bounds = scene.getBoundingClientRect();
    });

    scene.addEventListener('pointermove', (e) => {
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      const px = (x / bounds.width - 0.5) * 2; // -1 to 1
      const py = (y / bounds.height - 0.5) * 2; // -1 to 1

      targetRy = px * 14;  // max 14deg Y rotation
      targetRx = -py * 14; // max 14deg X rotation

      // Set specular light sheen coordinates
      card.style.setProperty('--mx', `${(x / bounds.width) * 100}%`);
      card.style.setProperty('--my', `${(y / bounds.height) * 100}%`);
    });

    scene.addEventListener('pointerleave', () => {
      isHovered = false;
      targetRx = 0;
      targetRy = 0;
      card.style.setProperty('--mx', `50%`);
      card.style.setProperty('--my', `50%`);
    });

    // 60fps spring lerp loop
    const updateTilt = () => {
      currRx += (targetRx - currRx) * 0.12;
      currRy += (targetRy - currRy) * 0.12;

      card.style.setProperty('--rx', `${currRx.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${currRy.toFixed(2)}deg`);

      requestAnimationFrame(updateTilt);
    };

    updateTilt();
  }

  // Rotating Hero Text Headline
  function setupRotatingText() {
    const rot = $('#rot');
    if (!rot) return;

    const phrases = [
      'measurable business growth.',
      'faster, high-converting websites.',
      'automated lead workflows.',
      'practical digital systems.'
    ];
    let idx = 0;

    window.setInterval(() => {
      rot.classList.add('out');
      window.setTimeout(() => {
        idx = (idx + 1) % phrases.length;
        rot.textContent = phrases[idx];
        rot.classList.remove('out');
      }, 260);
    }, 3200);
  }

  // Work / Capabilities Category Filter
  function setupFilters() {
    const filterButtons = $$('.fl button');
    if (!filterButtons.length) return;

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
        const filter = btn.dataset.f;

        $$('[data-t]').forEach(card => {
          if (filter === 'all' || card.dataset.t === filter) {
            card.style.display = '';
            card.classList.add('in');
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Scroll Progress Bar & Back-to-Top Button
  function setupScrollProgress() {
    const pb = $('#pb');
    const btt = $('#btt');

    const updateScroll = () => {
      const root = document.documentElement;
      const max = root.scrollHeight - root.clientHeight;
      const progress = max > 0 ? (root.scrollTop / max) * 100 : 0;
      if (pb) pb.style.width = `${progress}%`;
      if (btt) btt.classList.toggle('show', root.scrollTop > 380);
    };

    window.addEventListener('scroll', updateScroll, { passive: true });
    updateScroll();

    if (btt) {
      btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // Scroll Reveal Animations
  function setupScrollReveal() {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });

      $$('.rv').forEach((el, index) => {
        el.style.transitionDelay = `${(index % 4) * 60}ms`;
        observer.observe(el);
      });
    } else {
      $$('.rv').forEach(el => el.classList.add('in'));
    }
  }

  // Contact Form Handling
  function setupContactForm() {
    const form = $('#form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const name = fd.get('n') || '';
      const email = fd.get('e') || '';
      const phone = fd.get('p') || '';
      const type = fd.get('t') || '';
      const msg = fd.get('m') || '';

      const subject = `Website Project Enquiry: ${type} - ${name}`;
      const body = [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone / WhatsApp: ${phone || 'Not provided'}`,
        `Project Type: ${type}`,
        '',
        'Project Requirements / Details:',
        msg,
        '',
        '---',
        'Sent via Surender Verma Website Contact Form'
      ].join('\n');

      const status = $('#ok');
      const targetEmail = (typeof SITE !== 'undefined' && SITE.email) ? SITE.email : 'contact@surenderverma.com';
      const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (status) {
        status.innerHTML = `<span style="color:var(--accent); font-weight:700;">✓ Opening your email client to send message...</span>`;
      }

      // Also copy to clipboard as convenience fallback
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`${subject}\n\n${body}`).catch(() => {});
      }

      window.location.href = mailtoUrl;
    });
  }

  // Initialize all modules
  async function init() {
    setupTheme();

    // If header is not in markup (e.g., dynamically inserted), load partials
    if (!$('#hd')) {
      await Promise.all([
        loadPartial('header.html', 'afterbegin'),
        loadPartial('footer.html', 'beforeend')
      ]);
    }

    hydrateSiteData();
    setupHeader();
    setupCommandPalette();
    setupCanvas();
    setupHero3DTilt();
    setupRotatingText();
    setupFilters();
    setupScrollProgress();
    setupScrollReveal();
    setupContactForm();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
