/* Shared site behaviour: header/footer partials, navigation, theme, search and contact form. */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const PAGE = document.body.dataset.p;

async function loadPartial(file, position) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Could not load ${file}`);
    const markup = await response.text();
    document.body.insertAdjacentHTML(position, markup.replace(/\{\{(\w+)\}\}/g, (match, key) => SITE[key] ?? ""));
  } catch (error) {
    console.error(error);
    const fallback = position === "afterbegin"
      ? '<header class="fallback-header"><div class="w"><a class="lg" href="index.html">Surender<b>.</b>Verma</a><nav><a href="index.html">Home</a><a href="services.html">Services</a><a href="about.html">About</a><a href="contact.html">Contact</a></nav></div></header>'
      : '<footer><div class="w"><p>© Surender Verma</p></div></footer>';
    document.body.insertAdjacentHTML(position, fallback);
  }
}

function setupContactLinks() {
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}`;
  $$("[data-wa]").forEach((link) => {
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  $$("[data-c]").forEach((link) => {
    const type = link.dataset.c;
    if (type === "email") {
      link.href = `mailto:${SITE.email}`;
      if (link.closest(".contact-links")) {
        const bold = $("b", link);
        if (bold) bold.textContent = SITE.email;
      } else if (!link.textContent.trim() || link.textContent.includes("Loading")) {
        link.textContent = SITE.email;
      }
    }
    if (type === "phone") {
      link.href = `tel:${SITE.phone}`;
      link.textContent = `Call ${SITE.phoneText}`;
    }
    if (type === "wa") {
      link.href = whatsappUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      if (link.closest(".contact-links")) {
        const bold = $("b", link);
        if (bold) bold.textContent = SITE.phoneText;
      } else link.textContent = `WhatsApp ${SITE.phoneText}`;
    }
    if (type === "site") {
      link.href = SITE.website;
      if (link.closest(".contact-links")) {
        const bold = $("b", link);
        if (bold) bold.textContent = SITE.website.replace(/^https?:\/\//, "");
      } else link.textContent = SITE.website.replace(/^https?:\/\//, "");
    }
  });
}

function setupHeader() {
  const header = $("#hd");
  const nav = $("#nv");
  const menuButton = $("#bg");
  if (!header || !nav || !menuButton) return;

  const closeMenu = () => {
    nav.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
    document.body.style.overflow = "";
  };
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.textContent = isOpen ? "×" : "☰";
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
  $$("a", nav).forEach((link) => link.addEventListener("click", closeMenu));

  const closeAnnouncement = $("#annx");
  if (closeAnnouncement) closeAnnouncement.addEventListener("click", () => {
    $("#ann")?.classList.add("x");
    try { sessionStorage.setItem("announcement-closed", "1"); } catch {}
  });
  try {
    if (sessionStorage.getItem("announcement-closed")) $("#ann")?.classList.add("x");
  } catch {}

  let previousY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    header.classList.toggle("sc", y > 20);
    header.classList.toggle("hide", y > previousY && y > 380 && !nav.classList.contains("open"));
    previousY = y;
  }, { passive: true });

  const root = document.documentElement;
  try {
    const savedTheme = localStorage.getItem("sv-theme");
    if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;
  } catch {}
  $("#th")?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = nextTheme;
    try { localStorage.setItem("sv-theme", nextTheme); } catch {}
  });
}

function setupSearch() {
  const searchButton = $("#srch"), panel = $("#cp"), input = $("#cpi"), list = $("#cpl");
  if (!searchButton || !panel || !input || !list) return;
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}`;
  const items = [
    ["Home", "index.html"], ["Websites & landing pages", "services.html#websites"],
    ["Digital marketing & lead generation", "services.html#marketing"],
    ["Automation & AI workflows", "services.html#automation"],
    ["Digital safety & fraud awareness", "services.html#security"],
    ["Capabilities", "work.html"], ["About Surender", "about.html"],
    ["Contact", "contact.html"], ["WhatsApp", whatsappUrl], ["Email", `mailto:${SITE.email}`]
  ];
  let filtered = items, selected = 0;
  const draw = () => {
    list.innerHTML = filtered.map((item, index) =>
      `<li><a href="${item[1]}" class="${index === selected ? "sel" : ""}">${item[0]}</a></li>`
    ).join("") || '<li class="mut" style="padding:12px">No matching pages</li>';
  };
  const open = () => { panel.hidden = false; input.value = ""; filtered = items; selected = 0; draw(); input.focus(); };
  const close = () => { panel.hidden = true; searchButton.focus(); };
  searchButton.addEventListener("click", open);
  panel.addEventListener("click", (event) => { if (event.target === panel) close(); });
  list.addEventListener("click", () => { panel.hidden = true; });
  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();
    filtered = items.filter((item) => item[0].toLowerCase().includes(query));
    selected = 0; draw();
  });
  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault(); panel.hidden ? open() : close();
    }
    if (panel.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowDown") { event.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); draw(); }
    if (event.key === "ArrowUp") { event.preventDefault(); selected = Math.max(selected - 1, 0); draw(); }
    if (event.key === "Enter" && filtered[selected]) window.location.href = filtered[selected][1];
  });
}

function setupMotionAndFilters() {
  const progress = $("#pb");
  const updateProgress = () => {
    if (!progress) return;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    progress.style.width = `${max > 0 ? root.scrollTop / max * 100 : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    $$(".rv").forEach((element, index) => {
      element.style.transitionDelay = `${(index % 3) * 70}ms`;
      revealObserver.observe(element);
    });
  } else $$(".rv").forEach((element) => element.classList.add("in"));

  $$(".fl button").forEach((button) => button.addEventListener("click", () => {
    $$(".fl button").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    $$("[data-t]").forEach((card) => {
      card.hidden = button.dataset.f !== "all" && card.dataset.t !== button.dataset.f;
    });
  }));

  const canvas = $("#c");
  if (canvas && canvas.getContext && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const context = canvas.getContext("2d");
    let width = 0, height = 0, points = [];
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from({ length: Math.min(44, Math.floor(width / 24)) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35
      }));
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    let frame;
    const draw = () => {
      context.clearRect(0, 0, width, height);
      points.forEach((point, index) => {
        point.x += point.vx; point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
        context.fillStyle = "#66e3b4";
        context.beginPath(); context.arc(point.x, point.y, 1.5, 0, Math.PI * 2); context.fill();
        for (let next = index + 1; next < points.length; next++) {
          const other = points[next], distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 105) {
            context.strokeStyle = `rgba(102,227,180,${.13 * (1 - distance / 105)})`;
            context.lineWidth = 1; context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
          }
        }
      });
      frame = window.requestAnimationFrame(draw);
    };
    draw();
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) window.cancelAnimationFrame(frame);
      else draw();
    });
  }

  const rotatingText = $("#rot");
  if (rotatingText) {
    const phrases = ["business growth.", "a stronger online presence.", "smarter workflows.", "clearer customer journeys."];
    let index = 0;
    window.setInterval(() => {
      rotatingText.classList.add("out");
      window.setTimeout(() => {
        index = (index + 1) % phrases.length;
        rotatingText.textContent = phrases[index];
        rotatingText.classList.remove("out");
      }, 240);
    }, 3000);
  }
}

function setupContactForm() {
  const form = $("#form");
  if (!form) return;
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const subject = `Project enquiry from ${data.get("n")}`;
    const body = [
      `Name: ${data.get("n")}`,
      `Email: ${data.get("e")}`,
      `Project type: ${data.get("t")}`,
      "",
      "Project details:",
      data.get("m")
    ].join("\n");
    const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    const status = $("#ok");
    if (status) status.textContent = "Opening your email application with the enquiry prepared…";
    window.location.href = mailto;
  });
}

(async function init() {
  document.body.insertAdjacentHTML("afterbegin", '<div id="pb" aria-hidden="true"></div>');
  await Promise.all([loadPartial("header.html", "afterbegin"), loadPartial("footer.html", "beforeend")]);
  $$("nav [data-p]").forEach((link) => link.classList.toggle("on", link.dataset.p === PAGE));
  setupContactLinks();
  setupHeader();
  setupSearch();
  setupMotionAndFilters();
  setupContactForm();
})();
