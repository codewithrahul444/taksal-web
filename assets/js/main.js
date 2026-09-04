/**
 * TAKSAL STUDIO - OFFICIAL JAVASCRIPT CONTROLLER
 * Version: 3.0.0
 * Pure vanilla JavaScript - no external dependencies
 */

(function () {
  'use strict';

  // --- 1. Theme Management (Dark / Light) ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('taksal-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taksal-theme', theme);
    updateThemeToggleIcons(theme);
  }

  function updateThemeToggleIcons(theme) {
    themeToggleBtns.forEach(btn => {
      if (theme === 'dark') {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
        btn.setAttribute('aria-label', 'Switch to light theme');
      } else {
        btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
        btn.setAttribute('aria-label', 'Switch to dark theme');
      }
    });
  }

  // Initial Theme Setup
  if (storedTheme) {
    applyTheme(storedTheme);
  } else if (prefersDark.matches) {
    applyTheme('dark');
  } else {
    applyTheme('light');
  }

  // Theme Toggle Click
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  });

  // Listen to OS scheme changes
  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem('taksal-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- 2. Mobile Navigation Drawer ---
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (hamburgerBtn && mobileDrawer) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when clicking a link
    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // --- 3. Interactive Feature Showcase Tabs ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabBtns.length > 0 && tabPanes.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetId);
        if (targetPane) {
          targetPane.classList.add('active');
        }
      });
    });
  }

  // --- 4. FAQ Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all other items in same group
          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const btn = otherItem.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'false');
          });

          // Toggle current
          if (!isActive) {
            item.classList.add('active');
            questionBtn.setAttribute('aria-expanded', 'true');
          }
        });
      }
    });
  }

  // --- 5. Screenshot Modal Lightbox ---
  const screenshotCards = document.querySelectorAll('.screenshot-card');
  const lightboxModal = document.querySelector('.lightbox-modal');

  if (screenshotCards.length > 0 && lightboxModal) {
    const lightboxImg = lightboxModal.querySelector('img');
    const lightboxClose = lightboxModal.querySelector('.lightbox-close');

    screenshotCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img && lightboxImg) {
          // Use high-res webp or png
          lightboxImg.src = img.getAttribute('data-full') || img.src;
          lightboxImg.alt = img.alt || 'Taksal App Screenshot';
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', e => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // --- 6. Contact Form Validation & Handler ---
  const contactForm = document.getElementById('taksalContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const statusEl = document.getElementById('formStatus');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();
      const subject = document.getElementById('userSubject')?.value.trim();
      const message = document.getElementById('userMessage')?.value.trim();

      if (!name || !email || !message) {
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.className = 'form-status callout-warning';
          statusEl.textContent = 'Please complete all required fields.';
        }
        return;
      }

      // Simulate sending feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.className = 'form-status success';
          statusEl.textContent = 'Thank you! Your message has been routed to support@cardmint.app. Our engineering team typically responds within 24–48 hours.';
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }, 1000);
    });
  }

  // --- 7. Back to Top Button ---
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 8. Table of Contents ScrollSpy for Legal Pages ---
  const tocLinks = document.querySelectorAll('.legal-toc .toc-link');
  const legalSections = document.querySelectorAll('.legal-section');

  if (tocLinks.length > 0 && legalSections.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPos = window.scrollY + 140;

      legalSections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // --- 9. Copy to Clipboard Utility ---
  window.copyTextToClipboard = function (text, btnElement) {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showCopyFeedback(btnElement);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      showCopyFeedback(btnElement);
    });
  };

  function showCopyFeedback(btnElement) {
    if (!btnElement) return;
    const originalText = btnElement.textContent;
    btnElement.textContent = 'Copied!';
    btnElement.style.color = '#10B981';
    setTimeout(() => {
      btnElement.textContent = originalText;
      btnElement.style.color = '';
    }, 2000);
  }

})();
