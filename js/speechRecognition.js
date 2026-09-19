/**
 * ASTRONOVA - Voice Commands Controller
 * Browser Speech Recognition integration with Voice HUD Visualizer
 * Fully supports 10 languages and seamlessly bridges to the AI Assistant.
 */

class VoiceCommandsController {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.hud = document.getElementById('voice-hud-indicator');
    this.hudText = document.getElementById('voice-hud-text');
    this.btn = document.getElementById('btn-voice-toggle');

    this.init();
  }

  getLocale() {
    return window.AstroI18n ? window.AstroI18n.getLocale() : 'en-US';
  }

  init() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('Speech Recognition not supported in this browser.');
      if (this.btn) {
        this.btn.title = 'Speech recognition not supported by browser';
        this.btn.style.opacity = '0.5';
      }
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = this.getLocale();

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.hud) this.hud.classList.add('active');
      if (this.hudText) {
        this.hudText.textContent = 'Listening for AstroNova voice commands or questions...';
      }
      if (this.btn) this.btn.classList.add('active');
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.hud) this.hud.classList.remove('active');
      if (this.btn) this.btn.classList.remove('active');
    };

    this.recognition.onerror = (e) => {
      console.warn('Speech recognition error:', e.error);
      this.isListening = false;
      if (this.hud) this.hud.classList.remove('active');
      if (this.btn) this.btn.classList.remove('active');
      if (window.AstroApp) {
        window.AstroApp.showToast('VOICE INPUT', `Microphone status: ${e.error}`, 'warning');
      }
    };

    this.recognition.onresult = (e) => {
      if (e.results && e.results[0] && e.results[0][0]) {
        const transcript = e.results[0][0].transcript.trim();
        this.handleCommand(transcript);
      }
    };

    if (this.btn) {
      this.btn.addEventListener('click', () => this.toggleListening());
    }

    // Update recognition language when language is changed
    window.addEventListener('astronovaLanguageChanged', (e) => {
      if (this.recognition) {
        this.recognition.lang = e.detail?.locale || this.getLocale();
      }
    });
  }

  toggleListening() {
    if (!this.recognition) {
      if (window.AstroApp) {
        window.AstroApp.showToast('VOICE COMMANDS', 'Web Speech API is not supported on this browser.', 'warning');
      }
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.lang = this.getLocale();
        this.recognition.start();
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    }
  }

  handleCommand(phrase) {
    const lower = phrase.toLowerCase().trim();
    if (this.hudText) {
      this.hudText.textContent = `Heard: "${phrase}"`;
    }
    if (window.AstroApp) {
      window.AstroApp.showToast('VOICE HEARD', `"${phrase}"`, 'info');
    }

    // Direct Navigation Matches across multiple languages
    if (/பகுப்பாய்வு|நிறமாலை|analysis|spectral|विश्लेषण|विश্লেষণ|ವಿಶ್ಲೇಷಣೆ|విశ్లేషణ|анализ|analyse|análisis/i.test(lower)) {
      window.AstroApp.switchView('view-analysis');
      return;
    }
    if (/பயிர்|விவசாயம்|crop|agriculture|फसल|കൃഷി|ಬೆಳೆ|పంట|शेती|урожай|ernte|cultivo/i.test(lower)) {
      window.AstroApp.switchView('view-crops');
      return;
    }
    if (/மிஷன்|mission|उपग्रह|satellite|satellit|сателлит|कட்டுப்பாடு/i.test(lower)) {
      window.AstroApp.switchView('view-mission');
      return;
    }
    if (/பூமி|earth|twin|पृथ्वी|ഭൂമി|ಭೂಮಿ|భూమి|земля|erde|tierra/i.test(lower)) {
      window.AstroApp.switchView('view-earth');
      return;
    }
    if (/முகப்பு|கண்ணோட்டம்|home|overview|dashboard|अवलोकन|विहंगावलोकन|обзор|übersicht|inicio/i.test(lower)) {
      window.AstroApp.switchView('view-overview');
      return;
    }

    // If it's a question (e.g. rain, sun, yield, land, etc.), pass directly to AI assistant!
    if (window.AstroAI) {
      window.AstroAI.openDrawer();
      window.AstroAI.processUserInput(phrase, true);
    }
  }
}

window.VoiceCommandsController = VoiceCommandsController;
