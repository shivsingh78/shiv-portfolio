/*
 * Renders the portfolio from the data files in js/data/.
 * You normally never need to edit this file to change content.
 * All text from the data files is inserted with textContent, never innerHTML.
 */
(function () {
  "use strict";

  var D = window.PORTFOLIO || {};
  var profile = D.profile || {};
  var navItems = D.navigation || [];
  var skills = D.skills || [];
  var experience = D.experience || [];

  /* ---------- helpers ---------- */

  // Only allow http(s), mailto, and relative URLs. Anything else (javascript:, data:, ...) is dropped.
  function safeUrl(url) {
    if (typeof url !== "string") return null;
    var u = url.trim();
    if (!u) return null;
    if (/^(https?:\/\/|mailto:)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u)) return null;
    return u;
  }

  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v === undefined || v === null || v === false) return;
      if (k === "class") el.className = v;
      else if (k === "text") el.textContent = v;
      else if (k === "href") {
        var safe = safeUrl(v);
        if (safe) el.setAttribute("href", safe);
      } else el.setAttribute(k, v === true ? "" : v);
    });
    function add(c) {
      if (c === undefined || c === null || c === false) return;
      if (Array.isArray(c)) { c.forEach(add); return; }
      el.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    }
    for (var i = 2; i < arguments.length; i++) add(arguments[i]);
    return el;
  }

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function sectionHead(num, id, title, lead) {
    return h("div", { class: "section-head reveal" },
      h("p", { class: "eyebrow" }, h("span", { class: "eyebrow-num", text: num }), " — " + title),
      h("h2", { id: id, class: "section-title", text: lead })
    );
  }

  function responsiveImg(photo, opts) {
    if (!photo || !photo.src) return null;
    var img = h("img", {
      src: photo.src,
      srcset: photo.srcset,
      sizes: opts && opts.sizes,
      width: photo.width,
      height: photo.height,
      alt: photo.alt || "",
      decoding: "async",
      loading: opts && opts.eager ? "eager" : "lazy",
      fetchpriority: opts && opts.eager ? "high" : null,
    });
    return img;
  }

  /* ---------- header ---------- */

  function renderHeader() {
    var wm = $(".wordmark");
    wm.textContent = "";
    wm.appendChild(h("span", { class: "wordmark-mark", text: profile.initials || "S" }));
    wm.appendChild(h("span", { class: "wordmark-name", text: profile.name || "" }));

    var nav = $("#site-nav");
    navItems.forEach(function (item) {
      if (!document.getElementById(item.id)) return; // never link to a missing section
      nav.appendChild(h("a", { href: "#" + item.id, "data-nav": item.id, text: item.label }));
    });
    var resumeLink = h("a", { class: "nav-resume", "data-resume": true, hidden: true, text: "Download resume" });
    nav.appendChild(resumeLink);

    $("#footer-text").textContent = "© " + new Date().getFullYear() + " " + (profile.name || "") ;
  }

  /* ---------- hero ---------- */

  function socialLinks(extraClass) {
    var wrap = h("ul", { class: "social " + (extraClass || ""), role: "list" });
    var s = profile.social || {};
    [["GitHub", s.github], ["LinkedIn", s.linkedin]].forEach(function (pair) {
      var url = safeUrl(pair[1]);
      if (!url) return;
      wrap.appendChild(h("li", null,
        h("a", { href: url, rel: "noopener noreferrer", target: "_blank" }, pair[0], h("span", { class: "sr-only", text: " (opens in a new tab)" }))
      ));
    });
    if (profile.email && safeUrl("mailto:" + profile.email)) {
      wrap.appendChild(h("li", null, h("a", { href: "mailto:" + profile.email, text: "Email" })));
    }
    return wrap.children.length ? wrap : null;
  }

  function factsEl() {
    var list = (profile.facts || []).filter(function (f) { return f && f.value && f.label; });
    if (!list.length) return null;
    var dl = h("dl", { class: "facts" });
    list.forEach(function (f) {
      dl.appendChild(h("div", null, h("dt", { text: f.value }), h("dd", { text: f.label })));
    });
    return dl;
  }

  function renderHero() {
    var root = $("#hero");
    var left = h("div", { class: "hero-copy" },
      profile.availability ? h("p", { class: "availability" }, h("span", { class: "dot", "aria-hidden": "true" }), profile.availability) : null,
      h("p", { class: "hero-name", text: profile.name }),
      h("h1", { id: "hero-title", class: "hero-title", text: profile.headline }),
      h("p", { class: "hero-intro", text: profile.intro }),
      h("div", { class: "hero-actions" },
        h("a", { class: "btn btn-primary", href: "#projects", text: "Explore My Projects" }),
        h("a", { class: "btn btn-ghost", "data-resume": true, hidden: true, text: "Download Resume" })
      ),
      socialLinks("hero-social"),
      factsEl()
    );

    var photo = responsiveImg(profile.photos && profile.photos.hero, { eager: true, sizes: "(min-width: 900px) 420px, 80vw" });
    var right = h("div", { class: "hero-photo" },
      h("div", { class: "photo-frame" }, photo),
      profile.location ? h("p", { class: "photo-caption", text: profile.location }) : null
    );

    root.appendChild(h("div", { class: "wrap hero-inner" }, left, right));
    root.appendChild(h("a", { class: "scroll-hint", href: "#about", "aria-label": "Scroll to About" }, h("span", { text: "Scroll" }), h("span", { class: "scroll-line", "aria-hidden": "true" })));
  }

  /* ---------- about ---------- */

  function renderAbout() {
    var root = $("#about");
    var photo = responsiveImg(profile.photos && profile.photos.about, { sizes: "(min-width: 900px) 340px, 70vw" });
    var paras = (profile.about || []).map(function (p) { return h("p", { text: p }); });
    root.appendChild(h("div", { class: "wrap" },
      sectionHead("01", "about-title", "About", "How I like to work."),
      h("div", { class: "about-grid" },
        photo ? h("figure", { class: "about-photo reveal" }, photo) : null,
        h("div", { class: "prose reveal" }, paras)
      )
    ));
  }

  /* ---------- projects ---------- */

  function validProjects(list) {
    var seen = {};
    return (list || []).filter(function (p) {
      var ok = p && p.id && p.slug && p.name && p.shortDescription;
      if (!ok) { console.warn("[portfolio] Skipping project with missing id/slug/name/shortDescription:", p); return false; }
      if (seen[p.slug]) { console.warn("[portfolio] Duplicate project slug skipped:", p.slug); return false; }
      seen[p.slug] = true;
      return true;
    });
  }

  function tagList(items, cls) {
    if (!items || !items.length) return null;
    return h("ul", { class: "tags " + (cls || ""), role: "list" }, items.map(function (t) { return h("li", { text: t }); }));
  }

  function pipelineEl(steps) {
    var ol = h("ol", { class: "pipeline", "aria-label": "Release pipeline stages" });
    steps.forEach(function (s, i) {
      ol.appendChild(h("li", null, h("span", { class: "pipeline-step", text: s })));
    });
    return ol;
  }

  function terminalEl(lines) {
    var pre = h("pre", { class: "terminal", "aria-label": "Example commands" });
    pre.appendChild(h("code", { text: lines.join("\n") }));
    return pre;
  }

  function projectVisual(p) {
    var box = h("div", { class: "card-visual" });
    if (p.image && p.image.src) {
      var img = h("img", { src: p.image.src, alt: p.image.alt || p.name + " screenshot", loading: "lazy", decoding: "async", width: 1280, height: 720 });
      img.addEventListener("error", function () { img.remove(); box.appendChild(fallbackVisual(p)); });
      box.appendChild(img);
      return box;
    }
    box.appendChild(fallbackVisual(p));
    return box;
  }

  function fallbackVisual(p) {
    var wrap = h("div", { class: "visual-fallback", "aria-hidden": "true" });
    if (p.pipeline && p.pipeline.length) {
      wrap.classList.add("has-pipeline");
      wrap.appendChild(pipelineEl(p.pipeline));
    } else if (p.terminal && p.terminal.length) {
      wrap.classList.add("has-terminal");
      wrap.appendChild(terminalEl(p.terminal.slice(0, 1)));
    } else {
      wrap.appendChild(h("span", { class: "monogram", text: p.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2) }));
    }
    return wrap;
  }

  function linkRow(p) {
    var links = [];
    [["GitHub", p.githubUrl], ["Live demo", p.liveUrl], ["npm", p.npmUrl], ["Docs", p.documentationUrl]].forEach(function (pair) {
      var url = safeUrl(pair[1]);
      if (!url) return;
      links.push(h("a", { class: "text-link", href: url, target: "_blank", rel: "noopener noreferrer" }, pair[0], h("span", { class: "sr-only", text: " for " + p.name + " (opens in a new tab)" })));
    });
    return links;
  }

  function hasDetails(p) {
    return !!(p.fullDescription || p.problem || p.solution || (p.features && p.features.length) ||
      p.architecture || (p.engineeringHighlights && p.engineeringHighlights.length) ||
      (p.tradeoffs && p.tradeoffs.length) || (p.challenges && p.challenges.length) ||
      (p.lessonsLearned && p.lessonsLearned.length) || (p.futureImprovements && p.futureImprovements.length));
  }

  function projectCard(p, index, big) {
    var metaParts = [p.category, p.status].filter(function (v, i, a) {
      return v && a.findIndex(function (x) { return x && x.toLowerCase() === v.toLowerCase(); }) === i;
    });
    var meta = [String(index + 1).padStart(2, "0")].concat(metaParts).join("  ·  ");
    var actions = h("div", { class: "card-actions" });
    if (hasDetails(p)) {
      actions.appendChild(h("button", { class: "btn btn-small btn-primary", type: "button", "data-open": p.slug }, "View details", h("span", { class: "sr-only", text: " for " + p.name })));
    }
    linkRow(p).forEach(function (a) { actions.appendChild(a); });

    var clickable = hasDetails(p);
    return h("article", { class: "card reveal" + (big ? " card-big" : "") + (p.placeholder ? " is-placeholder" : "") + (clickable ? " is-clickable" : ""), id: "project-" + p.slug, "data-card": clickable ? p.slug : null },
      projectVisual(p),
      h("div", { class: "card-body" },
        h("p", { class: "card-meta", text: meta }),
        h("h3", { class: "card-title", text: p.name }),
        h("p", { class: "card-desc", text: p.shortDescription }),
        p.placeholder ? h("p", { class: "placeholder-note" }, h("span", { class: "dot dot-muted", "aria-hidden": "true" }), "Details coming soon") : null,
        tagList(p.technologies),
        actions
      )
    );
  }

  var projectList = [];

  function renderProjects() {
    var root = $("#projects");
    projectList = validProjects(D.projects);
    var featured = projectList.filter(function (p) { return p.featured; });
    var others = projectList.filter(function (p) { return !p.featured; });
    var n = 0;

    var wrap = h("div", { class: "wrap" },
      sectionHead("02", "projects-title", "Projects", "Things I've built, and how they work.")
    );
    if (featured.length) {
      var grid = h("div", { class: "card-grid" });
      featured.forEach(function (p) { grid.appendChild(projectCard(p, n++, true)); });
      wrap.appendChild(grid);
    }
    if (others.length) {
      wrap.appendChild(h("h3", { class: "subhead reveal", text: "More projects" }));
      var grid2 = h("div", { class: "card-grid card-grid-small" });
      others.forEach(function (p) { grid2.appendChild(projectCard(p, n++, false)); });
      wrap.appendChild(grid2);
    }
    if (safeUrl(profile.social && profile.social.github)) {
      wrap.appendChild(h("p", { class: "more-link reveal" },
        h("a", { class: "text-link", href: profile.social.github, target: "_blank", rel: "noopener noreferrer" }, "See all repositories on GitHub →", h("span", { class: "sr-only", text: " (opens in a new tab)" }))
      ));
    }
    root.appendChild(wrap);
  }

  /* ---------- project dialog ---------- */

  var dialog = null;
  var lastTrigger = null;

  function listBlock(title, items, ordered) {
    if (!items || !items.length) return null;
    return h("section", { class: "dlg-section" },
      h("h3", { text: title }),
      h(ordered ? "ol" : "ul", { class: "bullets" }, items.map(function (t) { return h("li", { text: t }); }))
    );
  }

  function textBlock(title, text, extra) {
    if (!text && !extra) return null;
    return h("section", { class: "dlg-section" }, h("h3", { text: title }), text ? h("p", { text: text }) : null, extra || null);
  }

  function buildDialog(p) {
    dialog.textContent = "";
    var links = linkRow(p);
    var archExtra = [];
    if (p.pipeline && p.pipeline.length) archExtra.push(pipelineEl(p.pipeline));
    if (p.technologies && p.technologies.length) archExtra.push(tagList(p.technologies, "tags-inline"));

    var content = h("div", { class: "dlg-inner" },
      h("button", { class: "dlg-close", type: "button", "aria-label": "Close project details", "data-close": true }, "×"),
      h("p", { class: "eyebrow", text: [p.category, p.status].filter(Boolean).join("  ·  ") }),
      h("h2", { id: "dialog-title", class: "dlg-title", text: p.name }),
      textBlock("Overview", p.fullDescription || p.shortDescription),
      textBlock("Problem", p.problem),
      textBlock("Solution", p.solution),
      listBlock("Main features", p.features),
      p.terminal && p.terminal.length ? h("section", { class: "dlg-section" }, h("h3", { text: "Usage" }), terminalEl(p.terminal)) : null,
      (p.architecture || archExtra.length)
        ? h("section", { class: "dlg-section" }, h("h3", { text: "Architecture & stack" }), p.architecture ? h("p", { text: p.architecture }) : null, archExtra[0] || null, archExtra[1] || null)
        : null,
      listBlock("Engineering decisions", p.engineeringHighlights),
      listBlock("Trade-offs & limitations", p.tradeoffs),
      listBlock("Challenges", p.challenges),
      listBlock("Lessons learned", p.lessonsLearned),
      listBlock("Future improvements", p.futureImprovements),
      (p.image && p.image.src) ? h("section", { class: "dlg-section" }, h("h3", { text: "Screenshot" }), h("img", { class: "dlg-img", src: p.image.src, alt: p.image.alt || p.name + " screenshot", loading: "lazy" })) : null,
      links.length ? h("div", { class: "dlg-links" }, links) : null
    );
    dialog.appendChild(content);
  }

  function openProject(slug, trigger, skipHash) {
    var p = projectList.filter(function (x) { return x.slug === slug; })[0];
    if (!p || !hasDetails(p)) return;
    lastTrigger = trigger || null;
    buildDialog(p);
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    dialog.scrollTop = 0;
    document.documentElement.classList.add("modal-open");
    if (!skipHash) {
      try { history.replaceState(null, "", "#project=" + encodeURIComponent(slug)); } catch (e) {}
    }
  }

  function closeProject() {
    if (dialog.open) dialog.close();
  }

  function setupDialog() {
    dialog = $("#project-dialog");
    document.addEventListener("click", function (e) {
      var opener = e.target.closest && e.target.closest("[data-open]");
      if (opener) { openProject(opener.getAttribute("data-open"), opener); return; }
      if (e.target.closest && e.target.closest("[data-close]")) { closeProject(); return; }
      // Whole-card click: ignore anything interactive (links, buttons, ...) and text selection.
      var card = e.target.closest && e.target.closest("[data-card]");
      if (card && !e.target.closest("a, button, input, select, textarea, summary, label")) {
        var sel = window.getSelection && window.getSelection();
        if (sel && !sel.isCollapsed && card.contains(sel.anchorNode)) return;
        openProject(card.getAttribute("data-card"), $("[data-open]", card));
        return;
      }
      if (e.target === dialog) closeProject(); // click on the backdrop
    });
    dialog.addEventListener("close", function () {
      document.documentElement.classList.remove("modal-open");
      try {
        if (/^#project=/.test(location.hash)) history.replaceState(null, "", location.pathname + location.search + "#projects");
      } catch (e) {}
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    });
    function fromHash() {
      var m = /^#project=([^&]+)/.exec(location.hash);
      if (m) openProject(decodeURIComponent(m[1]), null, true);
    }
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  /* ---------- skills ---------- */

  function renderSkills() {
    var root = $("#skills");
    var grid = h("div", { class: "skills-grid" });
    skills.forEach(function (cat) {
      if (!cat || !cat.items || !cat.items.length) return;
      var ul = h("ul", { class: "tags", role: "list" });
      cat.items.forEach(function (s) {
        var li = h("li", { class: s.status === "learning" ? "is-learning" : "", text: s.name, title: s.note || (s.status === "learning" ? "Currently learning" : null) });
        if (s.status === "learning") li.appendChild(h("span", { class: "sr-only", text: " (currently learning)" }));
        ul.appendChild(li);
      });
      grid.appendChild(h("div", { class: "skill-group reveal" }, h("h3", { text: cat.title }), ul));
    });
    var hasLearning = skills.some(function (c) { return (c.items || []).some(function (s) { return s.status === "learning"; }); });
    root.appendChild(h("div", { class: "wrap" },
      sectionHead("03", "skills-title", "Skills", "Tools I've used in real projects."),
      grid,
      hasLearning ? h("p", { class: "legend reveal" }, h("span", { class: "legend-swatch" }), " Dashed tags are technologies I'm currently learning.") : null
    ));
  }

  /* ---------- journey ---------- */

  function renderJourney() {
    var root = $("#journey");
    var ol = h("ol", { class: "timeline" });
    experience.forEach(function (e) {
      if (!e || !e.title) return;
      ol.appendChild(h("li", { class: "timeline-item reveal" },
        h("p", { class: "timeline-period", text: e.period || "" }),
        h("div", null,
          h("h3", { text: e.title }),
          e.org ? h("p", { class: "timeline-org", text: e.org }) : null,
          e.description ? h("p", { text: e.description }) : null
        )
      ));
    });
    root.appendChild(h("div", { class: "wrap" },
      sectionHead("04", "journey-title", "Journey", "Education and engineering practice."),
      ol
    ));
  }

  /* ---------- contact ---------- */

  function renderContact() {
    var root = $("#contact");
    var email = profile.email && safeUrl("mailto:" + profile.email) ? profile.email : "";
    var buttons = h("div", { class: "hero-actions" });
    if (email) buttons.appendChild(h("a", { class: "btn btn-primary", href: "mailto:" + email, text: "Send an email" }));
    var gh = safeUrl(profile.social && profile.social.github);
    if (gh) buttons.appendChild(h("a", { class: email ? "btn btn-ghost" : "btn btn-primary", href: gh, target: "_blank", rel: "noopener noreferrer" }, "Visit my GitHub", h("span", { class: "sr-only", text: " (opens in a new tab)" })));
    var li = safeUrl(profile.social && profile.social.linkedin);
    if (li) buttons.appendChild(h("a", { class: "btn btn-ghost", href: li, target: "_blank", rel: "noopener noreferrer" }, "Connect on LinkedIn", h("span", { class: "sr-only", text: " (opens in a new tab)" })));
    buttons.appendChild(h("a", { class: "btn btn-ghost", "data-resume": true, hidden: true, text: "Download Resume" }));

    root.appendChild(h("div", { class: "wrap contact-card reveal" },
      h("p", { class: "eyebrow" }, h("span", { class: "eyebrow-num", text: "05" }), " — Contact"),
      h("h2", { id: "contact-title", class: "section-title", text: "Let's talk about backend work and internships." }),
      h("p", { class: "contact-lead", text: "I'm happy to walk through how ShipFlow, Repolet, or any of my other projects work under the hood." }),
      buttons
    ));
  }

  /* ---------- resume ---------- */

  function setupResume() {
    var r = profile.resume || {};
    var url = safeUrl(r.path);
    var links = $$("[data-resume]");
    if (!url) return;
    function show() {
      links.forEach(function (a) {
        a.setAttribute("href", url);
        a.setAttribute("download", r.downloadName || "");
        a.removeAttribute("hidden");
      });
    }
    if (location.protocol === "file:") { show(); return; } // cannot probe over file://
    fetch(url, { method: "HEAD" }).then(function (res) {
      var type = res.headers.get("content-type") || "";
      if (res.ok && /pdf|octet-stream/i.test(type)) show();
    }).catch(function () { /* resume not present: leave the buttons hidden */ });
  }

  /* ---------- theme + mobile menu ---------- */

  function setupTheme() {
    var btn = $("#theme-toggle");
    var meta = $("#theme-color");
    function apply(t, persist) {
      document.documentElement.setAttribute("data-theme", t);
      btn.setAttribute("aria-pressed", String(t === "dark"));
      btn.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
      if (meta) meta.setAttribute("content", t === "dark" ? "#11110f" : "#f6f4ee");
      if (persist) { try { localStorage.setItem("theme", t); } catch (e) {} }
    }
    apply(document.documentElement.getAttribute("data-theme") || "light", false);
    btn.addEventListener("click", function () {
      apply(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
    });
  }

  function setupMenu() {
    var btn = $("#menu-toggle");
    var nav = $("#site-nav");
    function set(open) {
      nav.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }
    btn.addEventListener("click", function () { set(btn.getAttribute("aria-expanded") !== "true"); });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { set(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (btn.getAttribute("aria-expanded") === "true" && !e.target.closest(".site-header")) set(false);
    });
  }

  /* ---------- motion: reveal on scroll + scroll spy ---------- */

  function setupMotion() {
    var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var reveals = $$(".reveal");
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach(function (el) { el.classList.add("in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
      reveals.forEach(function (el) { io.observe(el); });
    }

    if ("IntersectionObserver" in window) {
      var links = {};
      $$("[data-nav]").forEach(function (a) { links[a.getAttribute("data-nav")] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var a = links[en.target.id];
          if (!a) return;
          if (en.isIntersecting) {
            Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
            a.setAttribute("aria-current", "true");
          }
        });
      }, { rootMargin: "-45% 0px -50% 0px" });
      Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    }
  }

  /* ---------- boot ---------- */

  function boot() {
    document.title = (profile.name || "Portfolio") + " — Backend-focused full-stack developer";
    if (safeUrl(profile.siteUrl)) {
      var link = document.createElement("link");
      link.rel = "canonical";
      link.href = profile.siteUrl;
      document.head.appendChild(link);
    }
    renderHero();
    renderAbout();
    renderProjects();
    renderSkills();
    renderJourney();
    renderContact();
    renderHeader(); // after sections exist so nav only links to real sections
    setupTheme();
    setupMenu();
    setupDialog();
    setupResume();
    setupMotion();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
