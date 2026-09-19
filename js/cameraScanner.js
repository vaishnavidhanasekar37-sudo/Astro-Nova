/**
 * ASTRONOVA - Camera Analysis Scanner
 * 4-Step Camera Workflow: Capture -> Preview -> Analyze -> Result
 * WebRTC navigator.mediaDevices.getUserMedia integration
 */

class CameraScanner {
  constructor() {
    this.modal = document.getElementById('camera-scan-modal');
    this.video = document.getElementById('camera-video-preview');
    this.canvas = document.getElementById('camera-capture-canvas');
    this.previewImg = document.getElementById('camera-captured-preview');

    this.stream = null;
    this.capturedDataUrl = null;

    this.init();
  }

  init() {
    const openBtn = document.getElementById('btn-open-camera');
    const closeBtn = document.getElementById('camera-modal-close');
    const captureBtn = document.getElementById('btn-camera-capture');
    const retakeBtn = document.getElementById('btn-camera-retake');
    const analyzeBtn = document.getElementById('btn-camera-analyze');

    if (openBtn) openBtn.addEventListener('click', () => this.open());
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (captureBtn) captureBtn.addEventListener('click', () => this.capture());
    if (retakeBtn) retakeBtn.addEventListener('click', () => this.retake());
    if (analyzeBtn) analyzeBtn.addEventListener('click', () => this.sendToAnalysis());
  }

  async open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    this.setStep(1); // Step 1: Live View

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      if (this.video) {
        this.video.srcObject = this.stream;
        this.video.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      if (window.AstroApp) {
        window.AstroApp.showToast('CAMERA ERROR', 'Unable to access camera. Please check permissions.', 'error');
      }
      this.close();
    }
  }

  close() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.modal) this.modal.classList.remove('active');
  }

  capture() {
    if (!this.video || !this.canvas) return;
    const w = this.video.videoWidth || 640;
    const h = this.video.videoHeight || 480;
    this.canvas.width = w;
    this.canvas.height = h;

    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.video, 0, 0, w, h);

    this.capturedDataUrl = this.canvas.toDataURL('image/png');
    if (this.previewImg) {
      this.previewImg.src = this.capturedDataUrl;
    }

    this.setStep(2); // Step 2: Preview
  }

  retake() {
    this.capturedDataUrl = null;
    this.setStep(1);
  }

  async sendToAnalysis() {
    if (!this.capturedDataUrl) return;
    this.setStep(3); // Step 3: Analyzing

    if (window.AstroApp) {
      await window.AstroApp.loadCustomImage(this.capturedDataUrl, 'Camera Scan Capture');
      this.close();
      window.AstroApp.switchView('view-analysis');
      window.AstroApp.showToast('CAMERA SCAN LOADED', 'Image successfully analyzed in spectral engine.', 'success');
    }
  }

  setStep(stepNum) {
    // 1: Live Video, 2: Preview & Confirm, 3: Analyzing spinner
    const liveSec = document.getElementById('camera-step-live');
    const prevSec = document.getElementById('camera-step-preview');
    const spinSec = document.getElementById('camera-step-analyzing');

    if (liveSec) liveSec.style.display = stepNum === 1 ? 'block' : 'none';
    if (prevSec) prevSec.style.display = stepNum === 2 ? 'block' : 'none';
    if (spinSec) spinSec.style.display = stepNum === 3 ? 'block' : 'none';
  }
}

window.CameraScanner = CameraScanner;
