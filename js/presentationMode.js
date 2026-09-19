/**
 * ASTRONOVA - Project Presentation Mode
 * Specially designed for college evaluators, professors, and demonstrations.
 * Complete 7-Step Workflow:
 * Ingest Image -> Local Analysis -> AI-Style Interpretation ->
 * Agriculture / Disaster Assessment -> Charts -> Report -> Share
 */

class PresentationMode {
  constructor() {
    this.overlay = document.getElementById('presentation-overlay');
    this.currentStep = 0;
    this.autoPlayInterval = null;
    this.isAutoPlaying = false;

    this.steps = [
      {
        title: 'Step 1: Image Ingestion & Sensor Simulation',
        subtitle: 'Optical & Radar Remote Sensing Ingestion',
        icon: '🛰️',
        summary: 'AstroNova receives high-resolution multispectral imagery directly in the browser via file upload, camera scan, or bundled offline demo datasets. Zero data ever leaves the local machine.',
        techDetails: 'Uses HTML5 FileReader & WebRTC Camera API. Complies with 100% offline privacy architecture.',
        demoAction: 'Load Demo Agricultural Parcel'
      },
      {
        title: 'Step 2: Client-Side Pixel Spectral Analysis',
        subtitle: 'Excess Green (ExG), Modified NDWI, and Thermal Segmentation',
        icon: '🔬',
        summary: 'Directly in client RAM using HTML5 Canvas ImageData, millions of pixels are processed per second without external servers or cloud APIs. The engine isolates chlorophyll reflectance, blue/cyan water absorption, and charred burn signatures.',
        techDetails: 'Mathematical algorithms: ExG = 2G - R - B, NDWI approx = (Green - Blue)/(Green + Blue), and thermal radiance clustering.',
        demoAction: 'Run Local Spectral Engine'
      },
      {
        title: 'Step 3: Dual-Mode AI-Style Interpretation',
        subtitle: 'Democratizing Remote Sensing Data',
        icon: '🧠',
        summary: 'AstroNova translates raw spectral numbers into two distinct formats: "Simple Explanation" for non-technical field workers/farmers, and "Technical Explanation" for researchers and engineers.',
        techDetails: 'Client-side heuristic reasoning engine maps computed reflectance percentages to plain language diagnostics.',
        demoAction: 'Inspect Simple vs Technical Tabs'
      },
      {
        title: 'Step 4: Agriculture & Disaster Assessment',
        subtitle: 'Targeted Crop Vigor & Simulated Risk Telemetry',
        icon: '🌾',
        summary: 'Tailors diagnostics to specific crops (Rice, Wheat, Maize, Cotton, Vegetables) and classifies disaster indicators (Flood, Drought, Wildfire, Landslide) with clear non-authoritative disclaimers.',
        techDetails: 'Evaluates moisture requirement matrices and regional terrain risk overlays.',
        demoAction: 'View Crop Guidance'
      },
      {
        title: 'Step 5: Dynamic Animated Charts & Gauges',
        subtitle: 'Multi-Series Temporal Trends',
        icon: '📊',
        summary: 'Animated SVG circular meters track Vegetation Health % and Water % in real time, while a multi-point canvas timeline charts land changes across Days 1, 7, 14, 21, and 28.',
        techDetails: 'Pure Canvas & SVG drawing with zero external charting library dependencies.',
        demoAction: 'View Animated Gauges'
      },
      {
        title: 'Step 6: Smart Intelligence Report Generation',
        subtitle: 'Printable & Exportable Official Dossier',
        icon: '📄',
        summary: 'Generates a publication-grade Remote Sensing Intelligence Brief complete with AstroNova crest, spectral breakdown, crop status, timestamps, and prototype notices.',
        techDetails: 'Print CSS media query formatting with instant browser PDF export.',
        demoAction: 'Preview Intelligence Report'
      },
      {
        title: 'Step 7: 100% Offline Local Data & Privacy',
        subtitle: 'IndexedDB "My Earth Data" & Privacy Center',
        icon: '🔐',
        summary: 'All image assets, comparisons, and dossiers reside safely in client-side IndexedDB. Users can favorite, rename, export JSON, or wipe all records with zero cloud dependency.',
        techDetails: 'Structured IndexedDB object store with offline PWA Service Worker caching.',
        demoAction: 'Examine Privacy Vault'
      }
    ];

    this.init();
  }

  init() {
    const launchBtn = document.getElementById('btn-presentation-mode');
    const closeBtn = document.getElementById('presentation-close-btn');
    const prevBtn = document.getElementById('pres-prev-btn');
    const nextBtn = document.getElementById('pres-next-btn');
    const autoBtn = document.getElementById('pres-auto-btn');

    if (launchBtn) launchBtn.addEventListener('click', () => this.open());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
    if (nextBtn) nextBtn.addEventListener('click', () => this.next());
    if (autoBtn) autoBtn.addEventListener('click', () => this.toggleAutoPlay());

    this.renderStepper();
  }

  open() {
    if (!this.overlay) return;
    this.overlay.classList.add('active');
    this.currentStep = 0;
    this.updateSlide();
  }

  close() {
    if (!this.overlay) return;
    this.overlay.classList.remove('active');
    this.stopAutoPlay();
  }

  renderStepper() {
    const container = document.getElementById('presentation-stepper-chips');
    if (!container) return;

    container.innerHTML = this.steps.map((step, idx) => `
      <div class="step-chip ${idx === 0 ? 'active' : ''}" data-index="${idx}">
        ${step.icon} Step ${idx + 1}
      </div>
    `).join('');

    container.querySelectorAll('.step-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index, 10);
        this.goToStep(idx);
      });
    });
  }

  goToStep(index) {
    this.currentStep = Math.max(0, Math.min(index, this.steps.length - 1));
    this.updateSlide();
  }

  next() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateSlide();
    } else if (this.isAutoPlaying) {
      this.currentStep = 0;
      this.updateSlide();
    }
  }

  prev() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateSlide();
    }
  }

  toggleAutoPlay() {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
  }

  startAutoPlay() {
    this.isAutoPlaying = true;
    const btn = document.getElementById('pres-auto-btn');
    if (btn) btn.textContent = '⏸ Pause Auto';
    this.autoPlayInterval = setInterval(() => this.next(), 6000);
  }

  stopAutoPlay() {
    this.isAutoPlaying = false;
    const btn = document.getElementById('pres-auto-btn');
    if (btn) btn.textContent = '▶ Auto Play (6s)';
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  updateSlide() {
    const step = this.steps[this.currentStep];
    if (!step) return;

    // Update chips
    const chips = document.querySelectorAll('.step-chip');
    chips.forEach((c, idx) => c.classList.toggle('active', idx === this.currentStep));

    // Update content viewport
    const titleEl = document.getElementById('pres-slide-title');
    const subtitleEl = document.getElementById('pres-slide-subtitle');
    const summaryEl = document.getElementById('pres-slide-summary');
    const techEl = document.getElementById('pres-slide-tech');
    const counterEl = document.getElementById('pres-slide-counter');

    if (titleEl) titleEl.innerHTML = `${step.icon} ${step.title}`;
    if (subtitleEl) subtitleEl.textContent = step.subtitle;
    if (summaryEl) summaryEl.textContent = step.summary;
    if (techEl) techEl.innerHTML = `<strong>Engineering Implementation:</strong> ${step.techDetails}`;
    if (counterEl) counterEl.textContent = `${this.currentStep + 1} / ${this.steps.length}`;
  }
}

window.PresentationMode = PresentationMode;
