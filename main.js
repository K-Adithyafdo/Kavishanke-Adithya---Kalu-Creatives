/* ==========================================================================
   KALU CREATIVES — site behaviour
   Reads video data from js/data.js (loaded before this file).
   ========================================================================== */

(function () {
  "use strict";

  const isPlaceholderId = (id) => !id || id.startsWith("REPLACE_WITH_");

  const youtubeThumb = (id) => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const youtubeEmbed = (id) => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;

  /* ---------- Portfolio grid ---------- */
  const grid = document.getElementById("portfolioGrid");

  function categoryLabel(cat) {
    return {
      "reels": "Reel",
      "music-videos": "Music Video",
      "documentary": "Documentary",
      "others": "Other"
    }[cat] || cat;
  }

  function buildCard(video) {
    const card = document.createElement("article");
    card.className = "card is-visible";
    card.dataset.category = video.category;

    const placeholder = isPlaceholderId(video.id);
    const isInstagram = video.platform === "instagram";
    const embedClasses = [
      "video-embed",
      placeholder ? "is-placeholder" : "",
      placeholder && isInstagram ? "is-placeholder--instagram" : "",
      isInstagram ? "video-embed--instagram" : "",
    ].filter(Boolean).join(" ");

    card.innerHTML = `
      <div class="card__media">
        <div class="${embedClasses}" data-video-id="${video.id}">
          <img class="video-embed__thumb" alt="${video.title}">
          <button class="video-embed__play" aria-label="${isInstagram ? "View" : "Play"} ${video.title}" ${placeholder ? "tabindex=\"-1\"" : ""}>
            ${isInstagram
              ? `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M7 17L17 7M10 7h7v7" stroke="currentColor" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`
              : `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>`}
          </button>
        </div>
      </div>
      <div class="card__body">
        <div class="card__meta">
          <span>${categoryLabel(video.category)}</span>
          <span>${video.year || ""}</span>
        </div>
        <h3 class="card__title">${video.title}</h3>
      </div>
    `;

    if (!placeholder) {
      const embed = card.querySelector(".video-embed");
      if (isInstagram) {
        // No thumbnail: Instagram doesn't expose one without their (auth-gated) API.
        card.querySelector(".video-embed__thumb").remove();
        embed.addEventListener("click", () => window.open(video.id, "_blank", "noopener"));
      } else {
        card.querySelector(".video-embed__thumb").src = youtubeThumb(video.id);
        embed.addEventListener("click", () => openLightbox(video.id));
      }
    }

    return card;
  }

  function renderGrid() {
    if (!grid || typeof portfolioVideos === "undefined") return;
    grid.innerHTML = "";
    portfolioVideos.forEach((video) => grid.appendChild(buildCard(video)));
  }

  /* ---------- Filters ---------- */
  function initFilters() {
    const buttons = document.querySelectorAll(".filter");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        const filter = btn.getAttribute("data-filter");
        document.querySelectorAll(".card").forEach((card) => {
          const match = filter === "all" || card.dataset.category === filter;
          card.classList.toggle("is-visible", match);
        });
      });
    });
  }

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lightboxFrame = document.getElementById("lightboxFrame");

  function openLightbox(id) {
    if (!lightbox || !lightboxFrame) return;
    lightboxFrame.innerHTML = `<iframe src="${youtubeEmbed(id)}" title="Video player" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightbox || !lightboxFrame) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxFrame.innerHTML = "";
    document.body.style.overflow = "";
  }

  if (lightbox) {
    lightbox.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeLightbox));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
    });
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        navLinks.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  /* ---------- Bottom-bar timecode (decorative, ticks while the page is open) ---------- */
  const timecodeEl = document.getElementById("timecode");
  function startTimecode() {
    if (!timecodeEl) return;
    let frame = 0;
    const fps = 24;
    setInterval(() => {
      frame++;
      const totalSeconds = Math.floor(frame / fps);
      const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const s = String(totalSeconds % 60).padStart(2, "0");
      const f = String(frame % fps).padStart(2, "0");
      timecodeEl.textContent = `${h}:${m}:${s}:${f}`;
    }, 1000 / fps);
  }

  /* ---------- Contact form (submits directly via FormSubmit — see README) ---------- */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    const submitBtn = document.getElementById("contactSubmit");
    const statusEl = document.getElementById("formStatus");
    const idleLabel = submitBtn ? submitBtn.textContent : "SEND MESSAGE";

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (statusEl) { statusEl.textContent = ""; statusEl.classList.remove("form__note--error"); }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "SENDING..."; }

      fetch(`https://formsubmit.co/ajax/${contactForm.action.split("/").pop()}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      })
        .then((res) => {
          if (!res.ok) throw new Error("Request failed");
          return res.json();
        })
        .then(() => {
          contactForm.reset();
          if (statusEl) statusEl.textContent = "MESSAGE SENT — I'll get back to you soon.";
        })
        .catch(() => {
          if (statusEl) {
            statusEl.textContent = "Something went wrong — email kalucreatives.admin@gmail.com directly instead.";
            statusEl.classList.add("form__note--error");
          }
        })
        .finally(() => {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = idleLabel; }
        });
    });
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderGrid();
    initFilters();
    startTimecode();
  });
})();
