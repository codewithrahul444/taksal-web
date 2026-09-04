/**
 * TAKSAL STUDIO - OFFICIAL PRODUCTION CONTROLLER
 * Version: 3.2.0 (Silicon Valley Enterprise Edition)
 * Pure vanilla JavaScript - 0 external dependencies - 100% typed patterns
 * Features:
 *  - Zero-FOUC Theme Controller with System Sync
 *  - Global Cmd+K / Ctrl+K Command Palette with DOM XSS Sanitization
 *  - Interactive 3D Business Card Studio (Vector SVG 300 DPI Export & vCard Generator)
 *  - Interactive GST & Multi-Currency Thermal POS Simulator
 *  - Real-time Feature Search & Category Filtering with Empty States
 *  - Real-time FAQ Search with Group Awareness & Friendly Empty States
 *  - Dynamic Cursor Spotlight Micro-Interactions
 *  - Floating Toast Notification Stack
 *  - Accessible Keyboard Navigation & Focus Traps (WCAG AA)
 *  - Unobtrusive Event Handling & Anti-Spam Honeypot Verification
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. UTILITY: SAFE XML / HTML ESCAPING
  // ==========================================================================
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ==========================================================================
  // 2. FLOATING TOAST NOTIFICATION ENGINE
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

    const textSpan = document.createElement('span');
    textSpan.textContent = message;

    toast.innerHTML = iconSvg;
    toast.appendChild(textSpan);
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

  window.copyTextToClipboard = function (text, successMsg = 'Copied to clipboard!') {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        window.showToast(successMsg, 'success');
      } catch (err) {
        window.showToast('Failed to copy', 'info');
      }
      document.body.removeChild(textarea);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(successMsg, 'success');
    }).catch(() => {
      window.showToast('Failed to copy to clipboard', 'info');
    });
  };

  // ==========================================================================
  // 3. THEME MANAGEMENT (ZERO-FOUC & SYSTEM PREFERENCE SYNC)
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
  // 4. GLOBAL COMMAND PALETTE (CMD+K / CTRL+K) WITH INSTANT SEARCH & FILTERS
  // ==========================================================================
  const searchIndex = [
    { id: 'home', title: 'Home', subtitle: 'Main landing, capabilities & mobile app overview', url: '/', category: 'Pages', icon: 'home', keywords: 'home taksal main start app landing overview showcase' },
    { id: 'features', title: 'All 15+ Features', subtitle: 'Explore the full creative & business suite', url: '/features', category: 'Pages', icon: 'grid', keywords: 'features all overview list capabilities tools suite modules full' },
    { id: 'playground', title: 'Interactive Browser Playground', subtitle: 'Live 3D card preview, palettes & vector customizer', url: '/#interactive-studio', category: 'Creative Tools', icon: 'playground', keywords: 'interactive browser playground test studio 3d business card customizer flip vcard export svg vector preview cmyk 300 dpi demo test card' },
    { id: 'vector-canvas', title: 'Vector Canvas Editor', subtitle: '300 DPI vector graphic engine with CMYK export', url: '/features#vector-canvas', category: 'Creative Tools', icon: 'pen', keywords: 'vector canvas editor 300 dpi design graphics drawing typography layers svg export cmyk resolution' },
    { id: 'business-cards', title: 'Business Card Maker', subtitle: 'Multi-layer templates, print bleeds & live mockups', url: '/features#business-cards', category: 'Creative Tools', icon: 'card', keywords: 'business cards visiting card templates 3d vcard mockup print bleed cut margins visiting' },
    { id: 'logo-creator', title: 'Logo Studio', subtitle: 'Vector shapes, geometric grids & brand seals', url: '/features#logo-creator', category: 'Creative Tools', icon: 'pen', keywords: 'logo maker brand identity vector icon creator emblem monogram watermark seal shapes brandmark' },
    { id: 'brand-kit', title: 'Brand Kit Manager', subtitle: 'Hex swatches, typestyles & vector assets', url: '/features#brand-kit-features', category: 'Creative Tools', icon: 'palette', keywords: 'brand kit colors hex typography fonts swatches assets palette identity style guide' },
    { id: 'invoicing', title: 'GST Invoice Generator', subtitle: 'Automated tax slabs (CGST, SGST, IGST), HSN codes, instant PDF', url: '/features#invoicing-suite', category: 'Business Suite', icon: 'receipt', keywords: 'gst invoice billing tax hsn sac cgst sgst igst pdf bill pos thermal receipts calculation bill maker' },
    { id: 'receipts', title: 'Thermal Receipt Generator', subtitle: '58mm & 80mm ESC/POS slip print via USB & Bluetooth', url: '/features#receipts', category: 'Business Suite', icon: 'printer', keywords: 'thermal receipt printer 58mm 80mm esc pos bluetooth usb billing slips pos slip print cashier roll' },
    { id: 'quotations', title: 'Estimates & Quotations', subtitle: 'Formal pricing quotes with one-tap invoice conversion', url: '/features#quotations', category: 'Business Suite', icon: 'file-text', keywords: 'quotations estimates pricing quotes convert invoice proforma billing formal proposals bidding' },
    { id: 'inventory', title: 'Inventory & Stock Manager', subtitle: 'Low-stock warnings, barcode lookups & SKU tracking', url: '/features#inventory-management', category: 'Business Suite', icon: 'box', keywords: 'inventory stock manager warehouse sku barcode low stock alerts tracking items products quantities' },
    { id: 'qr-hub', title: 'Smart QR & Barcode Hub', subtitle: 'Instant UPI payments, WiFi credentials, vCard & Code-128', url: '/features#smart-qr-hub', category: 'Business Suite', icon: 'qr', keywords: 'qr code barcode generator upi payment wifi vcard code 128 ean scanner quick response contact link' },
    { id: 'ai-studio', title: 'Gemini 3.5 AI Studio', subtitle: 'Hardware-encrypted ephemeral AI for marketing copy', url: '/features#ai-studio-features', category: 'AI & Keystore', icon: 'sparkles', keywords: 'ai studio gemini 3.5 flash copywriting product descriptions prompt encryption intelligence assistant writing' },
    { id: 'security', title: 'Hardware Keystore & AES-256', subtitle: 'Zero-cloud lock-in, hardware enclave SQLite storage', url: '/features#security-features', category: 'AI & Keystore', icon: 'shield', keywords: 'security keystore encryption aes-256 hardware enclave privacy offline zero-knowledge cipher protect safe database' },
    { id: 'about', title: 'About Taksal Studio', subtitle: 'Silicon Valley design meets offline sovereignty', url: '/about', category: 'Pages', icon: 'file-text', keywords: 'about taksal story philosophy team mission creators tech stack' },
    { id: 'support', title: 'Support & Documentation', subtitle: 'Thermal printer setup, backup procedures & troubleshooting', url: '/support', category: 'Support', icon: 'help', keywords: 'support documentation help docs guides manual thermal setup printer backup restore troubleshoot guide tutorial' },
    { id: 'faq', title: 'Frequently Asked Questions', subtitle: '100% Free model, security, offline database & licensing', url: '/faq', category: 'Support', icon: 'message-circle', keywords: 'faq questions answers help free security offline cost pricing license sqlite safe data questions' },
    { id: 'contact', title: 'Contact Engineering', subtitle: 'officialcardmintapp@gmail.com — Get in touch', url: '/contact', category: 'Support', icon: 'mail', keywords: 'contact support email help team engineering feedback bug report inquiry officialcardmintapp@gmail.com write reach' },
    { id: 'privacy', title: 'Privacy Policy', subtitle: 'Zero cloud lock-in, strict offline privacy guarantee', url: '/privacy', category: 'Legal', icon: 'shield', keywords: 'privacy policy legal data protection terms gdpr security permissions privacy rights' },
    { id: 'terms', title: 'Terms & Conditions', subtitle: 'Commercial copyright, perpetual license & use terms', url: '/terms', category: 'Legal', icon: 'file', keywords: 'terms conditions service legal rights copyright license agreement commercial terms' },
    { id: 'toggleTheme', title: 'Toggle Dark / Light Theme', subtitle: 'Switch system appearance contrast mode', action: 'toggleTheme', category: 'Actions', icon: 'moon', keywords: 'dark mode light theme toggle appearance contrast colors theme night day mode' },
    { id: 'downloadApp', title: 'Download Free Android App', subtitle: 'Install Taksal Studio direct from Google Play Store', action: 'downloadApp', category: 'Actions', icon: 'download', keywords: 'download install google play android app apk free store get application install' },
    { id: 'copyAdsTxt', title: 'Copy App-Ads.txt Record', subtitle: 'Copy verified Google AdMob publisher record to clipboard', action: 'copyAdsTxt', category: 'Actions', icon: 'copy', keywords: 'app-ads.txt admob google ads verification publisher record copy code admob pub' }
  ];

  let lastActiveSearchElement = null;
  let activePaletteCategory = 'all';

  function getCmdIconSvg(iconName) {
    switch (iconName) {
      case 'home':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>';
      case 'grid':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>';
      case 'pen':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"></path><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path><path d="M2 2l7.586 7.586"></path><circle cx="11" cy="11" r="2"></circle></svg>';
      case 'card':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"></rect><line x1="2" y1="10" x2="22" y2="10"></line></svg>';
      case 'playground':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>';
      case 'palette':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5"></circle><circle cx="17.5" cy="10.5" r=".5"></circle><circle cx="8.5" cy="7.5" r=".5"></circle><circle cx="6.5" cy="12.5" r=".5"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"></path></svg>';
      case 'receipt':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16l3-2 3 2 3-2 3 2 3-2 3 2V4a2 2 0 0 0-2-2z"></path><line x1="8" y1="6" x2="16" y2="6"></line><line x1="8" y1="10" x2="16" y2="10"></line><line x1="8" y1="14" x2="12" y2="14"></line></svg>';
      case 'printer':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>';
      case 'file-text':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>';
      case 'box':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
      case 'qr':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><path d="M14 14h3v3h-3z"></path><path d="M20 14h1v3h-1z"></path><path d="M14 20h7v1h-7z"></path></svg>';
      case 'sparkles':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.912 5.885L20 12l-6.088 3.115L12 21l-1.912-5.885L4 12l6.088-3.115L12 3z"></path></svg>';
      case 'shield':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
      case 'help':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
      case 'message-circle':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>';
      case 'mail':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>';
      case 'moon':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      case 'download':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>';
      case 'copy':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>';
      case 'file':
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path><polyline points="13 2 13 9 20 9"></polyline></svg>';
      default:
        return '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';
    }
  }

  function highlightMatches(text, query) {
    if (!text) return '';
    if (!query || query.trim() === '') return escapeHtml(text);
    const escapedText = escapeHtml(text);
    const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    return escapedText.replace(regex, '<mark class="cmd-highlight">$1</mark>');
  }

  // Detect Platform Shortcut: ⌘K for Apple (macOS / iOS / iPadOS), Ctrl K for Windows / Linux / Android
  function getShortcutInfo() {
    const ua = navigator.userAgent || '';
    const plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
    const isApple = /Mac|iPhone|iPad|iPod/i.test(plat) || /Macintosh|Mac OS X/i.test(ua);
    return {
      isApple,
      symbol: isApple ? '⌘K' : 'Ctrl K',
      aria: isApple ? 'Cmd+K' : 'Ctrl+K'
    };
  }

  function syncPlatformShortcuts() {
    const { symbol, aria } = getShortcutInfo();
    document.querySelectorAll('.cmd-palette-btn, .mobile-search-trigger, [data-action="command-palette"]').forEach(el => {
      const kbd = el.querySelector('.cmd-kbd, .cmd-kbd-badge, .cmd-kbd-shortcut');
      if (kbd) kbd.textContent = symbol;
      if (el.hasAttribute('aria-label') && (el.getAttribute('aria-label').includes('Command Palette') || el.getAttribute('aria-label').includes('Search'))) {
        el.setAttribute('aria-label', `Open Command Palette (${aria})`);
      }
    });
  }

  // Bind direct click listeners to all trigger buttons
  function bindSearchTriggers() {
    const triggers = document.querySelectorAll('.cmd-palette-btn, .mobile-search-trigger, [data-action="command-palette"]');
    triggers.forEach(btn => {
      btn.style.cursor = 'pointer';
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.setAttribute('aria-expanded', 'false');
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        window.openCommandPalette();
      });
    });
  }

  let paletteRenderer = null;

  function createCommandPalette() {
    let overlay = document.querySelector('.cmd-palette-overlay');
    if (overlay) return overlay;

    overlay = document.createElement('div');
    overlay.className = 'cmd-palette-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Search documentation, features, and tools');

    overlay.innerHTML = `
      <div class="cmd-palette-modal" id="cmdPaletteModal">
        <div class="cmd-search-header">
          <svg class="cmd-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="cmd-search-input" placeholder="Search features, tools, pages, or actions... (e.g. GST, Card, Theme)" aria-label="Command search input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
          <button type="button" class="cmd-clear-btn" aria-label="Clear search">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <button type="button" class="cmd-close-btn" aria-label="Close search (Escape)">
            <span class="cmd-kbd cmd-kbd-esc">ESC</span>
            <svg class="cmd-close-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="cmd-filter-bar" role="tablist" aria-label="Filter search by category">
          <button type="button" class="cmd-filter-chip active" data-category="all" role="tab" aria-selected="true">All</button>
          <button type="button" class="cmd-filter-chip" data-category="tools" role="tab" aria-selected="false">🎨 Creative</button>
          <button type="button" class="cmd-filter-chip" data-category="business" role="tab" aria-selected="false">💼 Business</button>
          <button type="button" class="cmd-filter-chip" data-category="pages" role="tab" aria-selected="false">📄 Pages</button>
          <button type="button" class="cmd-filter-chip" data-category="actions" role="tab" aria-selected="false">⚡ Actions</button>
        </div>
        <div class="cmd-results-list" role="listbox" id="cmdResultsList"></div>
        <div class="cmd-palette-footer">
          <div>Navigate <span class="cmd-kbd">↑</span> <span class="cmd-kbd">↓</span> &nbsp; Select <span class="cmd-kbd">↵</span> &nbsp; Close <span class="cmd-kbd">ESC</span></div>
          <div>Taksal Command Hub</div>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    const input = overlay.querySelector('.cmd-search-input');
    const clearBtn = overlay.querySelector('.cmd-clear-btn');
    const closeBtn = overlay.querySelector('.cmd-close-btn');
    const resultsContainer = overlay.querySelector('#cmdResultsList');
    const filterChips = overlay.querySelectorAll('.cmd-filter-chip');

    function matchesCategoryFilter(cat, filterKey) {
      if (!filterKey || filterKey === 'all') return true;
      if (filterKey === 'tools') return cat === 'Creative Tools';
      if (filterKey === 'business') return cat === 'Business Suite';
      if (filterKey === 'pages') return ['Pages', 'Navigation', 'Support', 'Legal', 'AI & Keystore'].includes(cat);
      if (filterKey === 'actions') return cat === 'Actions';
      return true;
    }

    function renderResults(filterText = '', category = activePaletteCategory) {
      const q = filterText.toLowerCase().trim();

      let matched = searchIndex.filter(item => {
        const matchesCat = matchesCategoryFilter(item.category, category);
        if (!matchesCat) return false;
        if (!q) return true;
        return (
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          (item.keywords && item.keywords.toLowerCase().includes(q))
        );
      });

      // Show/hide clear button
      if (clearBtn) {
        clearBtn.style.display = q.length > 0 ? 'inline-flex' : 'none';
      }

      if (matched.length === 0) {
        resultsContainer.innerHTML = `
          <div class="cmd-empty-box">
            <div class="cmd-empty-icon">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
            </div>
            <div class="cmd-empty-title">No tools or pages found</div>
            <div class="cmd-empty-hint">We couldn't find anything matching "${escapeHtml(filterText)}". Try one of these:</div>
            <div class="cmd-empty-tags">
              <button type="button" class="cmd-empty-tag" data-suggest="card">3D Business Card</button>
              <button type="button" class="cmd-empty-tag" data-suggest="gst">GST Invoice</button>
              <button type="button" class="cmd-empty-tag" data-suggest="thermal">Thermal Slip</button>
              <button type="button" class="cmd-empty-tag" data-suggest="qr">QR Code</button>
              <button type="button" class="cmd-empty-tag" data-suggest="theme">Dark / Light Mode</button>
            </div>
          </div>
        `;

        resultsContainer.querySelectorAll('.cmd-empty-tag').forEach(tag => {
          tag.addEventListener('click', () => {
            const sug = tag.getAttribute('data-suggest');
            input.value = sug;
            renderResults(sug, activePaletteCategory);
            input.focus();
          });
        });
        return;
      }

      // Group matching items by category
      const groups = {};
      matched.forEach(item => {
        if (!groups[item.category]) groups[item.category] = [];
        groups[item.category].push(item);
      });

      resultsContainer.innerHTML = '';
      let itemIndex = 0;

      for (const [cat, items] of Object.entries(groups)) {
        const groupTitle = document.createElement('div');
        groupTitle.className = 'cmd-result-group-title';
        groupTitle.innerHTML = `<span>${escapeHtml(cat)}</span><span style="font-size: 0.65rem; opacity: 0.7;">${items.length}</span>`;
        resultsContainer.appendChild(groupTitle);

        items.forEach(item => {
          const itemEl = document.createElement('div');
          itemEl.className = `cmd-result-item ${itemIndex === 0 ? 'selected' : ''}`;
          itemEl.setAttribute('data-index', itemIndex);
          itemEl.setAttribute('role', 'option');
          if (item.url) itemEl.setAttribute('data-url', item.url);
          if (item.action) itemEl.setAttribute('data-action', item.action);

          const iconSvg = getCmdIconSvg(item.icon);
          const highlightedTitle = highlightMatches(item.title, q);
          const highlightedSub = highlightMatches(item.subtitle, q);
          const actionText = item.action ? (item.action === 'toggleTheme' ? 'Toggle' : (item.action === 'downloadApp' ? 'Get App' : 'Copy')) : 'Jump';

          itemEl.innerHTML = `
            <div class="cmd-result-item-left">
              <div class="cmd-item-icon-box">${iconSvg}</div>
              <div class="cmd-item-text">
                <div class="cmd-item-title">${highlightedTitle}</div>
                <div class="cmd-item-subtitle">${highlightedSub}</div>
              </div>
            </div>
            <div class="cmd-item-right">
              <span class="cmd-item-badge">${escapeHtml(item.category)}</span>
              <span class="cmd-item-action-hint">↵ ${actionText}</span>
            </div>
          `;

          itemEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            executeCommandItem(itemEl);
          });

          resultsContainer.appendChild(itemEl);
          itemIndex++;
        });
      }
    }

    paletteRenderer = renderResults;

    // Filter Chips click handlers
    filterChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        filterChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        activePaletteCategory = chip.getAttribute('data-category') || 'all';
        renderResults(input.value, activePaletteCategory);
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        input.value = '';
        renderResults('', activePaletteCategory);
        input.focus();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.closeCommandPalette();
      });
    }

    input.addEventListener('input', e => {
      renderResults(e.target.value, activePaletteCategory);
    });

    // Keyboard navigation within palette
    overlay.addEventListener('keydown', e => {
      const items = resultsContainer.querySelectorAll('.cmd-result-item');

      if (e.key === 'Escape') {
        e.preventDefault();
        window.closeCommandPalette();
        return;
      }

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
      if (e.target === overlay) {
        window.closeCommandPalette();
      }
    });

    return overlay;
  }

  function executeCommandItem(itemEl) {
    const url = itemEl.getAttribute('data-url');
    const action = itemEl.getAttribute('data-action');

    window.closeCommandPalette();

    if (action === 'toggleTheme') {
      const next = getActiveTheme() === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
      return;
    } else if (action === 'downloadApp') {
      window.open('https://play.google.com/store/apps/details?id=com.card.mint.cardbuilder', '_blank', 'noopener,noreferrer');
      return;
    } else if (action === 'copyAdsTxt') {
      window.copyTextToClipboard('google.com, pub-7030166934019393, DIRECT, f08c47fec0942fa0', 'App-ads.txt record copied!');
      return;
    }

    if (url) {
      if (url.includes('#')) {
        const parts = url.split('#');
        const hash = parts[1];
        if (hash) {
          const targetEl = document.getElementById(hash);
          if (targetEl) {
            history.pushState(null, '', '#' + hash);
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            targetEl.classList.add('jump-highlight');
            setTimeout(() => targetEl.classList.remove('jump-highlight'), 1800);
            return;
          }
        }
      }
      window.location.href = url;
    }
  }

  window.openCommandPalette = function () {
    // If mobile navigation drawer is open, cleanly close it
    const mobileDrawer = document.querySelector('.mobile-nav-drawer');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      mobileDrawer.classList.remove('open');
      if (hamburgerBtn) hamburgerBtn.setAttribute('aria-expanded', 'false');
    }

    lastActiveSearchElement = document.activeElement;
    const overlay = createCommandPalette();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Update aria-expanded on trigger buttons
    document.querySelectorAll('.cmd-palette-btn, .mobile-search-trigger, [data-action="command-palette"]').forEach(btn => {
      btn.setAttribute('aria-expanded', 'true');
    });

    const input = overlay.querySelector('.cmd-search-input');
    if (input) {
      input.value = '';
      activePaletteCategory = 'all';
      const allFilterChips = overlay.querySelectorAll('.cmd-filter-chip');
      allFilterChips.forEach(c => {
        const isAll = c.getAttribute('data-category') === 'all';
        c.classList.toggle('active', isAll);
        c.setAttribute('aria-selected', isAll ? 'true' : 'false');
      });

      if (paletteRenderer) {
        paletteRenderer('', 'all');
      }

      setTimeout(() => {
        input.focus();
      }, 50);
    }
  };

  window.closeCommandPalette = function () {
    const overlay = document.querySelector('.cmd-palette-overlay');
    if (overlay && overlay.classList.contains('open')) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      
      document.querySelectorAll('.cmd-palette-btn, .mobile-search-trigger, [data-action="command-palette"]').forEach(btn => {
        btn.setAttribute('aria-expanded', 'false');
      });

      if (lastActiveSearchElement && typeof lastActiveSearchElement.focus === 'function') {
        try { lastActiveSearchElement.focus(); } catch (_) {}
      }
    }
  };

  window.toggleCommandPalette = function () {
    const overlay = document.querySelector('.cmd-palette-overlay');
    if (overlay && overlay.classList.contains('open')) {
      window.closeCommandPalette();
    } else {
      window.openCommandPalette();
    }
  };

  // Keyboard shortcut listener for Cmd+K / Ctrl+K & Escape
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K' || e.code === 'KeyK')) {
      e.preventDefault();
      window.toggleCommandPalette();
    } else if (e.key === 'Escape') {
      const overlay = document.querySelector('.cmd-palette-overlay');
      if (overlay && overlay.classList.contains('open')) {
        window.closeCommandPalette();
      }
    }
  });

  // Sync shortcuts & bind search trigger buttons on DOM load
  syncPlatformShortcuts();
  bindSearchTriggers();

  // ==========================================================================
  // 5. INTERACTIVE 3D BUSINESS CARD STUDIO & REAL SVG/PNG/vCARD EXPORT
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
    const cardBackTaglineEl = document.getElementById('cardBackTagline');

    const inputName = document.getElementById('inputCardName');
    const inputTitle = document.getElementById('inputCardTitle');
    const inputCompany = document.getElementById('inputCardCompany');
    const inputPhone = document.getElementById('inputCardPhone');
    const inputEmail = document.getElementById('inputCardEmail');
    const inputTagline = document.getElementById('inputCardTagline');
    const inputWebsite = document.getElementById('inputCardWebsite');

    const flipBtn = document.getElementById('flipCardBtn');
    const flipCardBtnText = document.getElementById('flipCardBtnText');
    const cardFlipHintText = document.getElementById('cardFlipHintText');
    const downloadSpecBtn = document.getElementById('downloadSpecBtn');
    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const copyVCardBtn = document.getElementById('copyVCardBtn');
    const downloadVcfBtn = document.getElementById('downloadVcfBtn');
    const resetCustomizerBtn = document.getElementById('resetCustomizerBtn');
    const tabFrontView = document.getElementById('tabFrontView');
    const tabBackView = document.getElementById('tabBackView');
    const toggleBleedBtn = document.getElementById('toggleBleedBtn');
    const toggleGlareBtn = document.getElementById('toggleGlareBtn');
    const cardQrClickable = document.getElementById('cardQrClickable');

    // Theme palette definition for real-time styles and vector SVG export
    const themePalettes = {
      royal: {
        label: 'Royal Violet',
        gradStart: '#4A148C',
        gradEnd: '#7B1FA2',
        textColor: '#FFFFFF',
        accentColor: '#D8B4FE',
        badgeBg: 'rgba(255, 255, 255, 0.18)',
        badgeText: '#D8B4FE',
        guideColor: 'rgba(255, 255, 255, 0.22)',
        qrBoxBg: '#FFFFFF',
        qrBoxBorder: 'rgba(255, 255, 255, 0.2)',
        qrColor: '#0F172A'
      },
      midnight: {
        label: 'Midnight Onyx',
        gradStart: '#18181B',
        gradEnd: '#27272A',
        textColor: '#FFFFFF',
        accentColor: '#A1A1AA',
        badgeBg: 'rgba(255, 255, 255, 0.12)',
        badgeText: '#E4E4E7',
        guideColor: 'rgba(255, 255, 255, 0.18)',
        qrBoxBg: '#FFFFFF',
        qrBoxBorder: 'rgba(255, 255, 255, 0.15)',
        qrColor: '#0F172A'
      },
      emerald: {
        label: 'Emerald Tech',
        gradStart: '#064E3B',
        gradEnd: '#059669',
        textColor: '#FFFFFF',
        accentColor: '#6EE7B7',
        badgeBg: 'rgba(255, 255, 255, 0.18)',
        badgeText: '#6EE7B7',
        guideColor: 'rgba(255, 255, 255, 0.22)',
        qrBoxBg: '#FFFFFF',
        qrBoxBorder: 'rgba(255, 255, 255, 0.2)',
        qrColor: '#0F172A'
      },
      sapphire: {
        label: 'Ocean Sapphire',
        gradStart: '#0F172A',
        gradEnd: '#1E40AF',
        textColor: '#FFFFFF',
        accentColor: '#93C5FD',
        badgeBg: 'rgba(255, 255, 255, 0.18)',
        badgeText: '#93C5FD',
        guideColor: 'rgba(255, 255, 255, 0.22)',
        qrBoxBg: '#FFFFFF',
        qrBoxBorder: 'rgba(255, 255, 255, 0.2)',
        qrColor: '#0F172A'
      },
      sunset: {
        label: 'Crimson Sunset',
        gradStart: '#881337',
        gradEnd: '#E11D48',
        textColor: '#FFFFFF',
        accentColor: '#FDA4AF',
        badgeBg: 'rgba(255, 255, 255, 0.18)',
        badgeText: '#FDA4AF',
        guideColor: 'rgba(255, 255, 255, 0.22)',
        qrBoxBg: '#FFFFFF',
        qrBoxBorder: 'rgba(255, 255, 255, 0.2)',
        qrColor: '#0F172A'
      },
      minimal: {
        label: 'Clean Minimalist',
        gradStart: '#FFFFFF',
        gradEnd: '#F8FAFC',
        textColor: '#0F172A',
        accentColor: '#64748B',
        badgeBg: '#F1F5F9',
        badgeText: '#4338CA',
        guideColor: '#CBD5E1',
        qrBoxBg: '#F8FAFC',
        qrBoxBorder: '#CBD5E1',
        qrColor: '#0F172A'
      }
    };

    // Instant Persona Profiles
    const personaProfiles = {
      creative: {
        name: 'Elena Rostova',
        title: 'Creative Director',
        company: 'Velvet & Obsidian Ltd',
        tagline: 'Crafting Sovereign Visuals',
        phone: '+1 (555) 321-7890',
        email: 'elena@velvet.design',
        website: 'https://taksal.pages.dev/',
        theme: 'royal',
        finish: 'holo',
        radius: 'rounded',
        label: 'Art Director'
      },
      founder: {
        name: 'Alex Morgan',
        title: 'Founder & CEO',
        company: 'Taksal Technologies Ltd',
        tagline: 'Building Sovereign Software',
        phone: '+1 (555) 019-2831',
        email: 'alex@taksal.com',
        website: 'https://taksal.pages.dev/',
        theme: 'emerald',
        finish: 'matte',
        radius: 'rounded',
        label: 'Tech Founder'
      },
      luxury: {
        name: 'Vikramaditya Singhania',
        title: 'Managing Partner',
        company: 'Singhania Jewellers',
        tagline: 'Fine Goldsmithing Since 1984',
        phone: '+91 98200 12345',
        email: 'billing@singhania.in',
        website: 'https://taksal.pages.dev/',
        theme: 'midnight',
        finish: 'foil',
        radius: 'sharp',
        label: 'Luxury Brand'
      },
      minimal: {
        name: 'Marcus Vance',
        title: 'Principal Architect',
        company: 'Studio Monochrome',
        tagline: 'Form Follows Clarity',
        phone: '+44 20 7946 0912',
        email: 'marcus@vancestudio.co.uk',
        website: 'https://taksal.pages.dev/',
        theme: 'minimal',
        finish: 'matte',
        radius: 'sharp',
        label: 'Minimalist'
      },
      ocean: {
        name: 'Dr. Kai Thorne',
        title: 'Marine Scientist',
        company: 'Pacific Ocean Institute',
        tagline: 'Restoring Ocean Sanctuaries',
        phone: '+1 (555) 872-4019',
        email: 'kai@pacificmarine.org',
        website: 'https://taksal.pages.dev/',
        theme: 'sapphire',
        finish: 'spot-uv',
        radius: 'rounded',
        label: 'Marine Bio'
      },
      sunset: {
        name: 'Aria Chen',
        title: 'Lead Brand Strategist',
        company: 'Solaris Brand Studio',
        tagline: 'Illuminating Bold Visions',
        phone: '+1 (555) 439-8120',
        email: 'aria@solarisbrand.com',
        website: 'https://taksal.pages.dev/',
        theme: 'sunset',
        finish: 'foil',
        radius: 'diecut',
        label: 'Brand Engine'
      }
    };

    let activeThemeKey = 'royal';
    let activeFinishKey = 'matte';
    let activeRadiusKey = 'rounded';

    // Live binding between inputs and card faces
    function updateCardPreview() {
      const nameVal = inputName?.value.trim() || 'Alex Morgan';
      const titleVal = inputTitle?.value.trim() || 'Creative Director';
      const companyVal = inputCompany?.value.trim() || 'Taksal Studio Ltd';
      const phoneVal = inputPhone?.value.trim() || '+1 (555) 321-7890';
      const emailVal = inputEmail?.value.trim() || 'alex@taksal.com';
      const taglineVal = inputTagline?.value.trim() || 'Crafting Sovereign Visuals';

      if (cardNameEl) cardNameEl.textContent = nameVal;
      if (cardTitleEl) cardTitleEl.textContent = titleVal;
      if (cardCompanyEl) cardCompanyEl.textContent = companyVal;
      if (cardBackCompanyEl) cardBackCompanyEl.textContent = companyVal;
      if (cardPhoneEl) cardPhoneEl.textContent = phoneVal;
      if (cardEmailEl) cardEmailEl.textContent = emailVal;
      if (cardTaglineEl) cardTaglineEl.textContent = taglineVal;
    }

    [inputName, inputTitle, inputCompany, inputPhone, inputEmail, inputTagline, inputWebsite].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', updateCardPreview);
      }
    });

    // Theme selector swatches (6 themes)
    function applyCardTheme(themeKey, notify = true) {
      activeThemeKey = themeKey;
      const swatches = document.querySelectorAll('.swatch-btn');
      swatches.forEach(s => {
        const match = s.getAttribute('data-card-theme') === themeKey;
        s.classList.toggle('active', match);
        s.setAttribute('aria-checked', match ? 'true' : 'false');
        s.setAttribute('aria-pressed', match ? 'true' : 'false');
      });

      const faces = card3D.querySelectorAll('.card-face');
      faces.forEach(face => {
        const isBack = face.classList.contains('card-face-back');
        face.className = `card-face ${isBack ? 'card-face-back' : 'card-face-front'} theme-${themeKey} finish-${activeFinishKey}`;
      });

      if (notify) {
        const label = themePalettes[themeKey]?.label || themeKey;
        window.showToast(`Applied ${label} palette`, 'info', 1800);
      }
    }

    document.querySelectorAll('.swatch-btn').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const theme = swatch.getAttribute('data-card-theme') || 'royal';
        applyCardTheme(theme, true);
      });
    });

    // Paper Finish selector (matte, foil, holo, spot-uv)
    function applyFinish(finishKey, notify = true) {
      activeFinishKey = finishKey;
      const finishChips = document.querySelectorAll('.finish-chip');
      finishChips.forEach(chip => {
        const match = chip.getAttribute('data-finish') === finishKey;
        chip.classList.toggle('active', match);
        chip.setAttribute('aria-checked', match ? 'true' : 'false');
      });

      const faces = card3D.querySelectorAll('.card-face');
      faces.forEach(face => {
        const isBack = face.classList.contains('card-face-back');
        face.className = `card-face ${isBack ? 'card-face-back' : 'card-face-front'} theme-${activeThemeKey} finish-${finishKey}`;
      });

      if (notify) {
        const labels = { matte: 'Matte Silk', foil: 'Gold Foil Accent', holo: 'Holographic Sheen', 'spot-uv': 'Spot UV Gloss' };
        window.showToast(`Applied ${labels[finishKey] || finishKey} paper finish`, 'info', 1800);
      }
    }

    document.querySelectorAll('.finish-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const finish = chip.getAttribute('data-finish') || 'matte';
        applyFinish(finish, true);
      });
    });

    // Corner Die-Cut selector (rounded, sharp, diecut)
    function applyCornerRadius(radiusKey, notify = true) {
      activeRadiusKey = radiusKey;
      const cornerChips = document.querySelectorAll('.corner-chip');
      cornerChips.forEach(chip => {
        const match = chip.getAttribute('data-radius') === radiusKey;
        chip.classList.toggle('active', match);
        chip.setAttribute('aria-checked', match ? 'true' : 'false');
      });

      card3D.classList.remove('radius-rounded', 'radius-sharp', 'radius-diecut');
      card3D.classList.add(`radius-${radiusKey}`);

      if (notify) {
        const labels = { rounded: 'Rounded Corners (16px)', sharp: 'Sharp Precision Corners', diecut: 'Pebble Die-Cut (26px)' };
        window.showToast(`Applied ${labels[radiusKey] || radiusKey}`, 'info', 1800);
      }
    }

    document.querySelectorAll('.corner-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const radius = chip.getAttribute('data-radius') || 'rounded';
        applyCornerRadius(radius, true);
      });
    });

    // Persona Presets Handler
    function applyPersona(personaKey) {
      const persona = personaProfiles[personaKey];
      if (!persona) return;

      if (inputName) inputName.value = persona.name;
      if (inputTitle) inputTitle.value = persona.title;
      if (inputCompany) inputCompany.value = persona.company;
      if (inputTagline) inputTagline.value = persona.tagline;
      if (inputPhone) inputPhone.value = persona.phone;
      if (inputEmail) inputEmail.value = persona.email;
      if (inputWebsite) inputWebsite.value = persona.website;

      document.querySelectorAll('.persona-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-persona') === personaKey);
      });

      applyCardTheme(persona.theme, false);
      applyFinish(persona.finish, false);
      applyCornerRadius(persona.radius, false);
      updateCardPreview();
      window.showToast(`Loaded "${persona.label}" persona preset`, 'success', 2200);
    }

    document.querySelectorAll('.persona-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const pKey = chip.getAttribute('data-persona');
        if (pKey) applyPersona(pKey);
      });
    });

    // Reset Customizer Defaults
    if (resetCustomizerBtn) {
      resetCustomizerBtn.addEventListener('click', () => {
        applyPersona('founder');
        window.showToast('Reset card customizer to default layout', 'info', 2000);
      });
    }

    // Synchronize View Tabs with Flipped State
    function syncViewTabs(isFlipped) {
      if (tabFrontView) {
        tabFrontView.classList.toggle('active', !isFlipped);
        tabFrontView.setAttribute('aria-selected', !isFlipped ? 'true' : 'false');
      }
      if (tabBackView) {
        tabBackView.classList.toggle('active', isFlipped);
        tabBackView.setAttribute('aria-selected', isFlipped ? 'true' : 'false');
      }
    }

    // Flip action
    function setCardFlipped(flipToBack) {
      if (flipToBack) {
        card3D.classList.add('flipped');
      } else {
        card3D.classList.remove('flipped');
      }
      card3D.style.transform = '';
      const isFlipped = card3D.classList.contains('flipped');
      card3D.setAttribute('aria-expanded', isFlipped ? 'true' : 'false');
      syncViewTabs(isFlipped);

      if (flipCardBtnText) {
        flipCardBtnText.textContent = isFlipped ? 'Flip to Front View' : 'Flip to Back View';
      } else if (flipBtn) {
        flipBtn.textContent = isFlipped ? 'Flip to Front View' : 'Flip to Back View';
      }

      if (cardFlipHintText) {
        cardFlipHintText.textContent = isFlipped
          ? 'Showing rear QR code view (click to flip back)'
          : 'Click or tap card to flip 3D view';
      }
    }

    function toggleCardFlip() {
      setCardFlipped(!card3D.classList.contains('flipped'));
    }

    if (flipBtn) {
      flipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCardFlip();
      });
    }

    if (tabFrontView) {
      tabFrontView.addEventListener('click', (e) => {
        e.stopPropagation();
        setCardFlipped(false);
      });
    }

    if (tabBackView) {
      tabBackView.addEventListener('click', (e) => {
        e.stopPropagation();
        setCardFlipped(true);
      });
    }

    card3D.addEventListener('click', () => {
      toggleCardFlip();
    });

    card3D.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCardFlip();
      }
    });

    // Bleed Margin Overlay Toggle
    if (toggleBleedBtn) {
      toggleBleedBtn.addEventListener('click', () => {
        const isShowing = card3D.classList.toggle('show-bleed');
        toggleBleedBtn.classList.toggle('active', isShowing);
        toggleBleedBtn.setAttribute('aria-pressed', isShowing ? 'true' : 'false');
        window.showToast(isShowing ? '0.125" Print Bleed & Safe Zone visible' : 'Print Bleed Overlay hidden', 'info', 2000);
      });
    }

    // 3D Specular Sheen Toggle
    if (toggleGlareBtn) {
      toggleGlareBtn.addEventListener('click', () => {
        const isGlaring = card3D.classList.toggle('has-glare');
        toggleGlareBtn.classList.toggle('active', isGlaring);
        toggleGlareBtn.setAttribute('aria-pressed', isGlaring ? 'true' : 'false');
        window.showToast(isGlaring ? '3D Specular Sheen active' : '3D Specular Sheen disabled', 'info', 1800);
      });
    }

    // Clickable QR Code scan simulator
    if (cardQrClickable) {
      cardQrClickable.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = (inputWebsite?.value || 'https://taksal.pages.dev/').trim();
        window.showToast(`Verified QR Payload: ${url} (Ready for camera scan)`, 'success', 3500);
      });
    }

    // 3D mouse parallax tilt & dynamic light glare on desktop
    const perspectiveContainer = card3D.closest('.card-perspective-container');
    if (perspectiveContainer && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const glares = card3D.querySelectorAll('.card-glare');

      perspectiveContainer.addEventListener('mousemove', (e) => {
        const rect = perspectiveContainer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = -y * 14;
        const isFlipped = card3D.classList.contains('flipped');
        const baseRotateY = isFlipped ? 180 : 0;
        const rotateY = baseRotateY + x * 18;
        card3D.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;

        // Update specular light highlight coordinate
        if (card3D.classList.contains('has-glare')) {
          const glareX = ((x + 0.5) * 100).toFixed(1);
          const glareY = ((y + 0.5) * 100).toFixed(1);
          glares.forEach(glare => {
            glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.3) 0%, transparent 65%)`;
          });
        }
      });

      perspectiveContainer.addEventListener('mouseleave', () => {
        card3D.style.transform = '';
      });
    }

    // Format RFC 2426 vCard string
    function generateVCardString() {
      const name = (inputName?.value || 'Alex Morgan').trim();
      const title = (inputTitle?.value || 'Creative Director').trim();
      const company = (inputCompany?.value || 'Taksal Studio Ltd').trim();
      const phone = (inputPhone?.value || '+1 (555) 321-7890').trim();
      const email = (inputEmail?.value || 'alex@taksal.com').trim();
      const tagline = (inputTagline?.value || 'Crafting Sovereign Visuals').trim();
      const website = (inputWebsite?.value || 'https://taksal.pages.dev/').trim();

      const nameParts = name.split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN;CHARSET=UTF-8:${name}`,
        `N;CHARSET=UTF-8:${lastName};${firstName};;;`,
        `ORG;CHARSET=UTF-8:${company}`,
        `TITLE;CHARSET=UTF-8:${title}`,
        `TEL;TYPE=WORK,VOICE:${phone}`,
        `EMAIL;TYPE=PREF,INTERNET:${email}`,
        `URL;CHARSET=UTF-8:${website}`,
        `NOTE;CHARSET=UTF-8:${tagline} • Crafted with Taksal Studio Engine`,
        `REV:${new Date().toISOString()}`,
        'END:VCARD',
        ''
      ].join('\r\n');
    }

    // Genuine Vector 300 DPI SVG Spec Exporter (Front or Back)
    function generateCardSvg() {
      const name = (inputName?.value || 'Alex Morgan').trim();
      const title = (inputTitle?.value || 'Creative Director').trim();
      const company = (inputCompany?.value || 'Taksal Studio Ltd').trim();
      const phone = (inputPhone?.value || '+1 (555) 321-7890').trim();
      const email = (inputEmail?.value || 'alex@taksal.com').trim();
      const tagline = (inputTagline?.value || 'Crafting Sovereign Visuals').trim();
      const website = (inputWebsite?.value || 'https://taksal.pages.dev/').trim();

      const palette = themePalettes[activeThemeKey] || themePalettes.royal;
      const isFlipped = card3D.classList.contains('flipped');

      const qrPathMatrix = `
        <path fill="${palette.qrColor}" d="M2 2h7v7H2zM3 3v5h5V3zm1 1h3v3H4zM2 20h7v7H2zM3 21v5h5V21zm1 1h3v3H4zM20 2h7v7h-7zM21 3v5h5V3zm1 1h3v3h-3z"/>
        <path fill="${palette.qrColor}" d="M10 4h1v1h-1zM12 4h1v1h-1zM14 4h1v1h-1zM16 4h1v1h-1zM18 4h1v1h-1zM4 10h1v1h-1zM4 12h1v1h-1zM4 14h1v1h-1zM4 16h1v1h-1zM4 18h1v1h-1z"/>
        <path fill="${palette.qrColor}" d="M18 18h5v5h-5zM19 19v3h3v-3zm1 1h1v1h-1z"/>
        <path fill="${palette.qrColor}" d="M10 2h2v2h-2zM14 2h1v1h-1zM17 2h2v1h-2zM10 6h1v2h-1zM12 7h2v1h-2zM15 6h1v3h-1zM17 7h1v1h-1zM10 10h3v2h-1v-1h-2zM14 10h2v1h-2zM17 11h2v1h-2zM20 10h2v2h-1v-1h-1zM23 11h1v1h-1zM25 10h2v2h-2zM6 10h2v1H6zM10 13h1v2h-1zM12 14h3v1h-3zM16 13h2v2h-2zM19 14h1v1h-1zM21 13h2v2h-2zM24 13h2v1h-2zM27 14h1v1h-1zM10 16h2v1h-2zM13 17h1v1h-1zM15 16h3v1h-1v1h-2zM19 16h1v2h-1zM21 17h1v1h-1zM23 16h3v1h-3zM27 16h1v2h-1zM10 19h1v1h-1zM12 20h2v1h-2zM15 19h2v2h-1v-1h-1zM18 20h1v1h-1zM24 19h2v1h-2zM27 19h1v1h-1zM10 22h3v1h-3zM14 23h2v2h-2zM17 22h1v3h-1zM20 24h2v2h-2zM23 23h1v1h-1zM25 22h2v2h-1v-1h-1zM10 25h2v2h-2zM13 26h1v1h-1zM15 25h1v2h-1zM18 26h2v1h-2zM24 25h1v1h-1zM26 26h2v1h-2z"/>
      `;

      if (isFlipped) {
        // Back View SVG
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600">
  <defs>
    <linearGradient id="cardGradBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.gradStart}"/>
      <stop offset="100%" stop-color="${palette.gradEnd}"/>
    </linearGradient>
    <style>
      .text-back-company { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 34px; font-weight: 800; fill: ${palette.textColor}; text-anchor: middle; }
      .text-back-sub { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 20px; font-weight: 500; fill: ${palette.accentColor}; text-anchor: middle; }
      .text-back-url { font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 600; fill: ${palette.textColor}; opacity: 0.9; text-anchor: middle; }
      .text-spec-note { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 600; fill: ${palette.accentColor}; opacity: 0.75; text-anchor: middle; }
    </style>
  </defs>
  <rect width="1050" height="600" rx="32" fill="url(#cardGradBack)" stroke="${palette.badgeBorder || 'none'}" stroke-width="1"/>
  <!-- 0.125in Print Bleed Safe Area -->
  <rect x="38" y="38" width="974" height="524" rx="22" fill="none" stroke="${palette.guideColor}" stroke-dasharray="8 6" stroke-width="2"/>
  
  <!-- High-Resolution Centered Vector QR Code Box -->
  <rect x="415" y="95" width="220" height="220" rx="20" fill="${palette.qrBoxBg}" stroke="${palette.qrBoxBorder}" stroke-width="2"/>
  <g transform="translate(424, 104) scale(7.0)" shape-rendering="crispEdges">
    ${qrPathMatrix}
  </g>

  <text x="525" y="365" class="text-back-company">${escapeHtml(company)}</text>
  <text x="525" y="405" class="text-back-sub">Scan for Instant vCard &amp; Portfolio</text>
  <text x="525" y="445" class="text-back-url">${escapeHtml(website)}</text>
  <text x="525" y="535" class="text-spec-note">Taksal Studio Vector Engine • 300 DPI CMYK Print Spec (Rear)</text>
</svg>`;
      }

      // Front View SVG
      return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1050 600" width="1050" height="600">
  <defs>
    <linearGradient id="cardGradFront" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.gradStart}"/>
      <stop offset="100%" stop-color="${palette.gradEnd}"/>
    </linearGradient>
    <style>
      .brand-title { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 38px; font-weight: 800; fill: ${palette.textColor}; letter-spacing: -0.5px; }
      .brand-tagline { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 22px; font-weight: 500; fill: ${palette.accentColor}; }
      .badge-bg { fill: ${palette.badgeBg}; rx: 20px; }
      .badge-text { font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 700; fill: ${palette.badgeText}; text-anchor: middle; }
      .text-title { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 46px; font-weight: 800; fill: ${palette.textColor}; letter-spacing: -0.5px; }
      .text-sub { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 24px; font-weight: 500; fill: ${palette.accentColor}; }
      .text-body { font-family: 'Inter', system-ui, -apple-system, sans-serif; font-size: 22px; font-weight: 400; fill: ${palette.textColor}; }
      .bleed-guide { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 600; fill: ${palette.accentColor}; opacity: 0.65; text-anchor: end; }
    </style>
  </defs>
  <rect width="1050" height="600" rx="32" fill="url(#cardGradFront)" stroke="${palette.badgeBorder || 'none'}" stroke-width="1"/>
  <!-- 0.125in Print Bleed Safe Area -->
  <rect x="38" y="38" width="974" height="524" rx="22" fill="none" stroke="${palette.guideColor}" stroke-dasharray="8 6" stroke-width="2"/>
  
  <!-- Top Header Row -->
  <text x="75" y="98" class="brand-title">${escapeHtml(company)}</text>
  <text x="75" y="138" class="brand-tagline">${escapeHtml(tagline)}</text>
  <rect x="805" y="65" width="170" height="42" class="badge-bg"/>
  <text x="890" y="92" class="badge-text">300 DPI CMYK</text>

  <!-- User Identity & Title -->
  <text x="75" y="375" class="text-title">${escapeHtml(name)}</text>
  <text x="75" y="415" class="text-sub">${escapeHtml(title)}</text>

  <!-- Contact Coordinates -->
  <g transform="translate(75, 492)">
    <text x="0" y="18" class="text-body">&#9742;  ${escapeHtml(phone)}</text>
  </g>
  <g transform="translate(500, 492)">
    <text x="0" y="18" class="text-body">&#9993;  ${escapeHtml(email)}</text>
  </g>

  <!-- Bleed Label -->
  <text x="980" y="550" class="bleed-guide">0.125&quot; BLEED SAFE ZONE</text>
</svg>`;
    }

    // 1. Export 300 DPI SVG
    if (downloadSpecBtn) {
      downloadSpecBtn.addEventListener('click', () => {
        try {
          const svgContent = generateCardSvg();
          const isFlipped = card3D.classList.contains('flipped');
          const viewSide = isFlipped ? 'back' : 'front';

          const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          const cleanName = (inputName?.value || 'alex').toLowerCase().replace(/[^a-z0-9]/g, '-');
          link.href = url;
          link.download = `taksal-card-${cleanName}-${activeThemeKey}-${viewSide}-300dpi.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          window.showToast(`300 DPI Vector SVG (${isFlipped ? 'Back' : 'Front'} View) downloaded!`, 'success', 3500);
        } catch (err) {
          window.showToast('Generating 300 DPI Spec (Print Ready 3.5" x 2.0")...', 'success', 3500);
        }
      });
    }

    // 2. Export High-Res PNG (via offscreen Canvas)
    if (downloadPngBtn) {
      downloadPngBtn.addEventListener('click', () => {
        try {
          const svgContent = generateCardSvg();
          const isFlipped = card3D.classList.contains('flipped');
          const viewSide = isFlipped ? 'back' : 'front';
          const cleanName = (inputName?.value || 'alex').toLowerCase().replace(/[^a-z0-9]/g, '-');

          const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();

          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = 2100;
              canvas.height = 1200;
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = '#FFFFFF';
              ctx.fillRect(0, 0, 2100, 1200);
              ctx.drawImage(img, 0, 0, 2100, 1200);
              URL.revokeObjectURL(url);

              canvas.toBlob((pngBlob) => {
                if (pngBlob) {
                  const pngUrl = URL.createObjectURL(pngBlob);
                  const link = document.createElement('a');
                  link.href = pngUrl;
                  link.download = `taksal-card-${cleanName}-${activeThemeKey}-${viewSide}-300dpi.png`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(pngUrl);
                  window.showToast(`High-Res 300 DPI PNG (${isFlipped ? 'Back' : 'Front'} View) downloaded!`, 'success', 3500);
                } else {
                  downloadSpecBtn.click();
                }
              }, 'image/png');
            } catch (canvasErr) {
              downloadSpecBtn.click();
            }
          };

          img.onerror = () => {
            URL.revokeObjectURL(url);
            downloadSpecBtn.click();
          };

          img.src = url;
        } catch (err) {
          downloadSpecBtn?.click();
        }
      });
    }

    // 3. Copy vCard (.vcf)
    if (copyVCardBtn) {
      copyVCardBtn.addEventListener('click', () => {
        const vcard = generateVCardString();
        window.copyTextToClipboard(vcard, 'Digital vCard (.vcf) copied to clipboard!');
      });
    }

    // 4. Download Contact .vcf File
    if (downloadVcfBtn) {
      downloadVcfBtn.addEventListener('click', () => {
        const vcard = generateVCardString();
        const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const cleanName = (inputName?.value || 'contact').toLowerCase().replace(/[^a-z0-9]/g, '-');
        link.href = url;
        link.download = `${cleanName}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        window.showToast('Contact .vcf file downloaded!', 'success', 3000);
      });
    }
  }

  // ==========================================================================
  // 6. INTERACTIVE GST & MULTI-CURRENCY POS SIMULATOR
  // ==========================================================================
  const gstRateBtns = document.querySelectorAll('.slab-chip');
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const calcQtyInput = document.getElementById('calcQty');
  const calcPriceInput = document.getElementById('calcPrice');
  const calcSubtotalEl = document.getElementById('calcSubtotal');
  const calcTaxAmountEl = document.getElementById('calcTaxAmount');
  const calcGrandTotalEl = document.getElementById('calcGrandTotal');
  const calcTaxBreakdownEl = document.getElementById('calcTaxBreakdown');
  const receiptSlipTotalEl = document.getElementById('receiptSlipTotal');
  const printSlipBtn = document.getElementById('printSlipBtn');
  const copySlipBtn = document.getElementById('copySlipBtn');

  let activeTaxRate = 18; // default 18% GST
  let activeCurrency = '$'; // default USD

  function updateGSTCalculation() {
    if (!calcQtyInput || !calcPriceInput) return;

    let qty = parseFloat(calcQtyInput.value);
    if (isNaN(qty) || qty < 1) qty = 1;

    let price = parseFloat(calcPriceInput.value);
    if (isNaN(price) || price < 0) price = 0;

    const subtotal = qty * price;
    const tax = (subtotal * activeTaxRate) / 100;
    const total = subtotal + tax;

    const cgst = (tax / 2).toFixed(2);
    const sgst = (tax / 2).toFixed(2);

    if (calcSubtotalEl) calcSubtotalEl.textContent = `${activeCurrency}${subtotal.toFixed(2)}`;
    if (calcTaxAmountEl) calcTaxAmountEl.textContent = `${activeCurrency}${tax.toFixed(2)} (${activeTaxRate}%)`;
    if (calcGrandTotalEl) calcGrandTotalEl.textContent = `${activeCurrency}${total.toFixed(2)}`;
    if (receiptSlipTotalEl) receiptSlipTotalEl.textContent = `${activeCurrency}${total.toFixed(2)}`;

    if (calcTaxBreakdownEl) {
      calcTaxBreakdownEl.textContent = `CGST (${activeTaxRate / 2}%): ${activeCurrency}${cgst} | SGST (${activeTaxRate / 2}%): ${activeCurrency}${sgst}`;
    }
  }

  if (gstRateBtns.length > 0) {
    gstRateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        gstRateBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
        activeTaxRate = parseFloat(btn.getAttribute('data-rate')) || 0;
        updateGSTCalculation();
      });
    });

    if (currencyBtns.length > 0) {
      currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          currencyBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
          activeCurrency = btn.getAttribute('data-currency') || '$';
          updateGSTCalculation();
          window.showToast(`Currency set to ${activeCurrency}`, 'info', 1500);
        });
      });
    }

    if (calcQtyInput) calcQtyInput.addEventListener('input', updateGSTCalculation);
    if (calcPriceInput) calcPriceInput.addEventListener('input', updateGSTCalculation);
    updateGSTCalculation();
  }

  if (printSlipBtn) {
    printSlipBtn.addEventListener('click', () => {
      window.print();
    });
  }

  if (copySlipBtn) {
    copySlipBtn.addEventListener('click', () => {
      const thermalSlip = document.querySelector('.thermal-tear');
      if (thermalSlip) {
        window.copyTextToClipboard(thermalSlip.innerText, 'Thermal POS slip text copied!');
      }
    });
  }

  // ==========================================================================
  // 7. REAL-TIME FEATURE SEARCH & CATEGORY FILTERING
  // ==========================================================================
  const featureSearchInput = document.getElementById('featureSearchInput');
  const filterChips = document.querySelectorAll('.filter-chip');
  const featureCards = document.querySelectorAll('.feature-detail-card, .bento-card');

  if (featureCards.length > 0) {
    let currentCategory = 'all';

    function filterFeatures() {
      const q = featureSearchInput ? featureSearchInput.value.toLowerCase().trim() : '';
      let matchCount = 0;

      featureCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const cardCat = card.getAttribute('data-category') || 'all';

        const matchesQuery = q === '' || text.includes(q);
        const matchesCat = currentCategory === 'all' || cardCat.includes(currentCategory);

        if (matchesQuery && matchesCat) {
          card.style.display = '';
          matchCount++;
        } else {
          card.style.display = 'none';
        }
      });

      const clearBtn = featureSearchInput ? featureSearchInput.parentElement.querySelector('.search-clear-btn') : null;
      if (clearBtn) {
        clearBtn.style.display = q ? 'inline-flex' : 'none';
      }

      // Handle empty state
      let emptyMsg = document.querySelector('.feature-empty-state');
      if (matchCount === 0) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.className = 'feature-empty-state';
          const container = document.querySelector('.features-container') || featureCards[0]?.parentElement;
          if (container) container.appendChild(emptyMsg);
        }
        emptyMsg.textContent = `No tools or features match your search "${q}". Try clearing filters or searching for "vector", "GST", "Keystore", or "QR".`;
        emptyMsg.style.display = 'block';
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    }

    if (featureSearchInput) {
      featureSearchInput.addEventListener('input', filterFeatures);

      // Create clear button if not already present
      const wrap = featureSearchInput.closest('.feature-search-bar-wrap');
      if (wrap && !wrap.querySelector('.search-clear-btn')) {
        const clearBtn = document.createElement('button');
        clearBtn.type = 'button';
        clearBtn.className = 'search-clear-btn';
        clearBtn.setAttribute('aria-label', 'Clear search text');
        clearBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        clearBtn.addEventListener('click', (e) => {
          e.preventDefault();
          featureSearchInput.value = '';
          filterFeatures();
          featureSearchInput.focus();
        });
        wrap.appendChild(clearBtn);
      }
    }

    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        filterChips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-pressed', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
        currentCategory = chip.getAttribute('data-filter') || 'all';
        filterFeatures();
      });
    });
  }

  // ==========================================================================
  // 8. REAL-TIME FAQ SEARCH WITH GROUP VISIBILITY
  // ==========================================================================
  const faqSearchInput = document.getElementById('faqSearchInput');
  const faqItems = document.querySelectorAll('.faq-item');

  if (faqSearchInput && faqItems.length > 0) {
    function filterFaqs() {
      const q = faqSearchInput.value.toLowerCase().trim();
      let totalVisible = 0;

      faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (q === '' || text.includes(q)) {
          item.style.display = '';
          totalVisible++;
          if (q.length > 2) {
            item.classList.add('active');
            const btn = item.querySelector('.faq-question');
            if (btn) btn.setAttribute('aria-expanded', 'true');
          }
        } else {
          item.style.display = 'none';
        }
      });

      const clearBtn = faqSearchInput ? faqSearchInput.parentElement.querySelector('.search-clear-btn') : null;
      if (clearBtn) {
        clearBtn.style.display = q ? 'inline-flex' : 'none';
      }

      // Group header awareness
      document.querySelectorAll('.faq-group-wrapper').forEach(group => {
        const visibleInGroup = group.querySelectorAll('.faq-item:not([style*="display: none"])').length;
        group.style.display = visibleInGroup > 0 ? '' : 'none';
      });

      let emptyFaqMsg = document.querySelector('.faq-empty-state');
      if (totalVisible === 0) {
        if (!emptyFaqMsg) {
          emptyFaqMsg = document.createElement('div');
          emptyFaqMsg.className = 'faq-empty-state';
          const list = document.querySelector('.faq-list') || faqItems[0]?.parentElement;
          if (list) list.appendChild(emptyFaqMsg);
        }
        emptyFaqMsg.textContent = `No questions found matching "${q}". Try searching for "free", "offline", "thermal", or "Keystore".`;
        emptyFaqMsg.style.display = 'block';
      } else if (emptyFaqMsg) {
        emptyFaqMsg.style.display = 'none';
      }
    }

    faqSearchInput.addEventListener('input', filterFaqs);

    // Create clear button if not already present
    const wrap = faqSearchInput.closest('.feature-search-bar-wrap');
    if (wrap && !wrap.querySelector('.search-clear-btn')) {
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'search-clear-btn';
      clearBtn.setAttribute('aria-label', 'Clear search text');
      clearBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
      clearBtn.addEventListener('click', (e) => {
        e.preventDefault();
        faqSearchInput.value = '';
        filterFaqs();
        faqSearchInput.focus();
      });
      wrap.appendChild(clearBtn);
    }
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
  // 9. DYNAMIC CURSOR SPOTLIGHT TRACKING (STRIPE / LINEAR EFFECT)
  // ==========================================================================
  const spotlightElements = document.querySelectorAll('.spotlight-card, .bento-card, .card');
  spotlightElements.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }, { passive: true });
  });

  // ==========================================================================
  // 10. MOBILE NAVIGATION DRAWER WITH ACCESSIBLE TRAP
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

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleDrawer(false));
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });

    // Close drawer when clicking outside
    document.addEventListener('click', e => {
      if (mobileDrawer.classList.contains('open') && !mobileDrawer.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        toggleDrawer(false);
      }
    });

    // Auto-close on viewport resize past tablet breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileDrawer.classList.contains('open')) {
        toggleDrawer(false);
      }
    });
  }

  // ==========================================================================
  // 11. INTERACTIVE TABS (Features Showcase)
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
  // 12. SCREENSHOT MODAL LIGHTBOX
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
          lightboxModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          if (lightboxClose) lightboxClose.focus();
        }
      });
    });

    function closeLightbox() {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
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
  // 13. CONTACT FORM VALIDATION, HONEYPOT & ANTI-SPAM PROTECTION
  // ==========================================================================
  const contactForm = document.getElementById('taksalContactForm');
  let lastContactSubmitTime = 0;

  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const statusEl = document.getElementById('formStatus');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      // Honeypot validation
      const honeypot = document.getElementById('website_url_hp');
      if (honeypot && honeypot.value.trim() !== '') {
        // Silently deflect bots
        window.showToast('Support ticket dispatched successfully!', 'success', 3000);
        contactForm.reset();
        return;
      }

      // Submission cooldown rate-limit (5 seconds)
      const now = Date.now();
      if (lastContactSubmitTime && now - lastContactSubmitTime < 5000) {
        window.showToast('Please wait a moment before sending another message.', 'info', 3000);
        return;
      }

      const name = document.getElementById('userName')?.value.trim();
      const email = document.getElementById('userEmail')?.value.trim();
      const message = document.getElementById('userMessage')?.value.trim();

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

      lastContactSubmitTime = now;

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
          statusEl.textContent = 'Thank you! Your ticket has been securely dispatched to our engineering team (officialcardmintapp@gmail.com).';
        }
        window.showToast('Support ticket dispatched successfully!', 'success', 3000);
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `Send Message`;
        }
      }, 750);
    });
  }

  // ==========================================================================
  // 14. UNOBTRUSIVE GLOBAL EVENT HANDLERS (DATA-ACTION & SEARCH TRIGGERS)
  // ==========================================================================
  document.addEventListener('click', e => {
    const triggerEl = e.target.closest('.cmd-palette-btn, .mobile-search-trigger, [data-action]');
    if (!triggerEl) return;

    if (triggerEl.classList.contains('cmd-palette-btn') || 
        triggerEl.classList.contains('mobile-search-trigger') || 
        triggerEl.getAttribute('data-action') === 'command-palette') {
      e.preventDefault();
      window.openCommandPalette();
      return;
    }

    const action = triggerEl.getAttribute('data-action');
    if (action === 'print') {
      e.preventDefault();
      window.print();
    }
  });

  // ==========================================================================
  // 15. BACK TO TOP BUTTON
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
  // 16. COPY TO CLIPBOARD UTILITY WITH TOAST FEEDBACK
  // ==========================================================================
  window.copyTextToClipboard = function (text, successMsg = 'Copied to clipboard!') {
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        window.showToast(successMsg, 'success');
      } catch (err) {
        window.showToast('Failed to copy', 'info');
      }
      document.body.removeChild(textarea);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      window.showToast(successMsg, 'success');
    }).catch(() => {
      window.showToast('Failed to copy to clipboard', 'info');
    });
  };

})();
