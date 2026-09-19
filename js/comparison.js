/**
 * ASTRONOVA - Before vs After Image Comparison Studio
 * Visual comparison slider + local pixel-level difference analysis
 * Calculates: Vegetation change, Water change, Brightness change, Land change
 */

class ImageComparisonStudio {
  constructor() {
    this.container = document.getElementById('comparison-box');
    this.handle = document.getElementById('comparison-handle');
    this.afterLayer = document.getElementById('comparison-after-layer');
    this.beforeImg = document.getElementById('comp-img-before');
    this.afterImg = document.getElementById('comp-img-after');

    this.isDragging = false;
    this.processor = new RemoteSensingProcessor();

    this.beforeData = null;
    this.afterData = null;

    this.initEvents();
  }

  initEvents() {
    if (!this.container || !this.handle) return;

    const onMove = (clientX) => {
      if (!this.isDragging) return;
      const rect = this.container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      offsetX = Math.max(0, Math.min(offsetX, rect.width));
      const percentage = (offsetX / rect.width) * 100;

      this.handle.style.left = `${percentage}%`;
      if (this.afterLayer) {
        this.afterLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
      }
    };

    this.handle.addEventListener('mousedown', () => (this.isDragging = true));
    window.addEventListener('mouseup', () => (this.isDragging = false));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));

    // Touch support for mobile devices
    this.handle.addEventListener('touchstart', () => (this.isDragging = true), { passive: true });
    window.addEventListener('touchend', () => (this.isDragging = false));
    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) onMove(e.touches[0].clientX);
    });

    // File inputs for Before and After
    const beforeInput = document.getElementById('comp-upload-before');
    const afterInput = document.getElementById('comp-upload-after');

    if (beforeInput) {
      beforeInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          await this.loadBefore(e.target.files[0]);
        }
      });
    }

    if (afterInput) {
      afterInput.addEventListener('change', async (e) => {
        if (e.target.files && e.target.files[0]) {
          await this.loadAfter(e.target.files[0]);
        }
      });
    }
  }

  async loadBefore(source) {
    if (this.beforeImg) {
      if (source instanceof File || source instanceof Blob) {
        this.beforeImg.src = URL.createObjectURL(source);
      } else {
        this.beforeImg.src = source;
      }
    }
    await this.processor.loadImage(source);
    this.beforeData = this.processor.analyzeCurrentImage();
    this.recomputeDifferences();
  }

  async loadAfter(source) {
    if (this.afterImg) {
      if (source instanceof File || source instanceof Blob) {
        this.afterImg.src = URL.createObjectURL(source);
      } else {
        this.afterImg.src = source;
      }
    }
    await this.processor.loadImage(source);
    this.afterData = this.processor.analyzeCurrentImage();
    this.recomputeDifferences();
  }

  recomputeDifferences() {
    if (!this.beforeData || !this.afterData) return;

    const bVeg = this.beforeData.vegetation.percentage;
    const aVeg = this.afterData.vegetation.percentage;
    const vegDelta = aVeg - bVeg;

    const bWater = this.beforeData.water.coverage;
    const aWater = this.afterData.water.coverage;
    const waterDelta = aWater - bWater;

    const bLuma = this.beforeData.channels.avgLuma;
    const aLuma = this.afterData.channels.avgLuma;
    const lumaDelta = Math.round(((aLuma - bLuma) / 255) * 100);

    const bDry = this.beforeData.drought.drynessPercentage;
    const aDry = this.afterData.drought.drynessPercentage;
    const landDelta = aDry - bDry;

    this.updateDeltaUI('delta-veg', vegDelta, '%');
    this.updateDeltaUI('delta-water', waterDelta, '%');
    this.updateDeltaUI('delta-luma', lumaDelta, '%');
    this.updateDeltaUI('delta-land', landDelta, '%');

    if (window.AstroApp && window.AstroApp.showToast) {
      window.AstroApp.showToast('COMPARISON READY', 'Dual image spectral differential computed.', 'info');
    }
  }

  updateDeltaUI(elementId, value, unit) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const sign = value > 0 ? '+' : '';
    el.textContent = `${sign}${value}${unit}`;
    el.className = 'delta-stat-val ' + (value > 0 ? 'text-green' : (value < 0 ? 'text-red' : 'text-cyan'));
  }
}

window.ImageComparisonStudio = ImageComparisonStudio;
