/* ═══════════════════════════════════════════════
   Deepak Bharadwaj — Portfolio JS
   Handles: theme switching (light/dark), mobile nav,
   case study accordion, scroll reveal & smooth scroll
   ═══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Theme Switching (Light / Dark) ───
  const themeToggle = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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

  // Set initial theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Toggle handler
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Listen to OS system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ─── Mobile Navigation ───
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click
    navMenu.querySelectorAll('.nav__link').forEach(link => {
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

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  // ─── Case Study Accordion ───
  const cases = document.querySelectorAll('.case');

  cases.forEach(caseEl => {
    const header = caseEl.querySelector('.case__header');
    const content = caseEl.querySelector('.case__content');
    const title = caseEl.querySelector('.case__title');

    if (!header || !content) return;

    const id = caseEl.id || 'case-' + Math.random().toString(36).substr(2, 6);
    const contentId = id + '-content';
    content.id = contentId;
    header.setAttribute('role', 'button');
    header.setAttribute('tabindex', '0');
    header.setAttribute('aria-expanded', 'false');
    header.setAttribute('aria-controls', contentId);

    const toggle = () => {
      const isOpen = caseEl.classList.toggle('is-open');
      header.setAttribute('aria-expanded', String(isOpen));
    };

    header.addEventListener('click', toggle);
    if (title) {
      title.addEventListener('click', toggle);
      title.style.cursor = 'pointer';
    }

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });

  // Open first case by default
  if (cases.length > 0) {
    const firstCase = cases[0];
    firstCase.classList.add('is-open');
    const firstHeader = firstCase.querySelector('.case__header');
    if (firstHeader) {
      firstHeader.setAttribute('aria-expanded', 'true');
    }
  }

  // ─── Scroll Reveal ───
  const revealElements = document.querySelectorAll(
    '.section__header, .approach__card, .ev__card, .cap__group, .timeline__item, .about__content, .contact__primary-card, .channel-card, .metric'
  );

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const parent = entry.target.parentElement;
            const siblings = parent ? Array.from(parent.querySelectorAll('.reveal')) : [];
            const index = siblings.indexOf(entry.target);
            const delay = Math.min(index * 60, 360);

            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, delay);

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -30px 0px'
      }
    );

    revealElements.forEach(el => observer.observe(el));
  }

  // ─── Copy Email to Clipboard ───
  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    const copyLabel = copyBtn.querySelector('.copy-text') || copyBtn;
    const defaultText = copyLabel.textContent;
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'deepakbharadwaj14@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copyBtn.classList.add('copied');
        if (copyLabel) copyLabel.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          if (copyLabel) copyLabel.textContent = defaultText;
        }, 2200);
      } catch (err) {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand('copy');
          copyBtn.classList.add('copied');
          if (copyLabel) copyLabel.textContent = 'Copied!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            if (copyLabel) copyLabel.textContent = defaultText;
          }, 2200);
        } catch (e) {
          console.error('Could not copy email: ', e);
        }
        document.body.removeChild(textarea);
      }
    });
  }

  // ─── Active Nav Highlight ───
  const navLinks = document.querySelectorAll('.nav__link[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  if (sections.length > 0 && navLinks.length > 0) {
    const sectionObserver = new IntersectionObserver(
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
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    sections.forEach(s => sectionObserver.observe(s));
  }

  // ─── Smooth scroll for anchor links ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.pushState(null, '', targetId);
      }
    });
  });

})();
