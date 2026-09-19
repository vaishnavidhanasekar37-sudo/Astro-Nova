/**
 * ASTRONOVA - Core Application Controller
 * Orchestrates view routing, spectral analysis pipeline, AI Explain Mode,
 * animated circular gauges, toast notifications, offline PWA events, and settings.
 */

class AstroNovaApp {
  constructor() {
    this.currentView = 'view-overview';
    this.processor = new RemoteSensingProcessor();
    this.currentImageSource = null;
    this.currentAnalysisResult = null;
    this.currentDatasetTitle = 'Sample Sentinel-2 Scene';

    this.init();
  }

  async init() {
    // 1. Initialize Subsystems
    window.AstroStorage = new StorageManager();
    window.AstroI18n = new I18nManager();
    window.AstroSpaceBg = new SpaceBackground('space-canvas');

    // Sound Effects Manager (runs before everything for audio unlock)
    window.AstroSound = new SoundEffectsManager();

    // Theme Mode Manager
    window.AstroTheme = {
      currentMode: localStorage.getItem('astronova_theme_mode') || 'dark',
      setMode(mode) {
        this.currentMode = mode;
        document.documentElement.setAttribute('data-theme-mode', mode);
        localStorage.setItem('astronova_theme_mode', mode);
        const btn = document.getElementById('btn-theme-mode-toggle');
        const i18n = window.AstroI18n;
        if (btn) {
          const label = mode === 'light'
            ? (i18n ? i18n.t('themeDark') : 'Darkness')
            : (i18n ? i18n.t('themeLight') : 'Brightness');
          btn.innerHTML = (mode === 'light' ? '<span>🌑</span>' : '<span>☀️</span>') + ` <span class="btn-text">${label}</span>`;
        }
        if (window.AstroApp && window.AstroApp.showToast) {
          window.AstroApp.showToast(
            mode === 'light' ? 'BRIGHTNESS MODE' : 'DARKNESS MODE',
            mode === 'light'
              ? 'Bright display with dark text inside boxes.'
              : 'Authentic deep space darkness mode active.',
            'info'
          );
        }
        if (window.AstroSound) window.AstroSound.playToggle();
      },
      toggle() {
        this.setMode(this.currentMode === 'dark' ? 'light' : 'dark');
      }
    };
    // Apply saved theme mode on startup
    document.documentElement.setAttribute('data-theme-mode', window.AstroTheme.currentMode);
    if (window.AstroTheme.currentMode === 'light') {
      const btn = document.getElementById('btn-theme-mode-toggle');
      const i18n = window.AstroI18n;
      const label = i18n ? i18n.t('themeDark') : 'Darkness';
      if (btn) btn.innerHTML = `<span>🌑</span> <span class="btn-text">${label}</span>`;
    }

    // Device-Locked Authentication (replaces SpaceIntro for login)
    window.AstroAuth = new DeviceAuthManager();

    // AI Conversational Assistant
    window.AstroAI = new AstroAIAssistant();

    window.AstroEarthTwin = new EarthDigitalTwin('earth-twin-canvas');
    window.AstroMission = new MissionControlCenter();
    window.AstroComparison = new ImageComparisonStudio();
    window.AstroCrops = new SmartCropMonitor();
    window.AstroDisasters = new DisasterRiskMap('disaster-map-container');
    window.AstroAnalytics = new AnalyticsDashboard();
    window.AstroReport = new SmartReportGenerator();
    window.AstroCamera = new CameraScanner();
    window.AstroVoice = new VoiceCommandsController();
    window.AstroPresentation = new PresentationMode();

    this.bindNavigation();
    this.bindDropzone();
    this.bindExplainTabs();
    this.bindSettings();
    this.bindOfflineListener();
    this.bindDemoPresets();

    // Load initial bundled agricultural demo parcel
    const initialDemoImg = DemoDataGenerator.createDemoImage('agricultural_land');
    await this.loadCustomImage(initialDemoImg, 'Lush Agricultural Parcel [DEMO]');

    // Initialize Before/After Comparison with Demo Flooded Pair
    this.initComparisonDemos();
  }

  initComparisonDemos() {
    const beforeImg = DemoDataGenerator.createDemoImage('agricultural_land', 600, 450);
    const afterImg = DemoDataGenerator.createDemoImage('flooded_area', 600, 450);
    if (window.AstroComparison) {
      window.AstroComparison.loadBefore(beforeImg);
      window.AstroComparison.loadAfter(afterImg);
    }
  }

  bindNavigation() {
    const dockItems = document.querySelectorAll('.dock-item');
    dockItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const targetView = e.currentTarget.dataset.view;
        if (targetView) {
          this.switchView(targetView);
        }
      });
    });

    // Space animation toggle button in navbar
    const spaceToggle = document.getElementById('btn-space-anim-toggle');
    if (spaceToggle) {
      spaceToggle.addEventListener('click', () => {
        if (window.AstroSpaceBg) {
          const running = window.AstroSpaceBg.toggle();
          const i18n = window.AstroI18n;
          const textSpan = document.getElementById('btn-space-anim-text') || spaceToggle;
          textSpan.textContent = running
            ? (i18n ? i18n.t('orbitOn') : '🌌 Orbit: ON')
            : (i18n ? i18n.t('orbitPaused') : '🌌 Orbit: PAUSED');
        }
      });
    }

    // Replay Intro button in navbar
    const replayIntro = document.getElementById('btn-replay-intro');
    if (replayIntro) {
      replayIntro.addEventListener('click', () => {
        if (window.AstroAuth) window.AstroAuth.lockTerminal();
      });
    }

    // Sound toggle button in navbar
    const soundToggle = document.getElementById('btn-sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        if (window.AstroSound) window.AstroSound.toggleMute();
      });
    }

    // Theme mode toggle button in navbar
    const themeToggle = document.getElementById('btn-theme-mode-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        if (window.AstroTheme) window.AstroTheme.toggle();
      });
    }

    // Report Generator button
    const openReportBtn = document.getElementById('btn-open-report');
    if (openReportBtn) {
      openReportBtn.addEventListener('click', () => {
        if (this.currentAnalysisResult && this.currentImageSource) {
          window.AstroReport.showDossier(this.currentAnalysisResult, this.currentImageSource, this.currentDatasetTitle);
        } else {
          this.showToast('NO ANALYSIS READY', 'Please run a spectral analysis before generating report.', 'warning');
        }
      });
    }
  }

  switchView(viewId) {
    const panels = document.querySelectorAll('.view-panel');
    const dockItems = document.querySelectorAll('.dock-item');

    let found = false;
    panels.forEach(p => {
      if (p.id === viewId) {
        p.classList.add('active');
        found = true;
      } else {
        p.classList.remove('active');
      }
    });

    if (found) {
      this.currentView = viewId;
      dockItems.forEach(d => {
        d.classList.toggle('active', d.dataset.view === viewId);
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  bindDropzone() {
    const dropzone = document.getElementById('main-upload-dropzone');
    const fileInput = document.getElementById('main-file-input');

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });
      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
      dropzone.addEventListener('drop', async (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          await this.handleImageUpload(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          await this.handleImageUpload(e.target.files[0]);
        }
      });
    }

    // Secondary dropzone on Analysis view
    const dropzone2 = document.getElementById('analysis-upload-dropzone');
    const fileInput2 = document.getElementById('analysis-file-input');
    if (dropzone2 && fileInput2) {
      dropzone2.addEventListener('click', () => fileInput2.click());
      fileInput2.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          await this.handleImageUpload(e.target.files[0]);
        }
      });
    }
  }

  async handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      await this.loadCustomImage(e.target.result, file.name || 'Uploaded Satellite Imagery');
      this.showToast('IMAGE LOADED', `Ingested: ${file.name}`, 'success');
      this.switchView('view-analysis');
    };
    reader.readAsDataURL(file);
  }

  async loadCustomImage(imageSrc, title = 'Custom Satellite Data') {
    this.currentImageSource = imageSrc;
    this.currentDatasetTitle = title;

    // Update image views
    const mainImg = document.getElementById('current-analyzed-img');
    const overviewImg = document.getElementById('overview-preview-img');
    if (mainImg) mainImg.src = imageSrc;
    if (overviewImg) overviewImg.src = imageSrc;

    // Run spectral processor
    await this.processor.loadImage(imageSrc);
    this.runCurrentAnalysis();
  }

  runCurrentAnalysis() {
    const res = this.processor.analyzeCurrentImage();
    if (!res) return;
    this.currentAnalysisResult = res;

    // Update UI across all 25 modules
    this.updateGauges(res);
    this.renderFalseColorMasks(res);
    this.updateExplainText(res);

    // Update Smart Crop Monitor
    if (window.AstroCrops) window.AstroCrops.setAnalysisData(res);

    // Record in Analytics & LocalStorage
    if (window.AstroAnalytics) window.AstroAnalytics.recordAnalysis(res, 'agriculture');

    // Auto-save to IndexedDB if enabled
    const autoSave = localStorage.getItem('astronova_autosave') !== 'false';
    if (autoSave && window.AstroStorage) {
      window.AstroStorage.saveRecord({
        title: this.currentDatasetTitle,
        type: 'analysis',
        imageDataUrl: this.currentImageSource,
        data: res
      });
    }

    // Trigger local notification
    this.triggerNotification('Spectral Analysis Completed', `Vegetation Health: ${res.vegetation.healthScore}% | Water: ${res.water.coverage}%`);
  }

  updateGauges(res) {
    // Helper to update circular SVG meter: perimeter = 2 * PI * 60 = 377
    const setGauge = (circleId, numberId, val, max = 100) => {
      const circle = document.getElementById(circleId);
      const numberEl = document.getElementById(numberId);
      if (numberEl) numberEl.textContent = val;
      if (circle) {
        const offset = 377 - (val / max) * 377;
        circle.style.strokeDashoffset = offset;
      }
    };

    // Circular meters
    setGauge('veg-gauge-circle', 'veg-gauge-val', res.vegetation.percentage);
    setGauge('health-gauge-circle', 'health-gauge-val', res.vegetation.healthScore);
    setGauge('water-gauge-circle', 'water-gauge-val', res.water.coverage);
    setGauge('dry-gauge-circle', 'dry-gauge-val', res.drought.drynessPercentage);

    // Text metrics
    const setTxt = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };

    setTxt('water-ratio-val', res.water.waterToLandRatio);
    setTxt('water-regions-val', res.water.regionsEstimate);
    setTxt('fire-burn-val', `${res.fire.burnPercentage}%`);
    setTxt('fire-damage-val', res.fire.damageIndicator);
    setTxt('drought-risk-val', res.drought.riskLevel);
  }

  renderFalseColorMasks(res) {
    // Render false color overlays on canvas tabs
    const vegCanvas = document.getElementById('canvas-veg-mask');
    const waterCanvas = document.getElementById('canvas-water-mask');
    const fireCanvas = document.getElementById('canvas-fire-mask');
    const droughtCanvas = document.getElementById('canvas-drought-mask');

    if (vegCanvas) this.processor.renderMaskToCanvas(vegCanvas, res.masks.vegMask, res.masks.width, res.masks.height);
    if (waterCanvas) this.processor.renderMaskToCanvas(waterCanvas, res.masks.waterMask, res.masks.width, res.masks.height);
    if (fireCanvas) this.processor.renderMaskToCanvas(fireCanvas, res.masks.fireMask, res.masks.width, res.masks.height);
    if (droughtCanvas) this.processor.renderMaskToCanvas(droughtCanvas, res.masks.droughtMask, res.masks.width, res.masks.height);
  }

  bindExplainTabs() {
    const tabs = document.querySelectorAll('.explain-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        tabs.forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.dataset.explainMode;
        document.getElementById('explain-simple-box').style.display = mode === 'simple' ? 'block' : 'none';
        document.getElementById('explain-tech-box').style.display = mode === 'tech' ? 'block' : 'none';
      });
    });
  }

  updateExplainText(res) {
    const simpleEl = document.getElementById('explain-simple-text');
    const techEl = document.getElementById('explain-tech-text');

    if (simpleEl) {
      let desc = '';
      if (res.vegetation.percentage > 50) {
        desc = `Your image displays a high vegetation density of approximately ${res.vegetation.percentage}%. Plant canopy appears thriving and well-hydrated. `;
      } else {
        desc = `Your image indicates lower greenness (${res.vegetation.percentage}%) with moderate soil dryness (${res.drought.drynessPercentage}%). `;
      }
      if (res.water.coverage > 20) {
        desc += `Notable water bodies or irrigation channels were identified (${res.water.coverage}% coverage). `;
      }
      if (res.fire.burnPercentage > 5) {
        desc += `Low-to-moderate charred / dark pixel clusters detected (${res.fire.burnPercentage}%). `;
      }
      desc += 'All conclusions are generated locally on this device as educational estimates.';
      simpleEl.textContent = desc;
    }

    if (techEl) {
      techEl.innerHTML = `
        <strong>Algorithm Details:</strong><br>
        • Excess Green Index: <code>ExG = 2G - R - B</code><br>
        • Mean RGB Channel Intensities: R=${res.channels.avgR}, G=${res.channels.avgG}, B=${res.channels.avgB}, Luma=${res.channels.avgLuma}<br>
        • Spectral Water Ratio: <code>${res.water.waterToLandRatio}</code> | Estimated Water Inundation Segments: <code>${res.water.regionsEstimate}</code><br>
        • Aridity / Drought Evaluation: Chlorophyll Depletion Index with High Soil Reflectance Thresholding (Risk: <code>${res.drought.riskLevel}</code>)<br>
        • Active Pixels Processed: <code>${res.metadata.totalPixels.toLocaleString()} px</code> | Executed 100% client-side via HTML5 Canvas.
      `;
    }
  }

  bindDemoPresets() {
    const demoButtons = document.querySelectorAll('.btn-load-demo-preset');
    demoButtons.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const scenario = e.currentTarget.dataset.scenario;
        const title = e.currentTarget.dataset.title || 'Demo Satellite Scene';
        const imgData = DemoDataGenerator.createDemoImage(scenario);
        await this.loadCustomImage(imgData, `${title} [DEMO]`);
        this.switchView('view-analysis');
        this.showToast('DEMO DATASET LOADED', `${title} loaded offline.`, 'info');
      });
    });

    // Top navbar Quick Demo Mode button
    const quickDemoBtn = document.getElementById('btn-quick-demo-mode');
    if (quickDemoBtn) {
      quickDemoBtn.addEventListener('click', async () => {
        const scenarios = ['agricultural_land', 'flooded_area', 'dry_land', 'forest', 'fire_burn'];
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        const imgData = DemoDataGenerator.createDemoImage(randomScenario);
        await this.loadCustomImage(imgData, `Quick Demo: ${randomScenario.replace('_', ' ').toUpperCase()} [DEMO]`);
        this.switchView('view-analysis');
        this.showToast('DEMO MODE ACTIVE', 'Loaded pre-bundled simulated satellite scenario.', 'info');
      });
    }
  }

  bindSettings() {
    // Theme Switcher (existing colour themes)
    const themeSelect = document.getElementById('setting-theme-select');
    if (themeSelect) {
      const savedTheme = localStorage.getItem('astronova_theme') || 'default';
      themeSelect.value = savedTheme;
      document.documentElement.setAttribute('data-theme', savedTheme);
      themeSelect.addEventListener('change', (e) => {
        const th = e.target.value;
        document.documentElement.setAttribute('data-theme', th);
        localStorage.setItem('astronova_theme', th);
        this.showToast('THEME UPDATED', `Applied theme: ${th.toUpperCase()}`, 'info');
      });
    }

    // Sound FX toggle in Settings
    const soundCheckbox = document.getElementById('setting-sound-toggle');
    if (soundCheckbox) {
      soundCheckbox.checked = window.AstroSound ? !window.AstroSound.isMuted : true;
      soundCheckbox.addEventListener('change', (e) => {
        if (window.AstroSound) {
          window.AstroSound.setMuted(!e.target.checked);
          if (e.target.checked) window.AstroSound.playToggle();
        }
      });
    }

    // Clear history / data buttons
    const clearDataBtn = document.getElementById('btn-clear-local-data');
    if (clearDataBtn) {
      clearDataBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to delete all stored images, dossiers, and history? This cannot be undone.')) {
          if (window.AstroStorage) await window.AstroStorage.clearAllData();
          this.showToast('DATA CLEARED', 'All local prototype data wiped successfully.', 'warning');
        }
      });
    }

    // Export Data JSON
    const exportBtn = document.getElementById('btn-export-json');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        if (window.AstroStorage) window.AstroStorage.exportDataJSON();
      });
    }

    // Import Data JSON
    const importInput = document.getElementById('setting-import-file');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          const r = new FileReader();
          r.onload = (evt) => {
            if (window.AstroStorage) window.AstroStorage.importDataJSON(evt.target.result);
          };
          r.readAsText(e.target.files[0]);
        }
      });
    }
  }

  bindOfflineListener() {
    const badge = document.getElementById('network-status-badge');
    const updateStatus = () => {
      const isOffline = !navigator.onLine;
      if (badge) {
        if (isOffline) {
          badge.textContent = '📴 Offline Mode – Running Locally';
          badge.className = 'status-badge-live btn-accent-gold';
          this.showToast('OFFLINE MODE', 'Operating completely client-side without internet.', 'info');
        } else {
          badge.textContent = '🛰️ Local Prototype Active';
          badge.className = 'status-badge-live';
        }
      }
    };

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
  }

  triggerNotification(title, body) {
    // Show in-app toast
    this.showToast(title, body, 'info');

    // Also browser notification if user permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`[AstroNova Prototype] ${title}`, {
          body: `${body} (SIMULATED EVENT)`,
          icon: 'assets/icons/icon-192.png'
        });
      } catch (e) {}
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  showToast(title, msg, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconMap = {
      info: '🛰️',
      success: '✅',
      warning: '⚠️',
      error: '🛑'
    };

    toast.innerHTML = `
      <div class="toast-icon">${iconMap[type] || '🛰️'}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${msg}</div>
      </div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 350);
    }, 4200);
  }
}

// Bootstrap on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  window.AstroApp = new AstroNovaApp();
});
