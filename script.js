/* Hive landing page: progressive enhancement only.
 * Without JavaScript every section, step and video panel still shows; this file adds the
 * mobile menu, copy buttons, keyboard tabs, click-to-load videos and the current section in
 * the navigation. No dependencies, no inline styles in the markup, no tracking. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.remove("no-js");
  root.classList.add("js");

  var live = document.getElementById("live-region");
  function announce(message) {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(function () { live.textContent = message; }, 30);
  }

  /* Mobile navigation ===================================================================== */
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("site-nav");
  if (header && toggle && nav) {
    var label = toggle.querySelector("[data-nav-label]");
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      header.classList.toggle("is-open", open);
      if (label) label.textContent = open ? "Close" : "Menu";
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
    var wide = window.matchMedia("(min-width: 961px)");
    var closeOnWide = function () { if (wide.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener("change", closeOnWide);
  }

  /* Copy buttons: the full value, with a visible "Copied" for about 1.5 s ================== */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.className = "visually-hidden";
      document.body.appendChild(area);
      area.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (error) { ok = false; }
      area.remove();
      if (ok) resolve(); else reject(new Error("copy failed"));
    });
  }

  document.addEventListener("click", function (event) {
    var button = event.target.closest("[data-copy]");
    if (!button) return;
    var name = button.getAttribute("aria-label") || "Copy";
    copyText(button.getAttribute("data-copy")).then(function () {
      button.classList.add("is-copied");
      announce("Copied: " + name.replace(/^Copy\s*/, ""));
      window.clearTimeout(button._copyTimer);
      button._copyTimer = window.setTimeout(function () { button.classList.remove("is-copied"); }, 1500);
    }, function () {
      announce("Copy failed. Select the value and copy it manually.");
    });
  });

  /* Videos: the player loads only after a click ============================================= */
  function resetVideo(box) {
    var frame = box.querySelector(".video__frame");
    if (frame) frame.remove();
    box.classList.remove("is-playing");
  }

  document.querySelectorAll("[data-video]").forEach(function (box) {
    var id = (box.getAttribute("data-youtube-id") || "").trim();
    var url = (box.getAttribute("data-video-url") || "").trim();
    var play = box.querySelector("[data-video-play]");
    if (!play) return;
    if (!id && !url) {
      // No link yet: a disabled control that says why (DESIGN.md: disabled with a visible reason).
      box.classList.add("is-pending");
      play.disabled = true;
      return;
    }
    play.addEventListener("click", function () {
      if (!id) {
        window.open(url, "_blank", "noopener");
        return;
      }
      var frame = document.createElement("iframe");
      frame.className = "video__frame";
      frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      frame.title = box.getAttribute("data-title") || "Video";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.referrerPolicy = "strict-origin-when-cross-origin";
      frame.allowFullscreen = true;
      box.appendChild(frame);
      box.classList.add("is-playing");
      frame.focus();
    });
  });

  /* Tabs (steps and videos): ARIA tabs with arrow keys, Home and End ======================== */
  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    var tabs = Array.prototype.slice.call(group.querySelectorAll('[role="tab"]'));
    var panels = tabs.map(function (tab) { return document.getElementById(tab.getAttribute("aria-controls")); });
    if (!tabs.length) return;

    function select(index, moveFocus) {
      tabs.forEach(function (tab, i) {
        var on = i === index;
        tab.setAttribute("aria-selected", String(on));
        tab.tabIndex = on ? 0 : -1;
        if (panels[i]) {
          panels[i].hidden = !on;
          // A hidden video stops: its player is removed.
          if (!on) panels[i].querySelectorAll("[data-video]").forEach(resetVideo);
        }
      });
      if (moveFocus) tabs[index].focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(i, false); });
      tab.addEventListener("keydown", function (event) {
        var next = null;
        if (event.key === "ArrowRight") next = (i + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (i - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        if (next === null) return;
        event.preventDefault();
        select(next, true);
      });
    });

    group.querySelectorAll("[data-tab-next]").forEach(function (button) {
      button.addEventListener("click", function () {
        var current = tabs.findIndex(function (tab) { return tab.getAttribute("aria-selected") === "true"; });
        select((current + 1) % tabs.length, true);
      });
    });

    var initial = tabs.findIndex(function (tab) { return tab.getAttribute("aria-selected") === "true"; });
    select(initial < 0 ? 0 : initial, false);
  });

  /* Current section in the navigation ======================================================= */
  // Every top-level section is observed; a section that has no menu item clears the mark.
  var links = Array.prototype.slice.call(document.querySelectorAll('.site-nav__list a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll("main > section[id]"));
  if ("IntersectionObserver" in window && links.length && sections.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (link) {
          if (link.getAttribute("href") === "#" + entry.target.id) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (section) { observer.observe(section); });
  }
})();
