/**
 * ASTRONOVA - Sound Effects & Audio Controller
 * Synthesizes crisp, futuristic cyber-audio using Web Audio API.
 * Ensures zero external file dependencies and instant responsiveness.
 * Hooks globally onto all button clicks with persistent mute toggle.
 */

class SoundEffectsManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = localStorage.getItem('astronova_sound_muted') === 'true';
    this.init();
  }

  init() {
    // Hook globally to user interaction to unlock Web Audio context
    const unlockAudio = () => {
      this.ensureContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    // Global listener for all button & clickable interactions
    document.addEventListener('click', (e) => {
      const target = e.target.closest('button, .btn-hud, .dock-item, .mission-sat-tab, .tab-btn, .btn-load-demo-preset, input[type="checkbox"], input[type="radio"], select, a[href]');
      if (target) {
        // Play click sound
        this.playClick();
      }
    }, true);

    this.updateUI();
  }

  ensureContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Universal cyber-click sound: crisp high-tech blip with fast decay
   */
  playClick() {
    if (this.isMuted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const now = ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.045);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (err) {
      console.warn('Audio click error:', err);
    }
  }

  /**
   * Pleasant authorization / success chime for device login
   */
  playSuccess() {
    if (this.isMuted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const noteTime = now + index * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.1, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.24);
      });
    } catch (err) {
      console.warn('Audio success error:', err);
    }
  }

  /**
   * Harsh warning / lockout tone for unauthorized device attempts
   */
  playDenied() {
    if (this.isMuted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      [0, 0.12].forEach(offset => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const t = now + offset;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, t);
        osc.frequency.setValueAtTime(110, t + 0.05);

        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.1);
      });
    } catch (err) {
      console.warn('Audio denied error:', err);
    }
  }

  /**
   * Subtle high beep for mode toggling
   */
  playToggle() {
    if (this.isMuted) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch (err) {
      console.warn('Audio toggle error:', err);
    }
  }

  /**
   * Toggle mute state and save to localStorage
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('astronova_sound_muted', this.isMuted ? 'true' : 'false');
    this.updateUI();
    if (!this.isMuted) {
      this.playToggle();
    }
    if (window.AstroApp && window.AstroApp.showToast) {
      window.AstroApp.showToast(
        this.isMuted ? 'AUDIO MUTED' : 'AUDIO ACTIVE',
        this.isMuted ? 'Button click sound effects are now muted.' : 'Button click sound effects are now active.',
        'info'
      );
    }
    return this.isMuted;
  }

  setMuted(muted) {
    this.isMuted = !!muted;
    localStorage.setItem('astronova_sound_muted', this.isMuted ? 'true' : 'false');
    this.updateUI();
  }

  updateUI() {
    const btn = document.getElementById('btn-sound-toggle');
    if (btn) {
      const i18n = window.AstroI18n;
      const label = this.isMuted
        ? (i18n ? i18n.t('soundOff') : 'Sound: OFF')
        : (i18n ? i18n.t('soundOn') : 'Sound: ON');
      btn.innerHTML = (this.isMuted ? '<span>🔇</span>' : '<span>🔊</span>') + ` <span class="btn-text">${label}</span>`;
      btn.title = this.isMuted ? 'Unmute button click sound effects' : 'Mute button click sound effects';
      btn.classList.toggle('muted', this.isMuted);
    }

    const settingsCheckbox = document.getElementById('setting-sound-toggle');
    if (settingsCheckbox) {
      settingsCheckbox.checked = !this.isMuted;
    }
  }
}

window.SoundEffectsManager = SoundEffectsManager;
