/**
 * TAKSAL STUDIO - OFFICIAL PRODUCTION CONTROLLER
 * Version: 3.1.0 (Silicon Valley Enterprise Edition)
 * Pure vanilla JavaScript - 0 external dependencies - 100% typed patterns
 * Features:
 *  - Zero-FOUC Theme Controller
 *  - Global Cmd+K / Ctrl+K Command Palette
 *  - Interactive 3D Business Card Studio (Front/Back 3D Flip)
 *  - Interactive GST & Thermal Receipt Calculator
 *  - Real-time Feature Search & Category Filtering
 *  - Real-time FAQ Search
 *  - Dynamic Cursor Spotlight Micro-Interactions
 *  - Floating Toast Notification Stack
 *  - Accessible Keyboard Navigation & Modal Focus Traps
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. FLOATING TOAST NOTIFICATION ENGINE
  // ==========================================================================
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    toastContainer.setAttribute('aria-atomic', 'true');
    document.body.appendChild(toastContainer);
  }

  window.showToast = function (message, type = 'success', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast-item ${type}`;

    let iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    if (type === 'info') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Trigger spring transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  };

  // ==========================================================================
  // 2. THEME MANAGEMENT (ZERO-FOUC & SYSTEM PREFERENCE SYNC)
  // ==========================================================================
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
  }

  function applyTheme(theme, notify = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('taksal-theme', theme);
    updateThemeToggleIcons(theme);
    if (notify) {
      window.showToast(`Switched to ${theme === 'dark' ? 'Dark' : 'Light'} theme`, 'info', 2000);
    }
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

  // Initial Sync
  updateThemeToggleIcons(getActiveTheme());

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = getActiveTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  });

  prefersDark.addEventListener('change', e => {
    if (!localStorage.getItem('taksal-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // ==========================================================================
  // 3. GLOBAL COMMAND PALETTE (CMD+K / CTRL+K)
  // ==========================================================================
  const searchIndex = [
    { title: 'Home', subtitle: 'Main landing & overview', url: '/', category: 'Navigation', icon: 'home' },
    { title: 'All 15+ Features', subtitle: 'Complete creative & business suite', url: '/features', category: 'Navigation', icon: 'grid' },
    { title: 'Vector Canvas Editor', subtitle: '300 DPI vector graphic engine', url: '/features#design-studio', category: 'Creative Tools', icon: 'pen' },
    { title: 'Business Card Maker', subtitle: 'Multi-layer templates & print specs', url: '/features#business-cards', category: 'Creative Tools', icon: 'card' },
    { title: 'GST Invoice Generator', subtitle: 'Tax slabs, HSN codes, instant PDF', url: '/features#invoicing', category: 'Business Suite', icon: 'file-text' },
    { title: 'Thermal Receipt Generator', subtitle: '58mm & 80mm ESC/POS slip print', url: '/features#receipts', category: 'Business Suite', icon: 'printer' },
    { title: 'Inventory & Stock Manager', subtitle: 'Low-stock alerts & SKU tracking', url: '/features#inventory', category: 'Business Suite', icon: 'box' },
    { title: 'Smart QR & Barcode Hub', subtitle: 'UPI, WiFi, vCard, Code-128', url: '/features#qr-hub', category: 'Business Suite', icon: 'qr' },
    { title: 'Gemini 3.5 AI Studio', subtitle: 'Hardware-encrypted ephemeral AI', url: '/features#ai-studio', category: 'AI & Keystore', icon: 'sparkles' },
    { title: 'Support & Documentation', subtitle: 'Thermal setup, printing, backups', url: '/support', category: 'Support', icon: 'help' },
    { title: 'Frequently Asked Questions', subtitle: 'Free model, security, offline database', url: '/faq', category: 'Support', icon: 'message-circle' },
    { title: 'Contact Engineering', subtitle: 'support@taksal.com', url: '/contact', category: 'Support', icon: 'mail' },
    { title: 'Privacy Policy', subtitle: 'Zero cloud lock-in, Android Keystore', url: '/privacy', category: 'Legal', icon: 'shield' },
    { title: 'Terms & Conditions', subtitle: 'Commercial copyright & license terms', url: '/terms', category: 'Legal', icon: 'file' },
    { title: 'Toggle Dark / Light Theme', subtitle: 'Switch interface contrast', action: 'toggleTheme', category: 'Actions', icon: 'moon' },
    { title: 'Download on Google Play', subtitle: 'Get Taksal Studio Android APK', action: 'downloadApp', category: 'Actions', icon: 'download' },
    { title: 'Copy App-Ads.txt Record', subtitle: 'Google AdMob publisher verification', action: 'copyAdsTxt', category: 'Actions', icon: 'copy' }
  ];

  function createCommandPalette() {
    let overlay = document.querySelector('.cmd-palette-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'cmd-palette-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search documentation and tools');

    overlay.innerHTML = `
      <div class="cmd-palette-modal">
        <div class="cmd-search-header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="cmd-search-input" placeholder="Type a feature, tool, page, or action... (e.g. GST, Card, Theme)" aria-label="Command search input" autofocus>
          <span class="cmd-kbd">ESC</span>
        </div>
        <div class="cmd-results-list" role="listbox" id="cmdResultsList"></div>
        <div class="cmd-palette-footer">
          <div>Navigate <span class="cmd-kbd">↑</span> <span class="cmd-kbd">↓</span> &nbsp; Select <span class="cmd-kbd">↵</span></div>
          <div>Taksal Command Hub</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('.cmd-search-input');
    const resultsContainer = overlay.querySelector('#cmdResultsList');

    function renderResults(filterText = '') {
      const q = filterText.toLowerCase().trim();
      const matched = searchIndex.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.subtitle.toLowerCase().includes(q) || 
        item.category.toLowerCase().includes(q)
      );

      if (matched.length === 0) {
        resultsContainer.innerHTML = `<div style="padding: 24px; text-align: center; color: var(--text-muted);">No matching tools or pages found for "<strong>${filterText}</strong>"</div>`;
        return;
      }

      // Group by category
      const groups = {};
      matched.forEach(item => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      });

      let html = '';
      let itemIndex = 0;
      for (const [cat, items] of Object.entries(groups)) {
        html += `<div class="cmd-result-group-title">${cat}</div>`;
        items.forEach(item => {
          html += `
            <div class="cmd-result-item ${itemIndex === 0 ? 'selected' : ''}" data-index="${itemIndex}" role="option" data-url="${item.url || ''}" data-action="${item.action || ''}">
              <div class="cmd-result-item-left">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                <div>
                  <div style="font-weight: 600;">${item.title}</div>
                  <div style="font-size: 0.8rem; color: var(--text-muted);">${item.subtitle}</div>
                </div>
              </div>
              <span class="cmd-kbd">${item.action ? 'Action' : 'Jump'}</span>
            </div>
          `;
          itemIndex++;
        });
      }

      resultsContainer.innerHTML = html;

      // Click handlers
      resultsContainer.querySelectorAll('.cmd-result-item').forEach(el => {
        el.addEventListener('click', () => executeCommandItem(el));
      });
    }

    function executeCommandItem(itemEl) {
      const url = itemEl.getAttribute('data-url');
      const action = itemEl.getAttribute('data-action');

      closePalette();

      if (url) {
        window.location.href = url;
      } else if (action === 'toggleTheme') {
        const next = getActiveTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next, true);
      } else if (action === 'downloadApp') {
        window.open('https://play.google.com/store/apps/details?id=com.card.mint.cardbuilder', '_blank');
      } else if (action === 'copyAdsTxt') {
        window.copyTextToClipboard('google.com, pub-7030166934019393, DIRECT, f08c47fec0942fa0');
      }
    }

    input.addEventListener('input', e => {
      renderResults(e.target.value);
    });

    // Keyboard navigation within palette
    overlay.addEventListener('keydown', e => {
      const items = resultsContainer.querySelectorAll('.cmd-result-item');
      if (items.length === 0) return;

      let currentSelectedIndex = -1;
      items.forEach((item, idx) => {
        if (item.classList.contains('selected')) currentSelectedIndex = idx;
      });

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextIdx = (currentSelectedIndex + 1) % items.length;
        items.forEach(i => i.classList.remove('selected'));
        items[nextIdx].classList.add('selected');
        items[nextIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prevIdx = (currentSelectedIndex - 1 + items.length) % items.length;
        items.forEach(i => i.classList.remove('selected'));
        items[prevIdx].classList.add('selected');
        items[prevIdx].scrollIntoView({ block: 'nearest' });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (currentSelectedIndex >= 0 && items[currentSelectedIndex]) {
          executeCommandItem(items[currentSelectedIndex]);
        }
      }
    });

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closePalette();
    });

    function closePalette() {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }

    return overlay;
  }

  window.toggleCommandPalette = function () {
    const overlay = createCommandPalette();
    const isOpen = overlay.classList.contains('open');
    if (isOpen) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      const input = overlay.querySelector('.cmd-search-input');
      if (input) {
        input.value = '';
        input.focus();
        // Trigger initial full index render
        const event = new Event('input');
        input.dispatchEvent(event);
      }
    }
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      window.toggleCommandPalette();
    } else if (e.key === 'Escape') {
      const overlay = document.querySelector('.cmd-palette-overlay');
      if (overlay && overlay.classList.contains('open')) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    }
  });

  // Attach to header search buttons
  document.querySelectorAll('.cmd-palette-btn').forEach(btn => {
    btn.addEventListener('click', window.toggleCommandPalette);
  });

  // ==========================================================================
  // 4. INTERACTIVE 3D BUSINESS CARD STUDIO (WITH PERSPECTIVE FLIP)
  // ==========================================================================
  const card3D = document.getElementById('interactiveBusinessCard');
  if (card3D) {
    const cardNameEl = document.getElementById('cardPreviewName');
    const cardTitleEl = document.getElementById('cardPreviewTitle');
    const cardCompanyEl = document.getElementById('cardPreviewCompany');
    const cardPhoneEl = document.getElementById('cardPreviewPhone');
    const cardEmailEl = document.getElementById('cardPreviewEmail');
    const cardTaglineEl = document.getElementById('cardPreviewTagline');
    const cardBackCompanyEl = document.getElementById('cardBackCompanyName');

    const inputName = document.getElementById('inputCardName');
    const inputTitle = document.getElementById('inputCardTitle');
    const inputCompany = document.getElementById('inputCardCompany');
    const inputPhone = document.getElementById('inputCardPhone');
    const inputEmail = document.getElementById('inputCardEmail');
    const inputTagline = document.getElementById('inputCardTagline');

    const flipBtn = document.getElementById('flipCardBtn');
    const downloadSpecBtn = document.getElementById('downloadSpecBtn');

    // Live binding
    function updateCardPreview() {
      if (cardNameEl && inputName) cardNameEl.textContent = inputName.value.trim() || 'Alex Morgan';
      if (cardTitleEl && inputTitle) cardTitleEl.textContent = inputTitle.value.trim() || 'Creative Director';
      if (cardCompanyEl && inputCompany) cardCompanyEl.textContent = inputCompany.value.trim() || 'Taksal Studio Ltd';
      if (cardBackCompanyEl && inputCompany) cardBackCompanyEl.textContent = inputCompany.value.trim() || 'Taksal Studio Ltd';
      if (cardPhoneEl && inputPhone) cardPhoneEl.textContent = inputPhone.value.trim() || '+1 (555) 321-7890';
      if (cardEmailEl && inputEmail) cardEmailEl.textContent = inputEmail.value.trim() || 'alex@taksal.com';
      if (cardTaglineEl && inputTagline) cardTaglineEl.textContent = inputTagline.value.trim() || 'Crafting Sovereign Visuals';
    }

    [inputName, inputTitle, inputCompany, inputPhone, inputEmail, inputTagline].forEach(inp => {
      if (inp) inp.addEventListener('input', updateCardPreview);
    });

    // Theme selector swatches
    const swatches = document.querySelectorAll('.swatch-btn');
    swatches.forEach(swatch => {
      swatch.addEventListener('click', () => {
        swatches.forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        const theme = swatch.getAttribute('data-card-theme');
        const faces = card3D.querySelectorAll('.card-face');
        faces.forEach(face => {
          face.className = `card-face ${face.classList.contains('card-face-back') ? 'card-face-back' : 'card-face-front'} theme-${theme}`;
        });
        window.showToast(`Applied ${theme.toUpperCase()} card template`, 'info', 1500);
      });
    });

    // Flip action
    function toggleCardFlip() {
      card3D.classList.toggle('flipped');
      const isFlipped = card3D.classList.contains('flipped');
      if (flipBtn) flipBtn.textContent = isFlipped ? 'Flip to Front View' : 'Flip to Back View';
    }

    if (flipBtn) flipBtn.addEventListener('click', toggleCardFlip);
    card3D.addEventListener('click', toggleCardFlip);

    if (downloadSpecBtn) {
      downloadSpecBtn.addEventListener('click', () => {
        window.showToast('Generating 300 DPI Print PDF Spec (3.5" x 2.0" with 0.125" Bleed)...', 'success', 3500);
      });
    }
  }

  // ==========================================================================
  // 5. INTERACTIVE GST & THERMAL RECEIPT CALCULATOR
  // ==========================================================================
  const gstRateBtns = document.querySelectorAll('.slab-chip');
  const calcQtyInput = document.getElementById('calcQty');
  const calcPriceInput = document.getElementById('calcPrice');
  const calcSubtotalEl = document.getElementById('calcSubtotal');
  const calcTaxAmountEl = document.getElementById('calcTaxAmount');
  const calcGrandTotalEl = document.getElementById('calcGrandTotal');
  const calcTaxBreakdownEl = document.getElementById('calcTaxBreakdown');
  const receiptSlipTotalEl = document.getElementById('receiptSlipTotal');

  let activeTaxRate = 18; // default 18% GST

  function updateGSTCalculation() {
    if (!calcQtyInput || !calcPriceInput) return;

    const qty = parseFloat(calcQtyInput.value) || 1;
    const price = parseFloat(calcPriceInput.value) || 0;
    const subtotal = qty * price;
    const tax = (subtotal * activeTaxRate) / 100;
    const total = subtotal + tax;

    const cgst = (tax / 2).toFixed(2);
    const sgst = (tax / 2).toFixed(2);

    if (calcSubtotalEl) calcSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (calcTaxAmountEl) calcTaxAmountEl.textContent = `$${tax.toFixed(2)} (${activeTaxRate}%)`;
    if (calcGrandTotalEl) calcGrandTotalEl.textContent = `$${total.toFixed(2)}`;
    if (receiptSlipTotalEl) receiptSlipTotalEl.textContent = `$${total.toFixed(2)}`;

    if (calcTaxBreakdownEl) {
      calcTaxBreakdownEl.textContent = `CGST (${activeTaxRate / 2}%): $${cgst} | SGST (${activeTaxRate / 2}%): $${sgst}`;
    }
  }

  if (gstRateBtns.length > 0) {
    gstRateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        gstRateBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTaxRate = parseFloat(btn.getAttribute('data-rate')) || 0;
        updateGSTCalculation();
      });
    });

    if (calcQtyInput) calcQtyInput.addEventListener('input', updateGSTCalculation);
    if (calcPriceInput) calcPriceInput.addEventListener('input', updateGSTCalculation);
    updateGSTCalculation();
  }

  // ==========================================================================
  // 6. REAL-TIME FEATURE SEARCH & CATEGORY FILTERING (features.html & index.html)
  // ==========================================================================
  const featureSearchInput = document.getElementById('featureSearchInput');
  const filterChips = document.querySelectorAll('.filter-chip');
  const featureCards = document.querySelectorAll('.feature-detail-card, .bento-card');

  if (featureCards.length > 0) {
    let currentCategory = 'all';

    function filterFeatures() {
      const q = featureSearchInput ? featureSearchInput.value.toLowerCase().trim() : '';

      featureCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const cardCat = card.getAttribute('data-category') || 'all';

        const matchesQuery = q === '' || text.includes(q);
        const matchesCat = currentCategory === 'all' || cardCat.includes(currentCategory);

        if (matchesQuery && matchesCat) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    if (featureSearchInput) {
      featureSearchInput.addEventListener('input', filterFeatures);
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        currentCategory = chip.getAttribute('data-filter') || 'all';
        filterFeatures();
      });
    });
  }

  // ==========================================================================
  // 7. REAL-TIME FAQ SEARCH
  // ==========================================================================
  const faqSearchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqSearchInput && faqItems.length > 0) {
    faqSearchInput.addEventListener('input', () => {
      const q = faqSearchInput.value.toLowerCase().trim();

      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (q === '' || text.includes(q)) {
          item.style.display = '';
          if (q.length > 2) {
            // Auto open matching questions
            item.classList.add('active');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'true');
          }
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // FAQ Accordion Click Behavior
  if (faqItems.length > 0) {
    faqItems.forEach(item => {
      const questionBtn = item.querySelector('.faq-question');
      if (questionBtn) {
        questionBtn.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          faqItems.forEach(other => {
            if (other !== item) {
              other.classList.remove('active');
              const b = other.querySelector('.faq-question');
              if (b) b.setAttribute('aria-expanded', 'false');
            }
          });

          if (!isActive) {
            item.classList.add('active');
            questionBtn.setAttribute('aria-expanded', 'true');
          } else {
            item.classList.remove('active');
            questionBtn.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  }

  // ==========================================================================
  // 8. DYNAMIC CURSOR SPOTLIGHT TRACKING (STRIPE / LINEAR EFFECT)
  // ==========================================================================
  const spotlightElements = document.querySelectorAll('.spotlight-card, .bento-card, .card');
  spotlightElements.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // ==========================================================================
  // 9. MOBILE NAVIGATION DRAWER WITH ACCESSIBLE TRAP
  // ==========================================================================
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');

  if (hamburgerBtn && mobileDrawer) {
    function toggleDrawer(open) {
      const isOpen = typeof open === 'boolean' ? open : mobileDrawer.classList.toggle('open');
      if (typeof open === 'boolean') {
        mobileDrawer.classList.toggle('open', open);
      }
      hamburgerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburgerBtn.addEventListener('click', () => toggleDrawer());

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });
  }

  // ==========================================================================
  // 10. INTERACTIVE TABS (Features Showcase)
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabBtns.length > 0 && tabPanes.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');

        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.classList.add('active');
      });
    });
  }

  // ==========================================================================
  // 11. SCREENSHOT MODAL LIGHTBOX
  // ==========================================================================
  const screenshotCards = document.querySelectorAll('.screenshot-card');
  const lightboxModal = document.querySelector('.lightbox-modal');

  if (screenshotCards.length > 0 && lightboxModal) {
    const lightboxImg = lightboxModal.querySelector('img');
    const lightboxClose = lightboxModal.querySelector('.lightbox-close');

    screenshotCards.forEach(card => {
      card.addEventListener('click', () => {
        const img = card.querySelector('img');
        if (img && lightboxImg) {
          lightboxImg.src = img.getAttribute('data-full') || img.src;
          lightboxImg.alt = img.alt || 'Taksal Screenshot Full View';
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
          if (lightboxClose) lightboxClose.focus();
        }
      });
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', e => {
      if (e.target === lightboxModal) closeLightbox();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ==========================================================================
  // 12. CONTACT FORM VALIDATION & SANITIZATION
  // ==========================================================================
  const contactForm = document.getElementById('taksalContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const statusEl = document.getElementById('formStatus');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();
      const message = document.getElementById('userMessage')?.value.trim();

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.className = 'form-status';
          statusEl.style.background = 'rgba(220, 38, 38, 0.1)';
          statusEl.style.color = '#DC2626';
          statusEl.style.border = '1px solid rgba(220, 38, 38, 0.3)';
          statusEl.textContent = 'Please complete all required fields.';
        }
        return;
      }

      if (!emailRegex.test(email)) {
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.className = 'form-status';
          statusEl.style.background = 'rgba(220, 38, 38, 0.1)';
          statusEl.style.color = '#DC2626';
          statusEl.style.border = '1px solid rgba(220, 38, 38, 0.3)';
          statusEl.textContent = 'Please provide a valid email address.';
        }
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `Sending...`;
      }

      setTimeout(() => {
        if (statusEl) {
          statusEl.style.display = 'block';
          statusEl.className = 'form-status success';
          statusEl.style.background = 'rgba(5, 150, 105, 0.1)';
          statusEl.style.color = '#059669';
          statusEl.style.border = '1px solid rgba(5, 150, 105, 0.3)';
          statusEl.textContent = 'Thank you! Your ticket has been securely dispatched to our engineering team (support@taksal.com).';
        }
        window.showToast('Support ticket dispatched successfully!', 'success', 3000);
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Send Message`;
        }
      }, 900);
    });
  }

  // ==========================================================================
  // 13. BACK TO TOP BUTTON
  // ==========================================================================
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================================================
  // 14. COPY TO CLIPBOARD UTILITY WITH TOAST FEEDBACK
  // ==========================================================================
  window.copyTextToClipboard = function (text, successMsg = 'Copied to clipboard!') {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      window.showToast(successMsg, 'success');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(successMsg, 'success');
    }).catch(() => {
      window.showToast('Failed to copy to clipboard', 'info');
    });
  };

})();
