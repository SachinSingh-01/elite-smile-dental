/**
 * Elite Smile Dental Clinic — Premium Script
 * Full-featured: cursor, preloader, scroll effects,
 * counters, parallax, sticky header, testimonials, form validation
 */

document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
     1. PRELOADER
     ============================================ */
  const preloader = document.getElementById("preloader");
  if (preloader) {
    // Minimum 1.8s so the animation plays, then hide
    setTimeout(() => {
      preloader.classList.add("done");
      preloader.addEventListener("transitionend", () => preloader.remove(), { once: true });
    }, 1900);
  }


  /* ============================================
     2. CUSTOM CURSOR
     ============================================ */
  const cursorDot  = document.getElementById("cursor-dot");
  const cursorRing = document.getElementById("cursor-ring");

  if (cursorDot && cursorRing && window.matchMedia("(hover: hover)").matches) {
    let mx = -100, my = -100;   // dot position
    let rx = -100, ry = -100;   // ring position (lagged)

    const moveCursor = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };

    document.addEventListener("mousemove", moveCursor, { passive: true });

    // Smooth ring lag via rAF
    const animateCursor = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;

      cursorDot.style.left  = mx + "px";
      cursorDot.style.top   = my + "px";
      cursorRing.style.left = rx + "px";
      cursorRing.style.top  = ry + "px";

      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    // Scale dot on interactive elements
    const interactiveEls = "a, button, [role='button'], .service-card, .pro-card, .gallery-item";
    document.querySelectorAll(interactiveEls).forEach(el => {
      el.addEventListener("mouseenter", () => cursorDot.style.transform = "translate(-50%, -50%) scale(2.5)");
      el.addEventListener("mouseleave", () => cursorDot.style.transform = "translate(-50%, -50%) scale(1)");
    });

    document.addEventListener("mouseleave", () => {
      cursorDot.style.opacity  = "0";
      cursorRing.style.opacity = "0";
    });
    document.addEventListener("mouseenter", () => {
      cursorDot.style.opacity  = "1";
      cursorRing.style.opacity = "0.6";
    });
  }


  /* ============================================
     3. STICKY HEADER
     ============================================ */
  const header = document.getElementById("header");

  const updateHeader = () => {
    if (window.scrollY > 60) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader(); // run once on load


  /* ============================================
     4. HAMBURGER / MOBILE NAV
     ============================================ */
  const hamburger = document.getElementById("hamburger");
  const navMenu   = document.getElementById("nav-menu");
  const navLinks  = document.querySelectorAll(".nav-link, .nav-cta");

  // Overlay backdrop
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 998; opacity: 0; pointer-events: none;
    transition: opacity 0.4s ease; backdrop-filter: blur(3px);
  `;
  document.body.appendChild(overlay);

  const openNav = () => {
    navMenu.classList.add("active");
    hamburger.classList.add("active");
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    document.body.style.overflow = "hidden";
  };

  const closeNav = () => {
    navMenu.classList.remove("active");
    hamburger.classList.remove("active");
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    document.body.style.overflow = "";
  };

  hamburger.addEventListener("click", () => {
    navMenu.classList.contains("active") ? closeNav() : openNav();
  });

  hamburger.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navMenu.classList.contains("active") ? closeNav() : openNav();
    }
  });

  navLinks.forEach(link => link.addEventListener("click", closeNav));
  overlay.addEventListener("click", closeNav);

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeNav();
  });


  /* ============================================
     5. SCROLL REVEAL ANIMATIONS
     ============================================ */
  const revealEls = document.querySelectorAll(
    ".reveal-up, .reveal-left, .reveal-right"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach(el => revealObserver.observe(el));


  /* ============================================
     6. ANIMATED COUNTERS
     ============================================ */
  const counters = document.querySelectorAll(".counter");
  let countersStarted = false;

  const easeOutQuad = (t) => t * (2 - t);

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start    = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeOutQuad(progress);
      el.textContent = Math.floor(eased * target).toLocaleString();

      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };

    requestAnimationFrame(update);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          counters.forEach(c => animateCounter(c));
          countersStarted = true;
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.3 }
  );

  if (counters.length > 0) {
    counterObserver.observe(counters[0]);
  }


  /* ============================================
     7. PARALLAX HERO BACKGROUND
     ============================================ */
  const parallaxBg = document.getElementById("parallaxBg");

  if (parallaxBg && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const rate    = scrollY * 0.35;
          parallaxBg.style.transform = `translateY(${rate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }


  /* ============================================
     8. TESTIMONIALS CAROUSEL
     ============================================ */
  const track = document.getElementById("testimonialsTrack");
  const dotsContainer = document.getElementById("testimonialDots");

  if (track && dotsContainer) {
    const cards     = track.querySelectorAll(".testimonial-card");
    let   activeIdx = 0;
    let   autoTimer = null;

    // Build dots
    cards.forEach((_, i) => {
      const dot = document.createElement("div");
      dot.classList.add("t-dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll(".t-dot");

    const goTo = (index) => {
      activeIdx = Math.max(0, Math.min(index, cards.length - 1));
      const cardWidth = cards[0].offsetWidth + 24; // gap
      track.scrollTo({ left: activeIdx * cardWidth, behavior: "smooth" });
      dots.forEach((d, i) => d.classList.toggle("active", i === activeIdx));
    };

    // Sync dots on scroll
    track.addEventListener("scroll", () => {
      const cardWidth = cards[0].offsetWidth + 24;
      const idx = Math.round(track.scrollLeft / cardWidth);
      if (idx !== activeIdx) {
        activeIdx = idx;
        dots.forEach((d, i) => d.classList.toggle("active", i === activeIdx));
      }
    }, { passive: true });

    // Auto-play
    const startAuto = () => {
      autoTimer = setInterval(() => {
        goTo((activeIdx + 1) % cards.length);
      }, 4500);
    };

    const stopAuto = () => clearInterval(autoTimer);

    track.addEventListener("mouseenter", stopAuto);
    track.addEventListener("mouseleave", startAuto);
    track.addEventListener("touchstart",  stopAuto, { passive: true });
    track.addEventListener("touchend",    startAuto, { passive: true });

    startAuto();
  }


  /* ============================================
     9. BACK TO TOP BUTTON
     ============================================ */
  const backToTop = document.getElementById("backToTop");

  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    }, { passive: true });

    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }


  /* ============================================
     10. GALLERY LIGHTBOX
     ============================================ */
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (galleryItems.length > 0) {
    // Create lightbox
    const lightbox = document.createElement("div");
    lightbox.id = "lightbox";
    lightbox.style.cssText = `
      position: fixed; inset: 0; background: rgba(0,0,0,0.92);
      z-index: 9000; display: flex; align-items: center; justify-content: center;
      opacity: 0; pointer-events: none; transition: opacity 0.4s ease;
      cursor: none; padding: 20px;
    `;

    const lbImg = document.createElement("img");
    lbImg.style.cssText = `
      max-width: 90vw; max-height: 88vh; border-radius: 12px;
      object-fit: contain; transform: scale(0.9);
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      box-shadow: 0 30px 80px rgba(0,0,0,0.5);
    `;

    const lbClose = document.createElement("button");
    lbClose.textContent = "×";
    lbClose.style.cssText = `
      position: absolute; top: 20px; right: 28px; background: none;
      border: 1.5px solid rgba(255,255,255,0.3); color: white; font-size: 28px;
      width: 46px; height: 46px; border-radius: 50%; cursor: none;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.3s, transform 0.3s;
    `;
    lbClose.addEventListener("mouseenter", () => lbClose.style.background = "rgba(255,255,255,0.15)");
    lbClose.addEventListener("mouseleave", () => lbClose.style.background = "none");

    lightbox.appendChild(lbImg);
    lightbox.appendChild(lbClose);
    document.body.appendChild(lightbox);

    const openLightbox = (src, alt) => {
      lbImg.src = src;
      lbImg.alt = alt;
      lightbox.style.opacity = "1";
      lightbox.style.pointerEvents = "auto";
      document.body.style.overflow = "hidden";
      setTimeout(() => lbImg.style.transform = "scale(1)", 50);
    };

    const closeLightbox = () => {
      lightbox.style.opacity = "0";
      lightbox.style.pointerEvents = "none";
      lbImg.style.transform = "scale(0.9)";
      document.body.style.overflow = "";
    };

    galleryItems.forEach(item => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        if (img) openLightbox(img.src, img.alt);
      });
    });

    lbClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
  }


  /* ============================================
     11. FORM VALIDATION + SUBMISSION
     ============================================ */
  const form = document.getElementById("booking-form");

  if (form) {
    const validateField = (input) => {
      if (!input.value.trim() && input.required) {
        input.classList.add("invalid");
        return false;
      }
      if (input.type === "email" && input.value) {
        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRe.test(input.value)) {
          input.classList.add("invalid");
          return false;
        }
      }
      if (input.type === "tel" && input.value) {
        const telRe = /^[\d\s\+\-\(\)]{7,15}$/;
        if (!telRe.test(input.value)) {
          input.classList.add("invalid");
          return false;
        }
      }
      input.classList.remove("invalid");
      return true;
    };

    // Live validation on blur
    form.querySelectorAll("input, select, textarea").forEach(input => {
      input.addEventListener("blur", () => validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("invalid")) validateField(input);
      });
    });

    // EmailJS is initialised in index.html; form submission is also handled there.
    // This block only runs native validation before the emailjs script fires.
    form.addEventListener("submit", (e) => {
      const fields = form.querySelectorAll("input[required], select[required]");
      let allValid = true;

      fields.forEach(f => {
        if (!validateField(f)) allValid = false;
      });

      if (!allValid) {
        e.preventDefault();
        e.stopImmediatePropagation();
        // Scroll to first invalid field
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) {
          firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
          firstInvalid.focus();
        }
      }
    }, true); // capture phase — runs before EmailJS listener
  }


  /* ============================================
     12. SMOOTH ANCHOR SCROLL
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (id === "#") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });


  /* ============================================
     13. TICKER — PAUSE ON HOVER  (CSS handles it)
     ============================================ */
  // Already handled purely in CSS via .ticker:hover animation-play-state: paused


  /* ============================================
     14. ACTIVE NAV LINK ON SCROLL
     ============================================ */
  const sections   = document.querySelectorAll("section[id]");
  const allNavLinks = document.querySelectorAll(".nav-link");

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          allNavLinks.forEach(link => {
            const href = link.getAttribute("href");
            link.style.fontWeight = href === `#${id}` ? "600" : "";
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(s => sectionObserver.observe(s));


  console.log("✅ Elite Smile Dental Clinic — Loaded Successfully");
});