/**
 * ASTRONOVA - Space Welcome Splash Screen Controller
 * Presents the realistic 3D rotating planets in space with "Welcome Astronova"
 * Pure 1-click entry into Mission Control. No login forms, no username/email inputs.
 * Includes interactive 10-language switching right from the splash screen.
 */

class DeviceAuthManager {
  constructor() {
    this.sessionKey = 'astronova_welcome_seen';
    this.isAuthenticated = true;
    this.init();
  }

  init() {
    this.bindEvents();
    this.syncActiveLanguagePills();

    // Always present the rotating planets Welcome Astronova screen on launch
    this.showWelcomeScreen();

    window.addEventListener('astronovaLanguageChanged', (e) => {
      this.syncActiveLanguagePills(e.detail?.lang);
    });
  }

  bindEvents() {
    // 1-Click "Enter AstroNova" button
    const enterBtn = document.getElementById('btn-enter-astronova');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        this.enterDashboard();
      });
    }

    // Language pills on splash screen
    const pills = document.querySelectorAll('.welcome-lang-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        const lang = e.currentTarget.dataset.lang;
        if (lang && window.AstroI18n) {
          window.AstroI18n.setLanguage(lang);
          if (window.AstroSound) window.AstroSound.playClick();
        }
      });
    });

    // Replay Intro button in navbar
    const replayIntro = document.getElementById('btn-replay-intro');
    if (replayIntro) {
      replayIntro.addEventListener('click', () => {
        this.showWelcomeScreen();
      });
    }

    // Lock terminal button in navbar
    const lockBtn = document.getElementById('btn-lock-device');
    if (lockBtn) {
      lockBtn.addEventListener('click', () => {
        this.showWelcomeScreen();
      });
    }
  }

  syncActiveLanguagePills(activeLang) {
    const currentLang = activeLang || (window.AstroI18n ? window.AstroI18n.currentLang : 'en');
    const pills = document.querySelectorAll('.welcome-lang-pill');
    pills.forEach(p => {
      p.classList.toggle('active', p.dataset.lang === currentLang);
    });
  }

  showWelcomeScreen() {
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
      overlay.style.display = 'flex';
      overlay.style.opacity = '1';
      overlay.style.visibility = 'visible';

      // Ensure intro 3D planetary animation is running
      if (window.SpaceIntroInstance) {
        window.SpaceIntroInstance.start();
      }
    }
    this.syncActiveLanguagePills();
    if (window.AstroSound) window.AstroSound.playToggle();
  }

  enterDashboard() {
    const overlay = document.getElementById('intro-overlay');
    sessionStorage.setItem(this.sessionKey, 'true');

    if (window.AstroSound) window.AstroSound.playSuccess();

    if (overlay) {
      overlay.style.transition = 'opacity 0.6s ease, visibility 0.6s ease';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 650);
    }

    if (window.AstroApp && window.AstroApp.showToast) {
      const currentLang = window.AstroI18n ? window.AstroI18n.currentLang : 'en';
      const welcomeMessages = {
        en: { title: 'WELCOME TO ASTRONOVA', desc: 'Remote sensing earth intelligence AI mission console active.' },
        ta: { title: 'வரவேற்கிறோம்', desc: 'தொலை உணர்வு பூமி நுண்ணறிவு முனையம் தயார்.' },
        hi: { title: 'एस्ट्रोनोवा में आपका स्वागत है', desc: 'रिमोट सेंसिंग अर्थ इंटेलिजेंस मिशन कंसोल सक्रिय है।' },
        ml: { title: 'സ്വാഗതം ആസ്ട്രോനോവ', desc: 'ഭൗമ നിരീക്ഷണ കൺസോൾ സജീവം.' },
        kn: { title: 'ಆಸ್ಟ್ರೋನೋವಾಗೆ ಸುಸ್ವಾಗತ', desc: 'ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್ ಕನ್ಸೋಲ್ ಸಕ್ರಿಯವಾಗಿದೆ.' },
        te: { title: 'ఆస్ట్రోనోవాకు స్వాగతం', desc: 'రిమోట్ సెన్సింగ్ కన్సోల్ సక్రియంగా ఉంది.' },
        mr: { title: 'अ‍ॅस्ट्रोनोव्हा मध्ये स्वागत', desc: 'रिमोट सेन्सिंग कन्सोल सक्रिय आहे.' },
        ru: { title: 'ДОБРО ПОЖАЛОВАТЬ В АСТРОНОВА', desc: 'Консоль ИИ дистанционного зондирования активна.' },
        de: { title: 'WILLKOMMEN BEI ASTRONOVA', desc: 'Fernerkundungs-KI-Konsole aktiv.' },
        es: { title: 'BIENVENIDO A ASTRONOVA', desc: 'Consola de IA de teledetección activa.' }
      };
      const msg = welcomeMessages[currentLang] || welcomeMessages.en;
      window.AstroApp.showToast(msg.title, msg.desc, 'success');
    }
  }

  hideWelcomeImmediate() {
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.style.opacity = '0';
      overlay.style.visibility = 'hidden';
    }
  }
}

window.DeviceAuthManager = DeviceAuthManager;
