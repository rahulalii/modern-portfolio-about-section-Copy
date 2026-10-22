/* ============================================================
   ALEX MERCER — PORTFOLIO JS
   Animations, Interactions, and Dynamic Behavior
   ============================================================ */

'use strict';

// ─── DOM READY ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initPortfolioFilter();
  initModal();
  initTestimonialSlider();
  initContactForm();
  initBackToTop();
  initParallax();
  initMarqueeHover();
});

// ─── CUSTOM CURSOR ────────────────────────────────────────
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = document.querySelectorAll('a, button, .filter-btn, .project-card, .service-card, .skill-tag');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovered');
      follower.classList.add('hovered');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovered');
      follower.classList.remove('hovered');
    });
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
  });
}

// ─── NAVBAR ───────────────────────────────────────────────
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }, { passive: true });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ─── MOBILE MENU ──────────────────────────────────────────
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  const toggle = () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);

  document.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) toggle();
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || el.style.transitionDelay || '0') * 100;
        setTimeout(() => {
          el.classList.add('revealed');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));

  // Apply CSS delays via data-delay attribute for portfolio cards
  document.querySelectorAll('[data-delay]').forEach(el => {
    const delay = parseInt(el.dataset.delay);
    el.style.transitionDelay = (delay * 0.12) + 's';
  });
}

// ─── NUMBER COUNTERS ──────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.stat-num');
  let started = false;

  const startCounting = () => {
    if (started) return;
    started = true;

    counters.forEach(counter => {
      const target = parseInt(counter.dataset.target);
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;

      const update = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
        } else {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        }
      };
      update();
    });
  };

  const hero = document.querySelector('.hero-stats');
  if (!hero) return;

  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      setTimeout(startCounting, 600);
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(hero);
}

// ─── PORTFOLIO FILTER ─────────────────────────────────────
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 50);
          });
        } else {
          card.style.transition = 'opacity 0.3s ease';
          card.style.opacity = '0';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 300);
        }
      });
    });
  });
}

// ─── CASE STUDY MODAL ─────────────────────────────────────
const projectData = [
  {
    title: 'Luminary — Brand Identity',
    tag: 'Branding',
    color: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
    overview: 'Luminary Wellness needed a complete brand overhaul to position themselves in the premium wellness space. We crafted a sophisticated visual language that speaks to aspirational wellbeing through refined typography, a calming yet luxurious palette, and a logomark that embodies transformation.',
    challenge: 'The brand existed in a crowded wellness market dominated by generic green-and-white aesthetics. They needed to stand out as a premium offering without alienating their community-focused roots.',
    tools: ['Figma', 'Illustrator', 'Photoshop', 'After Effects'],
    results: [
      { value: '+34%', label: 'Conversion Rate' },
      { value: '2.1x', label: 'Brand Recall' },
      { value: '12k', label: 'New Followers' },
    ]
  },
  {
    title: 'Hexa Tech — Logo System',
    tag: 'Logo Design',
    color: 'linear-gradient(135deg, #1a0a2e, #4a1060)',
    overview: 'A complete geometric logo suite for a growing SaaS platform. The hexagonal system was designed to be modular — working as a standalone icon, a wordmark, and within product UI simultaneously, across all scales and media.',
    challenge: 'Needed a single mark that could work at 16px favicon size all the way to billboard scale, while conveying trust, precision, and innovation in the competitive SaaS space.',
    tools: ['Illustrator', 'Figma', 'Photoshop'],
    results: [
      { value: '3', label: 'Logo Variants' },
      { value: '100%', label: 'Vector Coverage' },
      { value: '5★', label: 'Client Rating' },
    ]
  },
  {
    title: 'Nova Café — Social Kit',
    tag: 'Social Media',
    color: 'linear-gradient(135deg, #0a1628, #0d3b5e)',
    overview: 'A 80+ template social media kit for Nova Café, covering Instagram, TikTok, and Facebook across multiple content categories: daily specials, seasonal promos, event announcements, and brand storytelling.',
    challenge: 'The in-house team had no design resources. They needed a system so well-documented that anyone on the team could create on-brand content without design experience.',
    tools: ['Figma', 'Canva Pro', 'Illustrator', 'Photoshop'],
    results: [
      { value: '80+', label: 'Templates' },
      { value: '+220%', label: 'Engagement' },
      { value: '5k', label: 'New Followers' },
    ]
  },
  {
    title: 'Pulse Dashboard UI',
    tag: 'UI Design',
    color: 'linear-gradient(135deg, #071120, #112244)',
    overview: 'Full UI design for Pulse Finance\'s analytics dashboard — an application used by financial advisors to track client portfolios. The design prioritized clarity, data density, and reducing cognitive load in high-stakes financial decisions.',
    challenge: 'Existing UI had 40+ data points per screen with no hierarchy. Users were abandoning workflows midway. The redesign needed to present complex data with clarity and calm.',
    tools: ['Figma', 'Lottie', 'Framer'],
    results: [
      { value: '+62%', label: 'Task Completion' },
      { value: '-44%', label: 'Drop-off Rate' },
      { value: '4.8★', label: 'User Rating' },
    ]
  },
  {
    title: 'Typographic Poster Series',
    tag: 'Print Design',
    color: 'linear-gradient(135deg, #1a0505, #3d0f0f)',
    overview: 'A limited edition series of 6 typographic art prints exploring the emotional power of typefaces. Each poster pairs a single word with expressive layout and color to evoke a specific psychological state.',
    challenge: 'Pure typographic design requires commanding visual hierarchy without imagery. The challenge was making text feel visceral, tactile, and collector-worthy.',
    tools: ['Illustrator', 'InDesign', 'Photoshop'],
    results: [
      { value: '6', label: 'Prints' },
      { value: '100%', label: 'Sold Out' },
      { value: '2x', label: 'Resale Value' },
    ]
  },
  {
    title: 'Verdant — Eco Brand',
    tag: 'Branding',
    color: 'linear-gradient(135deg, #061a12, #0a3320)',
    overview: 'Complete brand identity for Verdant, a sustainable fashion label. The visual language draws from natural forms, raw textures, and earthy depth — communicating that sustainability isn\'t a sacrifice, it\'s an aesthetic philosophy.',
    challenge: 'Most eco brands lean into the same visual clichés: flat greens, leaf icons, and generic sans-serifs. Verdant needed to feel genuinely premium while carrying authentic environmental values.',
    tools: ['Figma', 'Illustrator', 'Photoshop', 'InDesign'],
    results: [
      { value: '+88%', label: 'Brand Perception' },
      { value: '3x', label: 'Press Coverage' },
      { value: '15k', label: 'Units Sold' },
    ]
  },
];

function initModal() {
  const overlay = document.getElementById('modalOverlay');
  const modal = document.getElementById('caseModal');
  const closeBtn = document.getElementById('modalClose');
  const content = document.getElementById('modalContent');
  if (!overlay || !closeBtn) return;

  const open = (projectIndex) => {
    const p = projectData[projectIndex];
    if (!p) return;

    content.innerHTML = `
      <p class="modal-tag">${p.tag}</p>
      <h2>${p.title}</h2>
      <div class="modal-hero" style="background: ${p.color}">
        <span style="opacity:0.15;font-family:var(--font-display);font-size:56px;letter-spacing:4px">${p.tag.toUpperCase()}</span>
      </div>
      <div class="modal-section">
        <h3>Overview</h3>
        <p>${p.overview}</p>
      </div>
      <div class="modal-section">
        <h3>The Challenge</h3>
        <p>${p.challenge}</p>
      </div>
      <div class="modal-section">
        <h3>Tools Used</h3>
        <div class="modal-tools">
          ${p.tools.map(t => `<span class="modal-tool">${t}</span>`).join('')}
        </div>
      </div>
      <div class="modal-section">
        <h3>Client Results</h3>
        <div class="modal-results">
          ${p.results.map(r => `
            <div class="result-stat">
              <strong>${r.value}</strong>
              <span>${r.label}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.view-case-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      open(parseInt(btn.dataset.project));
    });
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// ─── TESTIMONIAL SLIDER ───────────────────────────────────
function initTestimonialSlider() {
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('sliderDots');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoSlide;

  // Determine slides per view
  const getSlidesPerView = () => window.innerWidth <= 680 ? 1 : 2;

  // Create dots
  const totalDots = cards.length;
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = 'dot-btn' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  const updateDots = () => {
    dotsContainer?.querySelectorAll('.dot-btn').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  const getMaxIndex = () => Math.max(0, cards.length - getSlidesPerView());

  const goTo = (index) => {
    current = Math.max(0, Math.min(index, getMaxIndex()));
    const cardWidth = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;
    updateDots();
  };

  prevBtn?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  const startAuto = () => {
    autoSlide = setInterval(() => {
      const next = current >= getMaxIndex() ? 0 : current + 1;
      goTo(next);
    }, 5000);
  };

  const resetAuto = () => { clearInterval(autoSlide); startAuto(); };

  startAuto();

  // Touch/swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 50) {
      goTo(delta > 0 ? current + 1 : current - 1);
      resetAuto();
    }
  });

  window.addEventListener('resize', () => goTo(current));
}

// ─── CONTACT FORM ─────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  const validate = (field, errorId, rule) => {
    const el = document.getElementById(field);
    const err = document.getElementById(errorId);
    if (!el || !err) return true;
    const valid = rule(el.value.trim());
    err.textContent = valid ? '' : (field === 'email' ? 'Please enter a valid email address.' : 'This field is required.');
    el.style.borderColor = valid ? '' : '#ef4444';
    return valid;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameOk = validate('name', 'nameError', v => v.length >= 2);
    const emailOk = validate('email', 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    const msgOk = validate('message', 'messageError', v => v.length >= 10);

    if (!nameOk || !emailOk || !msgOk) return;

    // Simulate submission
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = 'Sending...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = 'Send Message';
      if (successMsg) {
        successMsg.classList.add('show');
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    }, 1800);
  });

  // Live validation reset on input
  ['name', 'email', 'message'].forEach(id => {
    const el = document.getElementById(id);
    el?.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

// ─── BACK TO TOP ──────────────────────────────────────────
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 600);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ─── PARALLAX EFFECT ──────────────────────────────────────
function initParallax() {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.1 + (i * 0.05);
      orb.style.transform = `translateY(${scrolled * speed}px)`;
    });
  }, { passive: true });

  // Mouse parallax on hero
  const hero = document.querySelector('.hero');
  if (!hero) return;

  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 30;
    const y = (clientY / innerHeight - 0.5) * 20;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.5;
      orb.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
    });
  });
}

// ─── MARQUEE HOVER PAUSE ──────────────────────────────────
function initMarqueeHover() {
  const marquee = document.querySelector('.marquee-inner');
  if (!marquee) return;
  marquee.addEventListener('mouseenter', () => marquee.style.animationPlayState = 'paused');
  marquee.addEventListener('mouseleave', () => marquee.style.animationPlayState = 'running');
}

// ─── PAGE LOAD ANIMATION ──────────────────────────────────
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});