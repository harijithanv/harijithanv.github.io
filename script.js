/**
 * VICKNESWARAN HARIJITHAN — script.js
 * Handles: particles, typed text, custom cursor, AOS, counters,
 *          skill bars, nav scroll, theme toggle, DNA animation,
 *          molecule visualization, modal, GLightbox, GSAP scroll effects
 */

'use strict';

/* ════════════════════════════════════════════════════════
   UTILITY
════════════════════════════════════════════════════════ */
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const on  = (el, ev, fn) => el && el.addEventListener(ev, fn);

/* ════════════════════════════════════════════════════════
   INIT — wait for DOM
════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initAOS();
  initTyped();
  initParticles();
  initDNAHelix();
  initCursor();
  initScrollProgress();
  initNavbar();
  initThemeToggle();
  initCounters();
  initSkillBars();
  initBackToTop();
  initModal();
  initMolecule();
  initGSAP();
  initGallery();
  initHeroStats();

  qs('#footerYear').textContent = new Date().getFullYear();
});

/* ════════════════════════════════════════════════════════
   AOS (Animate on Scroll)
════════════════════════════════════════════════════════ */
function initAOS() {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 80,
    delay: 0,
  });
}

/* ════════════════════════════════════════════════════════
   TYPED TEXT
════════════════════════════════════════════════════════ */
function initTyped() {
  const el = qs('#typedText');
  if (!el) return;

  const words = [
 "Biomedical Scientist",
 "Junior Medical Laboratory Technologist",
 "Antimicrobial Resistance Researcher",
 "Systematic Reviewer",
 "Future Molecular Biologist",
 "Science Communicator"
];

  let wordIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const word = words[wordIdx];

    if (!deleting) {
      el.textContent = word.slice(0, ++charIdx);
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      el.textContent = word.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(type, deleting ? 45 : 80);
  }

  setTimeout(type, 900);
}

/* ════════════════════════════════════════════════════════
   HERO STAT COUNTERS (fast version for hero)
════════════════════════════════════════════════════════ */
function initHeroStats() {
  const nums = qsa('.stat-num[data-count]');
  nums.forEach(el => {
    const target = +el.dataset.count;
    animateCount(el, 0, target, 1500);
  });
}

function animateCount(el, start, end, duration) {
  let startTime = null;
  function step(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (end - start) * eased);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = end;
  }
  requestAnimationFrame(step);
}

/* ════════════════════════════════════════════════════════
   INTERSECTION-TRIGGERED COUNTERS (section counters)
════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = qsa('.counter[data-target]');
  if (!counters.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      animateCount(el, 0, target, 1800);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => obs.observe(c));
}

/* ════════════════════════════════════════════════════════
   SKILL BARS
════════════════════════════════════════════════════════ */
function initSkillBars() {
  const fills = qsa('.skill-fill[data-width]');
  if (!fills.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('animated');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.3 });

  fills.forEach(f => obs.observe(f));
}

/* ════════════════════════════════════════════════════════
   PARTICLE CANVAS
════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = qs('#particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.8 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.a  = Math.random() * 0.55 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100,212,228,${this.a})`;
      ctx.fill();
    }
  }

  const COUNT = Math.min(90, Math.floor(W * H / 12000));
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  /* Draw connection lines */
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(26,143,160,${0.25 * (1 - d / 110)})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ════════════════════════════════════════════════════════
   DNA HELIX (SVG injected)
════════════════════════════════════════════════════════ */
function initDNAHelix() {
  const container = qs('#dnaRungs');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 80 480');
  svg.setAttribute('width', '80');
  svg.setAttribute('height', '480');

  const RUNGS = 18;
  for (let i = 0; i < RUNGS; i++) {
    const t  = (i / RUNGS) * Math.PI * 4;
    const y  = (i / RUNGS) * 460 + 10;
    const x1 = 40 + Math.sin(t) * 30;
    const x2 = 40 + Math.sin(t + Math.PI) * 30;

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y);
    line.setAttribute('stroke', 'rgba(100,212,228,0.6)');
    line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);

    ['#1a8fa0', '#24b8cc'].forEach((col, ci) => {
      const cx = ci === 0 ? x1 : x2;
      const c  = document.createElementNS(svgNS, 'circle');
      c.setAttribute('cx', cx);
      c.setAttribute('cy', y);
      c.setAttribute('r', '3.5');
      c.setAttribute('fill', col);
      svg.appendChild(c);
    });
  }
  container.appendChild(svg);
}

/* ════════════════════════════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════════════════════════════ */
function initCursor() {
  const dot  = qs('#cursorDot');
  const ring = qs('#cursorRing');
  if (!dot || !ring || window.matchMedia('(pointer:coarse)').matches) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    dot.style.left  = `${mx}px`;
    dot.style.top   = `${my}px`;
    ring.style.left = `${rx}px`;
    ring.style.top  = `${ry}px`;
    requestAnimationFrame(loop);
  }
  loop();

  qsa('a, button, [data-hover]').forEach(el => {
    on(el, 'mouseenter', () => document.body.classList.add('cursor-hover'));
    on(el, 'mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ════════════════════════════════════════════════════════
   SCROLL PROGRESS
════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = qs('#scrollProgress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
}

/* ════════════════════════════════════════════════════════
   NAVBAR
════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = qs('#navbar');
  const ham    = qs('#navHamburger');
  const links  = qs('#navLinks');
  const navLinkEls = qsa('.nav-link');

  /* Scroll: add .scrolled class */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger */
  on(ham, 'click', () => {
    const open = links.classList.toggle('open');
    ham.setAttribute('aria-expanded', open);
    ham.classList.toggle('active', open);
  });

  /* Close mobile menu on link click */
  navLinkEls.forEach(l => on(l, 'click', () => {
    links.classList.remove('open');
    ham?.setAttribute('aria-expanded', 'false');
  }));

  /* Active link highlight on scroll */
  const sections = qsa('section[id]');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinkEls.forEach(l => {
          l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`);
        });
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => obs.observe(s));
}

/* ════════════════════════════════════════════════════════
   THEME TOGGLE
════════════════════════════════════════════════════════ */
function initThemeToggle() {
  const btn  = qs('#themeToggle');
  const body = document.body;

  /* Restore saved preference */
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') body.classList.add('dark-mode');

  on(btn, 'click', () => {
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    btn.setAttribute('aria-pressed', isDark);
  });
}

/* ════════════════════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  on(btn, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ════════════════════════════════════════════════════════
   ABSTRACT MODAL
════════════════════════════════════════════════════════ */
const abstracts = {
  'amr-review': {
    title: 'Systematic Review: Comparative Multidrug Resistance Profiles of P. aeruginosa and A. baumannii in ICU Settings in South Asia',
    body:  `Background: Antimicrobial resistance (AMR) in nosocomial pathogens represents a critical global health challenge. Pseudomonas aeruginosa and Acinetobacter baumannii are leading causative agents of healthcare-associated infections in intensive care settings.\n\nObjective: This systematic review aimed to compare the multidrug resistance profiles of P. aeruginosa and A. baumannii isolated from ICU patients across South Asian healthcare facilities.\n\nMethods: A comprehensive literature search was conducted across PubMed, Scopus, and Web of Science. Following PRISMA guidelines, 450+ articles were screened, with 25 studies meeting the inclusion criteria. Quality assessment was performed using the Newcastle–Ottawa Scale.\n\nExpected Outcomes: The review is expected to highlight significant carbapenem and colistin resistance trends, identify gaps in South Asian AMR surveillance, and provide recommendations for empirical antibiotic therapy in regional ICU settings.`,
  },
  'gram-negative': {
    title: 'Emerging Antibiotic Resistance in Gram-Negative Bacteria: Mechanisms, Epidemiology and Therapeutic Challenges',
    body:  `Overview: This review examines the rapidly evolving landscape of antibiotic resistance in clinically critical gram-negative bacteria, with particular focus on ESKAPE pathogens.\n\nKey Topics: Molecular mechanisms of resistance including β-lactamase production (ESBL, KPC, NDM), outer membrane permeability alterations, efflux pump upregulation, and target site modifications. Epidemiological trends across global WHO regions. Current and emerging therapeutic strategies including combination therapy, phage therapy, and novel antimicrobial agents.\n\nPresentation: This work was presented as a research poster at a national undergraduate conference, receiving recognition for scientific rigor and visual communication quality.`,
  },
};

function showAbstract(key) {
  const data    = abstracts[key];
  const overlay = qs('#abstractModal');
  if (!data || !overlay) return;

  qs('#modalTitle').textContent = data.title;
  qs('#modalBody').innerHTML = data.body.replace(/\n\n/g, '</p><p>').replace(/^(.*)$/, '<p>$1</p>');
  overlay.classList.add('open');
  overlay.focus?.();
}

function initModal() {
  const overlay = qs('#abstractModal');
  const closeBtn = qs('#modalClose');
  if (!overlay) return;

  on(closeBtn, 'click', () => overlay.classList.remove('open'));
  on(overlay, 'click', e => { if (e.target === overlay) overlay.classList.remove('open'); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('open');
  });
}

/* Make showAbstract globally available for inline onclick */
window.showAbstract = showAbstract;

/* ════════════════════════════════════════════════════════
   CITE / BIBTEX COPY
════════════════════════════════════════════════════════ */
window.copyBibtex = function() {
  const bibtex = `@article{tele2024gramNeg,
  author  = {Tele, Marvic},
  title   = {Emerging Antibiotic Resistance in Gram-Negative Bacteria: Mechanisms, Epidemiology and Therapeutic Challenges},
  year    = {2024},
  journal = {Conference Proceedings},
  note    = {Poster Presentation}
}`;
  navigator.clipboard?.writeText(bibtex)
    .then(() => showToast('BibTeX copied to clipboard!'))
    .catch(() => showToast('Copy text manually from the abstract.'));
};

function showToast(msg) {
  let toast = qs('#toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed;bottom:80px;right:28px;z-index:9999;
      background:var(--teal);color:#fff;
      padding:12px 22px;border-radius:50px;
      font-size:0.85rem;font-weight:500;
      box-shadow:0 4px 20px rgba(26,143,160,0.5);
      opacity:0;transition:opacity 0.3s;
      font-family:'DM Sans',sans-serif;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  setTimeout(() => toast.style.opacity = '0', 2800);
}

/* ════════════════════════════════════════════════════════
   CONTACT MOLECULE (SVG network animation)
════════════════════════════════════════════════════════ */
function initMolecule() {
  const container = qs('#contactMolecule');
  if (!container) return;

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '-110 -110 220 220');
  svg.setAttribute('width', '220');
  svg.setAttribute('height', '220');

  /* Nodes: centre + 6 surrounding */
  const nodes = [
    { x: 0, y: 0, r: 14, fill: '#1a8fa0', label: 'AMR' },
    { x: 0, y: -75, r: 9, fill: '#24b8cc', label: '' },
    { x: 65, y: -37, r: 9, fill: '#24b8cc', label: '' },
    { x: 65, y:  37, r: 9, fill: '#c9a84c', label: '' },
    { x: 0, y:  75, r: 9, fill: '#24b8cc', label: '' },
    { x: -65, y:  37, r: 9, fill: '#24b8cc', label: '' },
    { x: -65, y: -37, r: 9, fill: '#c9a84c', label: '' },
  ];

  /* Draw bonds */
  const bonds = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,2],[3,4],[5,6]];
  bonds.forEach(([a, b]) => {
    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', nodes[a].x); line.setAttribute('y1', nodes[a].y);
    line.setAttribute('x2', nodes[b].x); line.setAttribute('y2', nodes[b].y);
    line.setAttribute('stroke', 'rgba(100,212,228,0.2)');
    line.setAttribute('stroke-width', '1.5');
    svg.appendChild(line);
  });

  /* Draw atoms */
  nodes.forEach((n, i) => {
    const g = document.createElementNS(svgNS, 'g');

    const c = document.createElementNS(svgNS, 'circle');
    c.setAttribute('cx', n.x); c.setAttribute('cy', n.y); c.setAttribute('r', n.r);
    c.setAttribute('fill', n.fill);
    c.setAttribute('opacity', '0.85');

    /* Pulse glow for centre */
    if (i === 0) {
      const anim = document.createElementNS(svgNS, 'animate');
      anim.setAttribute('attributeName', 'r');
      anim.setAttribute('values', `${n.r};${n.r * 1.4};${n.r}`);
      anim.setAttribute('dur', '3s');
      anim.setAttribute('repeatCount', 'indefinite');
      c.appendChild(anim);
    }

    g.appendChild(c);

    if (n.label) {
      const t = document.createElementNS(svgNS, 'text');
      t.setAttribute('x', n.x); t.setAttribute('y', n.y + 4.5);
      t.setAttribute('text-anchor', 'middle');
      t.setAttribute('fill', '#fff');
      t.setAttribute('font-size', '7');
      t.setAttribute('font-family', 'DM Serif Display, serif');
      t.setAttribute('pointer-events', 'none');
      t.textContent = n.label;
      g.appendChild(t);
    }

    svg.appendChild(g);
  });

  /* Rotate slowly */
  svg.style.animation = 'ring-rotate 30s linear infinite';
  container.appendChild(svg);
}

/* ════════════════════════════════════════════════════════
   GSAP SCROLL EFFECTS
════════════════════════════════════════════════════════ */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* Parallax hero content */
  gsap.to('.hero-content', {
    y: -60, opacity: 0.4,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  /* Section titles subtle reveal */
  qsa('.section-title').forEach(el => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
    });
  });

  /* Research cards stagger */
  gsap.from('.research-card', {
    y: 40, opacity: 0, stagger: 0.18, duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.research-grid',
      start: 'top 80%',
    },
  });

  /* Experience items stagger */
  gsap.from('.exp-item', {
    x: -30, opacity: 0, stagger: 0.15, duration: 0.7,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.exp-timeline',
      start: 'top 80%',
    },
  });
}

/* ════════════════════════════════════════════════════════
   GLIGHTBOX (gallery)
════════════════════════════════════════════════════════ */
function initGallery() {
  if (typeof GLightbox === 'undefined') return;

  GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    autoplayVideos: false,
  });
}

/* ════════════════════════════════════════════════════════
   SMOOTH ANCHOR SCROLL (fallback for older browsers)
════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ════════════════════════════════════════════════════════
   MOUSE PARALLAX (hero visual)
════════════════════════════════════════════════════════ */
(function initParallax() {
  const frame = qs('.profile-frame');
  if (!frame || window.matchMedia('(max-width:768px)').matches) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    frame.style.transform = `translate(${dx * 10}px, ${dy * 8}px)`;
  });
})();

/* ════════════════════════════════════════════════════════
   PAGE TRANSITION FADE-IN
════════════════════════════════════════════════════════ */
(function pageTransition() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

/* ════════════════════════════════════════════════════════
   REDUCED MOTION RESPECT
════════════════════════════════════════════════════════ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--t-fast', '0.01ms');
  document.documentElement.style.setProperty('--t-med',  '0.01ms');
  document.documentElement.style.setProperty('--t-slow', '0.01ms');
}
