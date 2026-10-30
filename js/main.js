/* ==========================================================================
   Lüdi Motos AG – Interaktionen
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Öffnungszeiten (0 = Sonntag) ---------- */
  const HOURS = {
    0: [],
    1: [],
    2: [["08:00", "12:00"], ["13:00", "18:15"]],
    3: [["08:00", "12:00"], ["13:00", "18:15"]],
    4: [["08:00", "12:00"], ["13:00", "18:15"]],
    5: [["08:00", "12:00"], ["13:00", "18:15"]],
    6: [["09:00", "15:00"]],
  };
  const DAY_NAMES = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

  function openStatus(now = new Date()) {
    const day = now.getDay();
    const mins = now.getHours() * 60 + now.getMinutes();
    for (const [from, to] of HOURS[day]) {
      if (mins >= toMin(from) && mins < toMin(to)) return { open: true, text: `Jetzt geöffnet · bis ${to} Uhr` };
    }
    // nächste Öffnung suchen
    for (let i = 0; i < 8; i++) {
      const d = (day + i) % 7;
      for (const [from] of HOURS[d]) {
        if (i === 0 && toMin(from) <= mins) continue;
        const when = i === 0 ? "heute" : i === 1 ? "morgen" : DAY_NAMES[d];
        return { open: false, text: `Geschlossen · öffnet ${when} ${from} Uhr` };
      }
    }
    return { open: false, text: "Geschlossen" };
  }

  function initStatus() {
    const s = openStatus();
    $$("[data-open-status]").forEach((el) => {
      el.classList.add(s.open ? "is-open" : "is-closed");
      const label = $(".status-text", el);
      if (label) label.textContent = s.text;
    });
    const today = new Date().getDay();
    $$(`.hours li[data-day~="${today}"]`).forEach((li) => li.classList.add("is-today"));
  }

  /* ---------- Header / Navigation ---------- */
  function initHeader() {
    const header = $(".site-header");
    const toTop = $(".to-top");
    const onScroll = () => {
      const y = window.scrollY;
      header && header.classList.toggle("is-scrolled", y > 10);
      toTop && toTop.classList.toggle("is-visible", y > 600);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    toTop && toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    const toggle = $(".nav-toggle");
    toggle && toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$(".nav a").forEach((a) => a.addEventListener("click", () => document.body.classList.remove("nav-open")));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") document.body.classList.remove("nav-open"); });
  }

  /* ---------- Scroll-Reveal & Zähler ---------- */
  function initReveal() {
    const els = $$(".reveal");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      els.forEach((el) => el.classList.add("is-in"));
      $$("[data-count]").forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || "")));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach((el) => io.observe(el));

    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = Number(el.dataset.count);
        const suffix = el.dataset.suffix || "";
        const start = performance.now();
        const dur = 1600;
        const tick = (t) => {
          const p = Math.min((t - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased).toLocaleString("de-CH") + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    $$("[data-count]").forEach((el) => cio.observe(el));
  }

  /* ---------- Fahrzeug-Filter ---------- */
  function initFilter() {
    $$("[data-filter-group]").forEach((group) => {
      const target = $(group.dataset.filterGroup);
      if (!target) return;
      group.addEventListener("click", (e) => {
        const btn = e.target.closest("button[data-filter]");
        if (!btn) return;
        $$("button", group).forEach((b) => b.classList.toggle("is-active", b === btn));
        const f = btn.dataset.filter;
        $$("[data-cat]", target).forEach((item) => {
          const show = f === "all" || item.dataset.cat.split(" ").includes(f);
          item.classList.toggle("is-hidden", !show);
        });
      });
    });
  }

  /* ---------- Countdown ---------- */
  function initCountdown() {
    $$("[data-countdown]").forEach((el) => {
      const start = el.dataset.countdownStart ? new Date(el.dataset.countdownStart + "T00:00:00") : null;
      const label = el.parentElement.querySelector("[data-countdown-label]");
      const beforeStart = start && new Date() < start;
      const end = beforeStart ? start : new Date(el.dataset.countdown + "T00:00:00");
      if (label && beforeStart) label.textContent = "bis zum Start der Aktion am " + start.toLocaleDateString("de-CH", { day: "numeric", month: "long", year: "numeric" });
      const parts = { d: $("[data-d]", el), h: $("[data-h]", el), m: $("[data-m]", el), s: $("[data-s]", el) };
      const update = () => {
        let diff = Math.max(0, end - new Date());
        const d = Math.floor(diff / 864e5); diff -= d * 864e5;
        const h = Math.floor(diff / 36e5); diff -= h * 36e5;
        const m = Math.floor(diff / 6e4); diff -= m * 6e4;
        const s = Math.floor(diff / 1e3);
        parts.d.textContent = d;
        parts.h.textContent = String(h).padStart(2, "0");
        parts.m.textContent = String(m).padStart(2, "0");
        parts.s.textContent = String(s).padStart(2, "0");
      };
      update();
      setInterval(update, 1000);
    });
  }

  /* ---------- Schneefall ---------- */
  function initSnow() {
    if (reduceMotion) return;
    $$(".snow").forEach((box) => {
      const n = Number(box.dataset.flakes || 40);
      for (let i = 0; i < n; i++) {
        const f = document.createElement("i");
        const size = 2 + Math.random() * 5;
        f.style.left = Math.random() * 100 + "%";
        f.style.width = f.style.height = size + "px";
        f.style.opacity = (0.3 + Math.random() * 0.6).toFixed(2);
        f.style.animationDuration = 8 + Math.random() * 12 + "s";
        f.style.animationDelay = -Math.random() * 20 + "s";
        f.style.setProperty("--drift", (Math.random() * 80 - 40).toFixed(0) + "px");
        box.appendChild(f);
      }
    });
  }

  /* ---------- Karte (lädt erst nach Klick, datenschutzfreundlich) ---------- */
  function initMap() {
    $$("[data-map-load]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const map = btn.closest(".map");
        const iframe = document.createElement("iframe");
        iframe.src = map.dataset.src;
        iframe.loading = "lazy";
        iframe.title = "Standort Lüdi Motos AG";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        map.appendChild(iframe);
        $(".map__consent", map).remove();
      });
    });
  }

  /* ---------- Inserate von motorradhandel.ch ---------- */
  // Kategorie-Nummern (data-fzl) der Inserate bei motorradhandel.ch, Händler 706
  const FZL = { neu: "313", occasionen: "312", miete: "600" };

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  function initWidget() {
    const box = $("[data-mh-widget]");
    if (!box) return;
    const key = new URLSearchParams(location.search).get("angebot");
    const type = FZL[key] ? key : "neu";
    $$("[data-angebot]").forEach((a) => {
      a.classList.toggle("is-active", a.dataset.angebot === type);
      if (a.dataset.angebot === type) a.setAttribute("aria-current", "page");
    });
    $(".wrapperJSON", box).dataset.fzl = FZL[type];
    const fallback = $(".widget-box__fallback", box);
    // Das Skript hängt sofort ein leeres #app an; erst die geladenen Inserate bringen Text mit
    const showFallback = () => { if (!$(".wrapperJSON", box).textContent.trim()) fallback.hidden = false; };
    loadScript("https://www.motorradhandel.ch/extern/jquery-min.js")
      .then(() => loadScript("https://www.motorradhandel.ch/extern/remote_inserate.js"))
      .then(() => setTimeout(showFallback, 10000))
      .catch(showFallback);
  }

  /* ---------- Bildergalerie ---------- */
  function initLightbox() {
    const gallery = $("[data-lightbox]");
    if (!gallery) return;
    const box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<button type="button" aria-label="Schliessen">×</button><img alt="">';
    document.body.appendChild(box);
    const img = $("img", box);
    const close = () => box.classList.remove("is-open");
    gallery.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      e.preventDefault();
      img.src = a.href;
      img.alt = $("img", a).alt;
      box.classList.add("is-open");
    });
    box.addEventListener("click", (e) => { if (e.target !== img) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- Formulare ---------- */
  const fmtDate = (v) => {
    if (!v) return "";
    const [y, m, d] = v.split("-");
    return `${d}.${m}.${y}`;
  };

  function validateField(field) {
    const wrap = field.closest(".field") || field.closest(".choice-group");
    let ok = field.checkValidity();
    if (ok && field.dataset.workday !== undefined && field.value) {
      ok = isWorkday(field.value);
      field.setCustomValidity(ok ? "" : "Montag und Sonntag geschlossen");
    }
    if (wrap) wrap.classList.toggle("has-error", !ok);
    return ok;
  }

  function isWorkday(v) {
    const d = new Date(v + "T12:00:00");
    const day = d.getDay();
    return day !== 0 && day !== 1;
  }

  function initDateFields() {
    $$('input[type="date"][data-min-days]').forEach((inp) => {
      const d = new Date();
      d.setDate(d.getDate() + Number(inp.dataset.minDays || 0));
      inp.min = d.toISOString().slice(0, 10);
    });
    $$("input[data-workday]").forEach((inp) => {
      const info = inp.parentElement.querySelector(".date-info");
      inp.addEventListener("change", () => {
        if (!inp.value) { info && (info.textContent = ""); return; }
        const ok = isWorkday(inp.value);
        const d = new Date(inp.value + "T12:00:00");
        if (info) {
          info.className = "date-info " + (ok ? "ok" : "err");
          info.textContent = ok
            ? `✓ ${DAY_NAMES[d.getDay()]}, ${fmtDate(inp.value)} – Werkstatt geöffnet`
            : `✗ ${DAY_NAMES[d.getDay()]} – an diesem Tag ist die Werkstatt geschlossen`;
        }
        inp.setCustomValidity(ok ? "" : "Montag und Sonntag geschlossen");
        validateField(inp);
      });
    });
  }

  function collect(form) {
    const rows = [];
    const seen = new Set();
    $$("[name]", form).forEach((el) => {
      if (seen.has(el.name) || el.type === "hidden" || el.dataset.skip !== undefined) return;
      const isGroup = (el.type === "checkbox" || el.type === "radio") && $$(`[name="${el.name}"]`, form).length > 1;
      const label = el.dataset.label
        || (isGroup && el.closest("[data-label]")?.dataset.label)
        || (form.querySelector(`label[for="${el.id}"]`)?.textContent || el.name).replace("*", "").trim();
      let value;
      if (el.type === "checkbox" || el.type === "radio") {
        const checked = $$(`[name="${el.name}"]:checked`, form);
        seen.add(el.name);
        value = checked.map((c) => c.dataset.value || c.value).join(", ");
        if (el.type === "checkbox" && $$(`[name="${el.name}"]`, form).length === 1) value = el.checked ? "Ja" : "Nein";
      } else {
        value = el.type === "date" ? fmtDate(el.value) : el.value.trim();
        seen.add(el.name);
      }
      if (value) rows.push([label, value]);
    });
    return rows;
  }

  function renderSummary(form) {
    const box = $("[data-summary]", form);
    if (!box) return;
    const rows = collect(form);
    const dl = document.createElement("dl");
    rows.forEach(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      dl.append(dt, dd);
    });
    box.replaceChildren(dl);
  }

  function initForms() {
    $$("form[data-form]").forEach((form) => {
      const steps = $$(".form-step", form);
      const progress = $$(".form-progress__step", form);
      const prev = $("[data-prev]", form);
      const next = $("[data-next]", form);
      const submit = $("[type=submit]", form);
      let current = 0;

      const show = (i, initial = false) => {
        current = i;
        steps.forEach((s, idx) => s.classList.toggle("is-active", idx === i));
        progress.forEach((p, idx) => {
          p.classList.toggle("is-active", idx === i);
          p.classList.toggle("is-done", idx < i);
        });
        if (prev) prev.hidden = i === 0;
        if (next) next.hidden = i === steps.length - 1;
        if (submit && steps.length > 1) submit.hidden = i !== steps.length - 1;
        if (i === steps.length - 1) renderSummary(form);
        if (steps.length > 1 && !initial) {
          const top = form.getBoundingClientRect().top + window.scrollY - 110;
          if (window.scrollY > top) window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
        }
      };

      const validateStep = (step) => {
        const fields = $$("input, select, textarea", step).filter((f) => !f.disabled);
        let ok = true;
        let first = null;
        fields.forEach((f) => {
          if (!validateField(f)) { ok = false; first = first || f; }
        });
        // Radio/Checkbox-Gruppen mit data-required-group
        $$("[data-required-group]", step).forEach((g) => {
          const any = $$("input:checked", g).length > 0;
          g.classList.toggle("has-error", !any);
          if (!any) { ok = false; first = first || $("input", g); }
        });
        if (first) first.focus({ preventScroll: false });
        return ok;
      };

      $$("input, select, textarea", form).forEach((f) => {
        f.addEventListener("blur", () => { if (f.value) validateField(f); });
        f.addEventListener("input", () => {
          const w = f.closest(".has-error");
          if (w && f.checkValidity()) w.classList.remove("has-error");
        });
        f.addEventListener("change", () => {
          const g = f.closest("[data-required-group]");
          if (g) g.classList.remove("has-error");
        });
      });

      form.addEventListener("input", () => { if (current === steps.length - 1) renderSummary(form); });
      form.addEventListener("change", () => { if (current === steps.length - 1) renderSummary(form); });

      next && next.addEventListener("click", () => { if (validateStep(steps[current])) show(current + 1); });
      prev && prev.addEventListener("click", () => show(current - 1));

      // Bedingte Felder: data-toggle-target="#id" auf Checkbox/Radio
      $$("[data-toggle-target]", form).forEach((ctrl) => {
        const target = $(ctrl.dataset.toggleTarget, form);
        const sync = () => {
          const on = ctrl.type === "radio" ? $(`[name="${ctrl.name}"][data-toggle-target]:checked`, form) === ctrl : ctrl.checked;
          target.hidden = !on;
          $$("input, select, textarea", target).forEach((i) => (i.disabled = !on));
        };
        $$(`[name="${ctrl.name}"]`, form).forEach((r) => r.addEventListener("change", sync));
        sync();
      });

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (!validateStep(steps.length ? steps[current] : form)) return;
        const rows = collect(form);
        const subject = form.dataset.subject || "Anfrage über luedimotos.ch";
        const endpoint = form.dataset.endpoint;
        submit.disabled = true;
        submit.dataset.text = submit.innerHTML;
        submit.textContent = "Wird gesendet …";

        let sent = false;
        if (endpoint) {
          try {
            const res = await fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
            sent = res.ok;
          } catch (_) { sent = false; }
        }
        if (!sent) {
          // Fallback: E-Mail-Programm mit vorausgefüllter Nachricht öffnen
          const body = rows.map(([k, v]) => `${k}: ${v}`).join("\n");
          const to = form.dataset.mailto || "info@luedimotos.ch";
          window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + "\n\n— gesendet über luedimotos.ch")}`;
        }

        const success = $("[data-success]", form.parentElement);
        if (success) {
          const name = form.querySelector("[name=vorname]")?.value || "";
          const nameEl = $("[data-success-name]", success);
          if (nameEl) nameEl.textContent = name ? `, ${name}` : "";
          form.hidden = true;
          success.classList.add("is-visible");
          success.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
        }
        submit.disabled = false;
        submit.innerHTML = submit.dataset.text;
      });

      $$("[data-reset]", form.parentElement).forEach((btn) => btn.addEventListener("click", () => {
        form.reset();
        form.hidden = false;
        $("[data-success]", form.parentElement).classList.remove("is-visible");
        $$(".date-info", form).forEach((i) => (i.textContent = ""));
        if (steps.length) show(0);
      }));

      if (steps.length) show(0, true);

      // Vorauswahl über URL, z. B. werkstatt.html?leistung=reifen#termin
      const params = new URLSearchParams(location.search);
      params.forEach((val, key) => {
        const el = form.querySelector(`[name="${key}"][value="${val}"]`);
        if (el) el.checked = true;
        const sel = form.querySelector(`select[name="${key}"]`);
        if (sel && sel.querySelector(`option[value="${val}"]`)) sel.value = val;
      });
    });
  }

  /* ---------- Jahr im Footer ---------- */
  function initYear() {
    $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
    $$("[data-years-since]").forEach((el) => {
      const n = new Date().getFullYear() - Number(el.dataset.yearsSince);
      if (el.dataset.count !== undefined) el.dataset.count = n; else el.textContent = n;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initYear();
    initStatus();
    initHeader();
    initReveal();
    initFilter();
    initCountdown();
    initSnow();
    initMap();
    initWidget();
    initLightbox();
    initDateFields();
    initForms();
  });
})();
