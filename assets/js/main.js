(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Year in footer ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Smooth scroll ---------- */
  document.querySelectorAll("[data-smooth-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
      closeDrawer();
    });
  });

  /* ---------- Sticky nav + blur ---------- */
  const siteNav = document.getElementById("site-nav");
  const hero = document.querySelector(".hero");

  function updateNavScrolled() {
    if (!siteNav) return;
    if (hero) {
      const heroBottom = hero.getBoundingClientRect().bottom;
      siteNav.classList.toggle("is-scrolled", heroBottom < 80);
    } else {
      siteNav.classList.toggle("is-scrolled", window.scrollY > 40);
    }
  }

  window.addEventListener("scroll", updateNavScrolled, { passive: true });
  updateNavScrolled();

  /* ---------- Mobile drawer ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navDrawer = document.getElementById("nav-drawer");
  const navBackdrop = document.getElementById("nav-backdrop");

  function openDrawer() {
    if (!navDrawer || !navToggle) return;
    navDrawer.classList.add("is-open");
    navDrawer.setAttribute("aria-hidden", "false");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }

  function closeDrawer() {
    if (!navDrawer || !navToggle) return;
    navDrawer.classList.remove("is-open");
    navDrawer.setAttribute("aria-hidden", "true");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }

  function toggleDrawer() {
    if (navDrawer?.classList.contains("is-open")) closeDrawer();
    else openDrawer();
  }

  navToggle?.addEventListener("click", toggleDrawer);
  navBackdrop?.addEventListener("click", closeDrawer);

  document.querySelectorAll(".nav-drawer__list a").forEach((link) => {
    link.addEventListener("click", () => closeDrawer());
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDrawer();
      closeCvModal();
      closeProjectModal();
    }
  });

  /* ---------- Section IDs for active nav ---------- */
  const onAcademicPage = Boolean(document.getElementById("past-work"));
  const sectionIds = onAcademicPage
    ? ["past-work", "education", "achievements"]
    : ["about", "skills", "experience", "projects", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = document.querySelectorAll(
    '.site-nav__links a[data-section], .nav-drawer__list a[data-section]'
  );

  function setActiveSection(activeId) {
    navLinks.forEach((link) => {
      const sec = link.getAttribute("data-section");
      link.classList.toggle("is-active", sec === activeId);
    });
  }

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        if (sectionIds.includes(id)) setActiveSection(id);
      });
    },
    {
      rootMargin: "-45% 0px -45% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => navObserver.observe(section));

  /* ---------- Reveal on scroll ---------- */
  const revealElements = document.querySelectorAll(".reveal");
  if (!prefersReducedMotion && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Typing / cycling hero subtitle ---------- */
  const typeStrings = [
    "Digital Transformation Analyst",
    "Systems Engineer",
    "AI & Automation Architect",
  ];
  const typeTextEl = document.getElementById("hero-type-text");

  if (typeTextEl && !prefersReducedMotion) {
    let strIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const typeSpeed = 85;
    const deleteSpeed = 45;
    const pauseEnd = 2000;
    const pauseStart = 400;

    function tick() {
      const full = typeStrings[strIndex];
      if (!deleting) {
        charIndex++;
        typeTextEl.textContent = full.slice(0, charIndex);
        if (charIndex === full.length) {
          setTimeout(() => {
            deleting = true;
            tick();
          }, pauseEnd);
          return;
        }
      } else {
        charIndex--;
        typeTextEl.textContent = full.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          strIndex = (strIndex + 1) % typeStrings.length;
          setTimeout(tick, pauseStart);
          return;
        }
      }
      setTimeout(tick, deleting ? deleteSpeed : typeSpeed);
    }

    tick();
  } else if (typeTextEl) {
    typeTextEl.textContent = typeStrings[0];
  }

  /* ---------- Back to top ---------- */
  const backTop = document.getElementById("back-top");
  function toggleBackTop() {
    if (!backTop) return;
    backTop.classList.toggle("is-visible", window.scrollY > 300);
  }
  window.addEventListener("scroll", toggleBackTop, { passive: true });
  toggleBackTop();

  backTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------- CV modal ---------- */
  const cvModal = document.getElementById("cv-modal");
  const openCvBtn = document.getElementById("open-cv-modal");
  const cvModalClose = document.getElementById("cv-modal-close");
  const cvModalBackdrop = document.getElementById("cv-modal-backdrop");

  function closeCvModal() {
    if (!cvModal) return;
    cvModal.classList.remove("is-open");
    cvModal.setAttribute("aria-hidden", "true");
    cvModal.hidden = true;
    if (!projectModal?.classList.contains("is-open")) document.body.style.overflow = "";
  }

  function openCvModal() {
    if (!cvModal) return;
    cvModal.hidden = false;
    cvModal.classList.add("is-open");
    cvModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  openCvBtn?.addEventListener("click", openCvModal);
  cvModalClose?.addEventListener("click", closeCvModal);
  cvModalBackdrop?.addEventListener("click", closeCvModal);

  /* ---------- Project details modal + tabs ---------- */
  const projectModal = document.getElementById("project-modal");
  const projectModalTitle = document.getElementById("project-modal-title");
  const projectModalClose = document.getElementById("project-modal-close");
  const projectModalBackdrop = document.getElementById("project-modal-backdrop");
  const stackEportfolio = document.getElementById("project-stack-eportfolio");
  const stackAutomation = document.getElementById("project-stack-automation");

  const projectModalTitles = {
    eportfolio: "AI-accelerated web deployment (ePortfolio 2026)",
    automation: "AI & automation workflows (current)",
  };

  function initTabsIn(container) {
    const root = container?.querySelector?.("[data-tabs]") || container;
    if (!root || !root.matches?.("[data-tabs]")) return;
    if (root.dataset.tabsBound) return;
    root.dataset.tabsBound = "1";
    const tabs = root.querySelectorAll(".tabs__tab");
    const panels = root.querySelectorAll(".tabs__panel");
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t, j) => {
          t.setAttribute("aria-selected", j === i ? "true" : "false");
          if (panels[j]) panels[j].classList.toggle("is-active", j === i);
        });
      });
    });
  }

  function resetTabsToFirst(container) {
    const root = container?.querySelector?.("[data-tabs]");
    if (!root) return;
    const tabs = root.querySelectorAll(".tabs__tab");
    const panels = root.querySelectorAll(".tabs__panel");
    tabs.forEach((t, i) => {
      t.setAttribute("aria-selected", i === 0 ? "true" : "false");
      if (panels[i]) panels[i].classList.toggle("is-active", i === 0);
    });
  }

  document.querySelectorAll("#project-modal [data-tabs]").forEach(initTabsIn);

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove("is-open");
    projectModal.setAttribute("aria-hidden", "true");
    projectModal.hidden = true;
    if (!cvModal?.classList.contains("is-open")) document.body.style.overflow = "";
  }

  function openProjectModal(key) {
    if (!projectModal || !projectModalTitle) return;
    if (stackEportfolio) {
      stackEportfolio.hidden = key !== "eportfolio";
      if (key === "eportfolio") initTabsIn(stackEportfolio);
    }
    if (stackAutomation) {
      stackAutomation.hidden = key !== "automation";
      if (key === "automation") initTabsIn(stackAutomation);
    }
    projectModalTitle.textContent = projectModalTitles[key] || "Project details";
    const stack = key === "eportfolio" ? stackEportfolio : stackAutomation;
    resetTabsToFirst(stack);
    projectModal.hidden = false;
    projectModal.classList.add("is-open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  document.querySelectorAll("[data-open-project]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-open-project");
      if (key === "eportfolio" || key === "automation") openProjectModal(key);
    });
  });

  projectModalClose?.addEventListener("click", closeProjectModal);
  projectModalBackdrop?.addEventListener("click", closeProjectModal);

  /* ---------- Contact form → mailto ---------- */
  const contactForm = document.getElementById("contact-form");
  contactForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact-name")?.value?.trim() || "";
    const email = document.getElementById("contact-email")?.value?.trim() || "";
    const message = document.getElementById("contact-message")?.value?.trim() || "";

    if (!name || !email || !message) {
      alert("Please fill in name, email, and message.");
      return;
    }

    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `From: ${name} <${email}>\n\n${message}\n`
    );
    window.location.href = `mailto:rogerngwork@gmail.com?subject=${subject}&body=${body}`;
  });
})();
