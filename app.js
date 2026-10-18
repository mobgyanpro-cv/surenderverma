"use strict";

/* Static-site behaviour only. No API calls, tracking, or third-party libraries. */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const PAGE = document.body.dataset.p || "";
const SAFE_PARTIALS = new Set(["header.html", "footer.html"]);

function replaceTemplateTokens(root) {
  const values = {
    announce: SITE.announce,
    announceLink: SITE.announceLink,
    cta: SITE.cta,
    tagline: SITE.tagline,
    year: SITE.year
  };
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    node.nodeValue = node.nodeValue.replace(/\{\{([A-Za-z][A-Za-z0-9]*)\}\}/g, (token, key) =>
      Object.hasOwn(values, key) ? String(values[key] ?? "") : token
    );
  }
}

function sanitizePartial(template) {
  // Header/footer are same-origin project files, but discard executable/embed content defensively.
  template.content.querySelectorAll("script, iframe, object, embed, base, meta[http-equiv]").forEach((node) => node.remove());
  template.content.querySelectorAll("*").forEach((element) => {
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim();
      if (name.startsWith("on")) element.removeAttribute(attribute.name);
      if (["href", "src", "action", "formaction", "xlink:href"].includes(name) && /^javascript:/i.test(value)) {
        element.removeAttribute(attribute.name);
      }
    }
  });
  return template;
}

function fallbackNavigation() {
  if ($("#hd")) return;
  const header = document.createElement("header");
  header.className = "fallback-header";
  const wrap = document.createElement("div");
  wrap.className = "w bar";
  const brand = document.createElement("a");
  brand.className = "lg";
  brand.href = "index.html";
  brand.textContent = "Surender.Verma";
  const nav = document.createElement("nav");
  nav.setAttribute("aria-label", "Main navigation");
  for (const [label, href] of [["Home", "index.html"], ["Services", "services.html"], ["Capabilities", "work.html"], ["About", "about.html"], ["Contact", "contact.html"]]) {
    const link = document.createElement("a");
    link.textContent = label;
    link.href = href;
    nav.append(link);
  }
  wrap.append(brand, nav);
  header.append(wrap);
  document.body.prepend(header);
}

async function loadPartial(file, position) {
  if (!SAFE_PARTIALS.has(file)) return;
  try {
    const target = new URL(file, window.location.href);
    if (target.origin !== window.location.origin) throw new Error("Refusing cross-origin partial.");
    const response = await fetch(target.href, {
      method: "GET",
      credentials: "same-origin",
      cache: "no-cache",
      redirect: "error",
      headers: { Accept: "text/html" }
    });
    if (!response.ok || new URL(response.url).origin !== window.location.origin) {
      throw new Error(`Could not load ${file}.`);
    }
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.toLowerCase().includes("text/html")) throw new Error("Unexpected partial content type.");
    const template = document.createElement("template");
    template.innerHTML = await response.text(); // Only a fixed, same-origin project partial is parsed here.
    sanitizePartial(template);
    replaceTemplateTokens(template.content); // Config values are assigned as text, never markup.
    if (position === "afterbegin") document.body.prepend(template.content);
    else document.body.append(template.content);
  } catch (error) {
    console.error("A shared site component could not be loaded.", error);
    if (position === "afterbegin") fallbackNavigation();
  }
}

function safeEmail(value) {
  return typeof value === "string" && value.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value);
}
function safePhone(value) {
  return typeof value === "string" && /^\+?[0-9().\s-]{7,24}$/.test(value) && value.replace(/\D/g, "").length >= 7;
}
function safeWhatsApp(value) {
  return typeof value === "string" && /^\d{8,15}$/.test(value);
}

function setupContactLinks() {
  $$('[data-c]').forEach((link) => {
    const type = link.dataset.c;
    if (type === "email" && safeEmail(SITE.email)) {
      link.href = `mailto:${SITE.email}`;
      link.textContent = SITE.email;
    } else if (type === "phone" && safePhone(SITE.phone)) {
      const dial = SITE.phone.replace(/[^+\d]/g, "");
      link.href = `tel:${dial}`;
      link.textContent = SITE.phoneText || SITE.phone;
    } else if (type === "wa" && safeWhatsApp(SITE.whatsapp)) {
      link.href = `https://wa.me/${SITE.whatsapp}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = SITE.phoneText || "WhatsApp";
    } else if (type === "site") {
      let url;
      try { url = new URL(SITE.website); } catch {}
      if (url && url.protocol === "https:") {
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = url.hostname;
      } else link.hidden = true;
    } else link.hidden = true;
  });
  $$('[data-wa]').forEach((link) => {
    if (!safeWhatsApp(SITE.whatsapp)) { link.hidden = true; return; }
    link.href = `https://wa.me/${SITE.whatsapp}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
}

function setupHeader() {
  const header = $("#hd"), nav = $("#nv"), menuButton = $("#bg");
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
  $$('a', nav).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });

  const closeAnnouncement = $("#annx");
  if (closeAnnouncement) closeAnnouncement.addEventListener("click", () => {
    $("#ann")?.classList.add("x");
    try { sessionStorage.setItem("announcement-closed", "1"); } catch {}
  });
  try { if (sessionStorage.getItem("announcement-closed")) $("#ann")?.classList.add("x"); } catch {}

  let previousY = window.scrollY;
  let scheduled = false;
  window.addEventListener("scroll", () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      const y = window.scrollY;
      header.classList.toggle("sc", y > 20);
      header.classList.toggle("hide", y > previousY && y > 380 && !nav.classList.contains("open"));
      previousY = y;
      scheduled = false;
    });
  }, { passive: true });
}

function setupSearch() {
  const button = $("#srch"), panel = $("#cp"), input = $("#cpi"), list = $("#cpl");
  if (!button || !panel || !input || !list) return;
  const items = [
    ["Home", "index.html"], ["Websites & landing pages", "services.html#websites"],
    ["Digital marketing & lead generation", "services.html#marketing"],
    ["Automation & AI workflows", "services.html#automation"],
    ["Digital safety & fraud awareness", "services.html#security"],
    ["Capabilities", "work.html"], ["About Surender", "about.html"], ["Contact", "contact.html"]
  ];
  let filtered = items.slice(), selected = 0;
  const draw = () => {
    list.replaceChildren();
    if (!filtered.length) {
      const empty = document.createElement("li");
      empty.className = "mut";
      empty.style.padding = "12px";
      empty.textContent = "No matching pages";
      list.append(empty);
      return;
    }
    filtered.forEach(([label, href], index) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      link.href = href; // Destinations are fixed internal paths, never user input.
      link.textContent = label;
      if (index === selected) {
        link.classList.add("sel");
        link.setAttribute("aria-current", "true");
      }
      item.append(link);
      list.append(item);
    });
  };
  const open = () => { panel.hidden = false; input.value = ""; filtered = items.slice(); selected = 0; draw(); input.focus(); };
  const close = () => { panel.hidden = true; button.focus(); };
  button.addEventListener("click", open);
  panel.addEventListener("click", (event) => { if (event.target === panel) close(); });
  list.addEventListener("click", (event) => { if (event.target instanceof HTMLAnchorElement) panel.hidden = true; });
  input.addEventListener("input", () => {
    const query = input.value.trim().slice(0, 100).toLowerCase();
    filtered = items.filter(([label]) => label.toLowerCase().includes(query));
    selected = 0;
    draw();
  });
  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      panel.hidden ? open() : close();
    }
    if (panel.hidden) return;
    if (event.key === "Escape") close();
    if (event.key === "ArrowDown" && filtered.length) { event.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); draw(); }
    if (event.key === "ArrowUp" && filtered.length) { event.preventDefault(); selected = Math.max(selected - 1, 0); draw(); }
    if (event.key === "Enter" && filtered[selected]) window.location.href = filtered[selected][1];
  });
}

function setupMotionAndFilters() {
  const progress = $("#pb");
  const updateProgress = () => {
    if (!progress) return;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, root.scrollTop / max * 100)) : 0}%`;
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); currentObserver.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    $$(".rv").forEach((element, index) => { element.style.transitionDelay = `${(index % 3) * 70}ms`; observer.observe(element); });
  } else $$(".rv").forEach((element) => element.classList.add("in"));

  $$(".fl button").forEach((button) => button.addEventListener("click", () => {
    $$(".fl button").forEach((other) => other.setAttribute("aria-pressed", String(other === button)));
    $$('[data-t]').forEach((card) => { card.hidden = button.dataset.f !== "all" && card.dataset.t !== button.dataset.f; });
  }));

  const canvas = $("#c");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && canvas.getContext && !reducedMotion) {
    const context = canvas.getContext("2d");
    let width = 0, height = 0, points = [], frame = 0, running = false;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width; height = rect.height;
      canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      points = Array.from({ length: Math.min(44, Math.max(0, Math.floor(width / 24))) }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35
      }));
    };
    const draw = () => {
      if (!running || document.hidden) return;
      context.clearRect(0, 0, width, height);
      points.forEach((point, index) => {
        point.x += point.vx; point.y += point.vy;
        if (point.x < 0 || point.x > width) point.vx *= -1;
        if (point.y < 0 || point.y > height) point.vy *= -1;
        context.fillStyle = "#2f5bff";
        context.beginPath(); context.arc(point.x, point.y, 1.5, 0, Math.PI * 2); context.fill();
        for (let next = index + 1; next < points.length; next++) {
          const other = points[next], distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 105) {
            context.strokeStyle = `rgba(47,91,255,${0.11 * (1 - distance / 105)})`;
            context.lineWidth = 1; context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
          }
        }
      });
      frame = window.requestAnimationFrame(draw);
    };
    const start = () => { if (running) return; running = true; draw(); };
    const stop = () => { running = false; if (frame) window.cancelAnimationFrame(frame); };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); else start(); });
    start();
  }

  const rotatingText = $("#rot");
  if (rotatingText && !reducedMotion) {
    const phrases = ["business growth.", "a stronger online presence.", "smarter workflows.", "clearer customer journeys."];
    let index = 0, timer = 0;
    timer = window.setInterval(() => {
      if (document.hidden) return;
      rotatingText.classList.add("out");
      window.setTimeout(() => {
        index = (index + 1) % phrases.length;
        rotatingText.textContent = phrases[index];
        rotatingText.classList.remove("out");
      }, 240);
    }, 3000);
    document.addEventListener("pagehide", () => window.clearInterval(timer), { once: true });
  }
}

async function setupContactForm() {
  const form = $("#form");
  if (!form) return;
  const button = $('button[type="submit"]', form);
  const status = $("#ok");
  const prepared = $("#prepared");
  let submitting = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitting) return;
    if (!form.reportValidity()) return;

    const formData = new FormData(form);
    const name = String(formData.get("n") || "").trim().slice(0, 100);
    const email = String(formData.get("e") || "").trim().slice(0, 254);
    const type = String(formData.get("t") || "").trim().slice(0, 100);
    const details = String(formData.get("m") || "").trim().slice(0, 3000);
    if (!name || !safeEmail(email) || !type || !details) {
      if (status) status.textContent = "Please check each field and enter a valid email address.";
      return;
    }

    const message = [
      `Project enquiry from ${name}`,
      "",
      `Name: ${name}`,
      `Email: ${email}`,
      `Project type: ${type}`,
      "",
      "Project details:",
      details
    ].join("\n");

    submitting = true;
    if (button) button.disabled = true;
    if (status) status.textContent = "Preparing your message locally… No data is being sent to a server.";
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(message);
        if (status) status.textContent = "Message copied to your clipboard. Nothing has been sent; paste it into your preferred email or messaging app.";
        if (prepared) { prepared.hidden = true; prepared.value = ""; }
      } else {
        throw new Error("Clipboard access unavailable.");
      }
    } catch {
      if (prepared) {
        prepared.hidden = false;
        prepared.value = message;
        prepared.focus();
        prepared.select();
        if (status) status.textContent = "Automatic copy was unavailable. The prepared message is shown below; copy it manually. Nothing has been sent.";
      } else if (status) {
        status.textContent = "Clipboard access is unavailable. Nothing has been sent; please try a secure browser context.";
      }
    } finally {
      submitting = false;
      if (button) button.disabled = false;
    }
  });
}

(async function init() {
  const progress = document.createElement("div");
  progress.id = "pb";
  progress.setAttribute("aria-hidden", "true");
  document.body.prepend(progress);
  await Promise.all([loadPartial("header.html", "afterbegin"), loadPartial("footer.html", "beforeend")]);
  $$('nav [data-p]').forEach((link) => link.classList.toggle("on", link.dataset.p === PAGE));
  setupContactLinks();
  setupHeader();
  setupSearch();
  setupMotionAndFilters();
  await setupContactForm();
})();
