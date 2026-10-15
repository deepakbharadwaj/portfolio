/* ═══════════════════════════════════════════════════════════════
   DEEPAK BHARADWAJ — PORTFOLIO CLIENT ENGINE
   Handles: Theme switching (Warm Editorial Cream / Obsidian Dark),
   Mobile pill nav, Case study accordion, Horizontal card links,
   Email clipboard copy, and Interactive globe coordinates
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── 1. Theme Switching (Light / Dark) ───
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const getSavedTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    // Default to light to showcase the signature warm cream editorial look
    return 'light';
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} theme`);
      themeToggle.setAttribute('title', `Switch to ${nextTheme} theme`);
    }
  };

  // Initialize theme
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // ─── 2. Mobile Pill Navigation ───
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on navigation link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // ─── 3. Case Study Accordion ───
  const caseCards = document.querySelectorAll('.case-card');

  caseCards.forEach(card => {
    const header = card.querySelector('.case-card__header');
    if (!header) return;

    const toggleAccordion = () => {
      const isOpen = card.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));
    };

    header.addEventListener('click', toggleAccordion);

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });

  // ─── 4. Horizontal Marquee Card Interaction ───
  // When a user clicks a "Case Study ↗" link inside the marquee,
  // open that specific case study automatically and scroll to it smoothly!
  const marqueeLinks = document.querySelectorAll('.scroll-card__link');
  marqueeLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        const targetCase = document.querySelector(targetHref);
        if (targetCase && targetCase.classList.contains('case-card')) {
          targetCase.classList.add('is-open');
          const header = targetCase.querySelector('.case-card__header');
          if (header) header.setAttribute('aria-expanded', 'true');
        }
      }
    });
  });

  // ─── 5. Interactive Globe Badges Spotlight ───
  const geoPills = document.querySelectorAll('.geo-pill');
  geoPills.forEach(pill => {
    pill.addEventListener('mouseenter', () => {
      geoPills.forEach(p => {
        if (p !== pill) p.style.opacity = '0.7';
      });
    });
    pill.addEventListener('mouseleave', () => {
      geoPills.forEach(p => {
        p.style.opacity = '1';
      });
    });
  });

  // ─── 6. Copy Email to Clipboard ───
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    const copyLabel = copyBtn.querySelector('.copy-text') || copyBtn;
    const defaultLabelText = copyLabel.textContent;

    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'deepakbharadwaj14@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.classList.add('copied');
        copyLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyLabel.textContent = defaultLabelText;
        }, 2200);
      } catch (err) {
        // Fallback for non-secure contexts
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          copyBtn.classList.add('copied');
          copyLabel.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyLabel.textContent = defaultLabelText;
          }, 2200);
        } catch (e) {
          console.error('Could not copy email: ', e);
        }
        document.body.removeChild(textarea);
      }
    });
  }

  // ─── 7. Active Nav Scrollspy ───
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0 && navLinks.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
            });
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '-80px 0px -40% 0px'
      }
    );

    sections.forEach(s => observer.observe(s));
  }

  // ─── 8. Smooth Scroll for Anchor Links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', targetId);
      }
    });
  });

  // ─── 9. Odometer / Meter Reading Count-Up Engine ───
  function initMeterReadings() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Deceleration easing curve (mechanical odometer spin -> smooth settle)
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

    function parseMetric(text) {
      if (!text) return null;
      const clean = text
        .replace(/&minus;/g, '−')
        .replace(/&times;/g, '×')
        .replace(/×/g, '×')
        .trim();
      const prefixMatch = clean.match(/^([−\-\~<>])/);
      const prefix = prefixMatch ? prefixMatch[1] : '';
      const unsigned = prefix ? clean.slice(prefix.length).trim() : clean;

      const match = unsigned.match(/^([0-9]+(?:\.[0-9]+)?)(.*)$/);
      if (!match) return null;

      const numStr = match[1];
      const suffix = match[2] || '';
      const numVal = parseFloat(numStr);
      const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0;

      return {
        prefix: prefix,
        target: numVal,
        decimals: decimals,
        suffix: suffix,
        raw: clean
      };
    }

    function animateMeter(el, parsed, options = {}) {
      if (el.dataset.meterAnimated === 'true') return;
      el.dataset.meterAnimated = 'true';

      const duration = options.duration || 1400; // ms
      const delay = options.delay || 0;
      const parentCard = el.closest('.stat-box') || el.closest('.outcome-stat') || el.closest('.geo-pill');

      if (prefersReducedMotion) {
        el.textContent = parsed.prefix + (parsed.decimals > 0 ? parsed.target.toFixed(parsed.decimals) : Math.round(parsed.target)) + parsed.suffix;
        if (parentCard) parentCard.classList.add('is-meter-done');
        return;
      }

      setTimeout(() => {
        if (parentCard) {
          parentCard.classList.add('is-meter-running');
          parentCard.style.setProperty('--meter-fill', '0%');
        }
        el.classList.add('is-meter-running');

        const startTime = performance.now();
        const startVal = 0;
        const targetVal = parsed.target;

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutExpo(progress);

          const currentVal = startVal + (targetVal - startVal) * easedProgress;
          const formattedVal = parsed.decimals > 0
            ? currentVal.toFixed(parsed.decimals)
            : Math.round(currentVal);

          el.textContent = parsed.prefix + formattedVal + parsed.suffix;

          if (parentCard) {
            parentCard.style.setProperty('--meter-fill', `${(easedProgress * 100).toFixed(1)}%`);
          }

          if (progress < 1) {
            requestAnimationFrame(update);
          } else {
            // Settle exactly on target
            el.textContent = parsed.prefix + (parsed.decimals > 0 ? targetVal.toFixed(parsed.decimals) : Math.round(targetVal)) + parsed.suffix;
            el.classList.remove('is-meter-running');
            el.classList.add('is-meter-done', 'meter-settle');
            if (parentCard) {
              parentCard.classList.remove('is-meter-running');
              parentCard.classList.add('is-meter-done');
              parentCard.style.setProperty('--meter-fill', '100%');
            }
          }
        }

        requestAnimationFrame(update);
      }, delay);
    }

    // Hero stat strip cards (500K+, 99.9%, 5x, 115+)
    const heroStatVals = document.querySelectorAll('.hero-metric-strip .stat-box__val');
    heroStatVals.forEach((valEl, idx) => {
      const parsed = parseMetric(valEl.textContent);
      if (!parsed) return;
      // Pre-initialize to zero so visitor sees the meter run up from the start
      valEl.textContent = parsed.prefix + (parsed.decimals > 0 ? (0).toFixed(parsed.decimals) : '0') + parsed.suffix;
      animateMeter(valEl, parsed, {
        delay: 220 + idx * 120, // Staggered dial ignition
        duration: 1400 + idx * 80
      });
    });

    // Hero globe milestone pills (500K+, 99.9%)
    const globeMilestones = document.querySelectorAll('.geo-pill--milestone .geo-pill__metric');
    globeMilestones.forEach((pillEl, idx) => {
      const parsed = parseMetric(pillEl.textContent);
      if (!parsed) return;
      pillEl.textContent = parsed.prefix + (parsed.decimals > 0 ? (0).toFixed(parsed.decimals) : '0') + parsed.suffix;
      animateMeter(pillEl, parsed, {
        delay: 360 + idx * 140,
        duration: 1400
      });
    });

    // Scroll-triggered meters for outcome stats (case studies)
    const outcomeStatNums = document.querySelectorAll('.outcome-stat__num');
    if ('IntersectionObserver' in window && outcomeStatNums.length > 0) {
      const outcomeObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const parsed = parseMetric(el.textContent);
              if (parsed) {
                el.textContent = parsed.prefix + (parsed.decimals > 0 ? (0).toFixed(parsed.decimals) : '0') + parsed.suffix;
                animateMeter(el, parsed, {
                  delay: 80,
                  duration: 1300
                });
              }
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.3 }
      );

      outcomeStatNums.forEach(numEl => outcomeObserver.observe(numEl));
    }
  }

  // Trigger meter animation on DOM ready / load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMeterReadings);
  } else {
    initMeterReadings();
  }

})();

