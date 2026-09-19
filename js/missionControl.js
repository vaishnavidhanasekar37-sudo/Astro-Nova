/**
 * ASTRONOVA - Mission Control Center
 * Real-time simulated telemetry for satellites: NOVA-01, TERRA-SCAN, ORBIT-X
 * Orbit tracker, battery, signal strength, altitude, speed, orbit progress,
 * and system health metrics.
 * 
 * Prominently labeled: SIMULATED DATA – PROTOTYPE ONLY
 */

class MissionControlCenter {
  constructor() {
    this.satellites = {
      'NOVA-01': {
        name: 'NOVA-01',
        type: 'Optical Multispectral Sentinel',
        status: 'OPERATIONAL / SCANNING',
        battery: 94,
        signal: -42, // dBm
        altitude: 705, // km
        speed: 7.56, // km/s
        orbitProgress: 68,
        thermal: '+21.4°C',
        solarOutput: '4.8 kW',
        health: '100% NOMINAL',
        angle: 0.8
      },
      'TERRA-SCAN': {
        name: 'TERRA-SCAN',
        type: 'SAR Radar Ground Surveyor',
        status: 'ACTIVE APERTURE BURST',
        battery: 88,
        signal: -48,
        altitude: 680,
        speed: 7.61,
        orbitProgress: 42,
        thermal: '+19.8°C',
        solarOutput: '5.2 kW',
        health: '99.4% OPTIMAL',
        angle: 2.9
      },
      'ORBIT-X': {
        name: 'ORBIT-X',
        type: 'Hyperspectral Thermal Observer',
        status: 'GEO-SYNC CALIBRATION',
        battery: 91,
        signal: -51,
        altitude: 820,
        speed: 7.42,
        orbitProgress: 85,
        thermal: '+23.1°C',
        solarOutput: '6.1 kW',
        health: '100% NOMINAL',
        angle: 4.7
      }
    };

    this.currentSat = 'NOVA-01';
    this.timerId = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.startTelemetryLoop();
    this.updateUI();
  }

  bindEvents() {
    const tabs = document.querySelectorAll('.mission-sat-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const satName = e.currentTarget.dataset.sat;
        if (satName && this.satellites[satName]) {
          this.currentSat = satName;
          tabs.forEach(t => t.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.updateUI();
        }
      });
    });
  }

  startTelemetryLoop() {
    this.timerId = setInterval(() => {
      // Simulate real-time dynamic variations in satellite telemetry
      for (const key in this.satellites) {
        const sat = this.satellites[key];
        sat.orbitProgress = (sat.orbitProgress + 1) % 100;
        sat.angle += 0.02;

        // Subtle micro-fluctuations
        sat.battery = Math.min(100, Math.max(75, Math.round(sat.battery + (Math.random() - 0.5) * 0.4)));
        sat.signal = Math.round(sat.signal + (Math.random() - 0.5) * 1.5);
        sat.altitude = Math.round(sat.altitude + (Math.random() - 0.5) * 0.2);
        sat.speed = (parseFloat(sat.speed) + (Math.random() - 0.5) * 0.005).toFixed(2);
      }

      this.updateUI();
      this.renderSvgTracker();
    }, 1200);
  }

  updateUI() {
    const sat = this.satellites[this.currentSat];
    if (!sat) return;

    const lang = window.AstroI18n ? window.AstroI18n.currentLang : 'en';

    const statusTranslations = {
      ta: {
        'OPERATIONAL / SCANNING': 'செயலில் / ஸ்கேன் செய்கிறது',
        'ACTIVE APERTURE BURST': 'செயலில் உள்ள ரேடார் கற்றை',
        'GEO-SYNC CALIBRATION': 'புவி-ஒத்திசைவு அளவீடு'
      },
      hi: {
        'OPERATIONAL / SCANNING': 'सक्रिय / स्कैनिंग जारी',
        'ACTIVE APERTURE BURST': 'सक्रिय एपर्चर बर्स्ट',
        'GEO-SYNC CALIBRATION': 'भू-तुल्यकालिक अंशांकन'
      }
    };

    const typeTranslations = {
      ta: {
        'Optical Multispectral Sentinel': 'ஒளியியல் பலநிறமாலை சென்டினல்',
        'SAR Radar Ground Surveyor': 'SAR ரேடார் தரை அளவையாளர்',
        'Hyperspectral Thermal Observer': 'ஹைப்பர்ஸ்பெக்ட்ரல் வெப்ப கண்காணிப்பாளர்'
      },
      hi: {
        'Optical Multispectral Sentinel': 'ऑप्टिकल मल्टीस्पेक्ट्रल सेंटिनल',
        'SAR Radar Ground Surveyor': 'एसएआर रडार ग्राउंड सर्वेयर',
        'Hyperspectral Thermal Observer': 'हाइपरस्पेक्ट्रल थर्मल ऑब्जर्वर'
      }
    };

    const healthTranslations = {
      ta: {
        '100% NOMINAL': '100% சிறப்பானது',
        '99.4% OPTIMAL': '99.4% உகந்தது'
      },
      hi: {
        '100% NOMINAL': '100% सामान्य व उत्कृष्ट',
        '99.4% OPTIMAL': '99.4% इष्टतम'
      }
    };

    const localizedStatus = statusTranslations[lang]?.[sat.status] || sat.status;
    const localizedType = typeTranslations[lang]?.[sat.type] || sat.type;
    const localizedHealth = healthTranslations[lang]?.[sat.health] || sat.health;

    // Update active telemetry displays
    this.setText('mc-sat-name', sat.name);
    this.setText('mc-sat-type', localizedType);
    this.setText('mc-sat-status', localizedStatus);
    this.setText('mc-sat-battery', `${sat.battery}%`);
    this.setText('mc-sat-signal', `${sat.signal} dBm`);
    this.setText('mc-sat-altitude', `${sat.altitude} km`);
    this.setText('mc-sat-speed', `${sat.speed} km/s`);
    this.setText('mc-sat-progress', `${sat.orbitProgress}%`);
    this.setText('mc-sat-thermal', sat.thermal);
    this.setText('mc-sat-solar', sat.solarOutput);
    this.setText('mc-sat-health', localizedHealth);

    // Update battery bar width
    const bBar = document.getElementById('mc-battery-bar');
    if (bBar) bBar.style.width = `${sat.battery}%`;

    // Update progress bar width
    const pBar = document.getElementById('mc-progress-bar');
    if (pBar) pBar.style.width = `${sat.orbitProgress}%`;
  }

  setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  renderSvgTracker() {
    // Update SVG satellite positions along the orbital path
    for (const key in this.satellites) {
      const sat = this.satellites[key];
      const dot = document.getElementById(`svg-dot-${key.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);
      if (dot) {
        // Parametric SVG ellipse dimensions: rx=170, ry=75, cx=200, cy=110
        const x = 200 + Math.cos(sat.angle) * 170;
        const y = 110 + Math.sin(sat.angle) * 75;
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
      }
    }
  }
}

window.MissionControlCenter = MissionControlCenter;
