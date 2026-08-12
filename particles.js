/* ==========================================================================
   KALU CREATIVES — dust particle background
   Ambient drifting motes on a fixed canvas; scatter away from the cursor.
   ========================================================================== */

(function () {
  "use strict";

  const canvas = document.getElementById("dustCanvas");
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext("2d");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const INFLUENCE_RADIUS = 130;
  const PUSH_STRENGTH = 1.6;
  const FRICTION = 0.94;
  const AMBIENT_ACCEL = 0.012;
  const MAX_AMBIENT_SPEED = 0.35;

  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let particles = [];
  let mouse = { x: -9999, y: -9999, active: false };
  let rafId = null;

  function particleCount() {
    const area = window.innerWidth * window.innerHeight;
    const base = Math.round(area / 12000);
    return Math.max(40, Math.min(base, 140));
  }

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 1.6 + 0.4,
      baseOpacity: Math.random() * 0.4 + 0.15,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.015 + 0.005,
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const target = particleCount();
    if (particles.length < target) {
      while (particles.length < target) particles.push(makeParticle());
    } else if (particles.length > target) {
      particles.length = target;
    }
  }

  function step(time) {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      // gentle ambient wander + slow upward drift, like dust in a light beam
      p.vx += (Math.random() - 0.5) * AMBIENT_ACCEL;
      p.vy += (Math.random() - 0.5) * AMBIENT_ACCEL - 0.0015;

      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < INFLUENCE_RADIUS && dist > 0.01) {
          const force = (1 - dist / INFLUENCE_RADIUS) * PUSH_STRENGTH;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      }

      p.vx *= FRICTION;
      p.vy *= FRICTION;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > MAX_AMBIENT_SPEED * 4) {
        // allow bursts from the cursor to move faster, but cap runaway speed
        const scale = (MAX_AMBIENT_SPEED * 4) / speed;
        p.vx *= scale;
        p.vy *= scale;
      }

      p.x += p.vx;
      p.y += p.vy;

      // wrap around edges with a small margin
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      const twinkle = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(p.phase + time * p.twinkleSpeed);
      const opacity = p.baseOpacity * twinkle;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 242, 239, ${opacity.toFixed(3)})`;
      ctx.fill();
    }

    rafId = requestAnimationFrame(step);
  }

  function onPointerMove(x, y) {
    mouse.x = x;
    mouse.y = y;
    mouse.active = true;
  }

  function init() {
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY), { passive: true });
    window.addEventListener("mouseleave", () => { mouse.active = false; });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches && e.touches[0]) onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!rafId) {
        rafId = requestAnimationFrame(step);
      }
    });

    rafId = requestAnimationFrame(step);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
