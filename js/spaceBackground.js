/**
 * ASTRONOVA - Continuous Realistic 3D Space & Concentric Orbital Background Engine
 * Renders on the Next Page (Main Application Dashboard):
 * - Carries the identical authentic deep cosmic darkness and tone from the splash screen
 * - Concentric dashed/dotted orbital tracks
 * - Photorealistic 3D rotating planetary globes with axial surface spin (Earth with drifting clouds,
 *   Saturn with tilted 3D rings, Jupiter with swirling belts & Red Spot, Mars with ice cap)
 * - 60 FPS performance, seamless behind translucent glassmorphic dashboard cards
 */

class SpaceBackground {
  constructor(canvasId = 'space-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.isRunning = true;
    this.animationId = null;

    // Viewport dimensions
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Deep Space Starfield & Celestial Dust
    this.stars = [];
    this.comets = [];
    this.numStars = 280;
    this.nebulaClouds = [];

    // Concentric Orbital Configuration (identical to Splash Screen)
    this.orbitTilt = 14 * (Math.PI / 180);
    this.orbitRatioY = 0.76;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    // Realistic Planetary Bodies revolving continuously on concentric orbits
    this.planets = [
      {
        name: 'Earth',
        baseRadius: 15,
        orbitIndex: 1,
        angle: 1.8,
        speed: 0.0036,
        rotation: 0.5,
        rotSpeed: 0.018,
        cloudRotation: 0.9,
        cloudRotSpeed: 0.024,
        hasMoon: true,
        moonAngle: 0,
        moonSpeed: 0.045,
        moonDist: 26
      },
      {
        name: 'Mars',
        baseRadius: 12,
        orbitIndex: 2,
        angle: 0.4,
        speed: 0.0030,
        rotation: 1.2,
        rotSpeed: 0.016
      },
      {
        name: 'Jupiter',
        baseRadius: 28,
        orbitIndex: 3,
        angle: 2.1,
        speed: 0.0018,
        rotation: 2.4,
        rotSpeed: 0.026
      },
      {
        name: 'Saturn',
        baseRadius: 22,
        orbitIndex: 4,
        angle: 3.5,
        speed: 0.0013,
        rotation: 0.8,
        rotSpeed: 0.021,
        hasRings: true
      },
      {
        name: 'Venus',
        baseRadius: 13,
        orbitIndex: 0,
        angle: 5.1,
        speed: 0.0044,
        rotation: 1.1,
        rotSpeed: 0.012
      },
      {
        name: 'Mercury',
        baseRadius: 8,
        orbitIndex: 0,
        angle: 2.3,
        speed: 0.0060,
        rotation: 0.6,
        rotSpeed: 0.014
      },
      {
        name: 'Uranus',
        baseRadius: 16,
        orbitIndex: 5,
        angle: 5.9,
        speed: 0.0009,
        rotation: 1.6,
        rotSpeed: 0.019
      },
      {
        name: 'Neptune',
        baseRadius: 15,
        orbitIndex: 6,
        angle: 4.4,
        speed: 0.0007,
        rotation: 2.9,
        rotSpeed: 0.018
      }
    ];

    // Subtle parallax
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;

    this.init();
  }

  init() {
    this.resize();
    this.initStars();
    this.initNebulae();
    this.bindEvents();
    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * window.devicePixelRatio;
    this.canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;

    const minDim = Math.min(this.width, this.height);
    const scale = Math.max(minDim / 880, 0.55);

    this.orbitRadii = [
      70 * scale,   // 0: Mercury / Venus
      130 * scale,  // 1: Earth
      205 * scale,  // 2: Mars
      295 * scale,  // 3: Jupiter
      405 * scale,  // 4: Saturn
      515 * scale,  // 5: Uranus
      620 * scale,  // 6: Neptune
      730 * scale   // 7: outer edge
    ];
  }

  initStars() {
    this.stars = [];
    const colors = ['#ffffff', '#f1f5f9', '#e0f2fe', '#fef08a', '#cbd5e1'];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.85 + 0.15,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  initNebulae() {
    this.nebulaClouds = [
      { x: this.width * 0.15, y: this.height * 0.25, r: 340, color: 'rgba(30, 58, 138, 0.08)' },
      { x: this.width * 0.85, y: this.height * 0.35, r: 380, color: 'rgba(88, 28, 135, 0.06)' },
      { x: this.width * 0.50, y: this.height * 0.80, r: 320, color: 'rgba(6, 78, 59, 0.05)' }
    ];
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });

    setInterval(() => {
      if (this.isRunning && Math.random() > 0.45 && this.comets.length < 2) {
        this.spawnComet();
      }
    }, 4500);
  }

  spawnComet() {
    const startX = Math.random() * this.width * 0.8 + this.width * 0.1;
    const startY = Math.random() * (this.height * 0.3);
    const speed = Math.random() * 5 + 6;
    this.comets.push({
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 4 + 4,
      vy: speed,
      opacity: 0.9
    });
  }

  start() {
    if (this.animationId) return;
    this.isRunning = true;
    const loop = () => {
      if (this.isRunning) {
        this.render();
      }
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  toggle() {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Parallax smoothing
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;
    const parallaxOffsetX = (this.mouseX - this.width / 2) * 0.02;
    const parallaxOffsetY = (this.mouseY - this.height / 2) * 0.02;

    const cx = this.centerX + parallaxOffsetX;
    const cy = this.centerY + parallaxOffsetY;

    // 1. Nebulae & Starfield
    this.renderNebulae(parallaxOffsetX, parallaxOffsetY);
    this.renderStars(parallaxOffsetX, parallaxOffsetY);

    // 2. Shooting stars
    this.renderComets();

    // 3. Concentric dotted orbital lines (same theme as splash screen)
    this.renderConcentricOrbits(cx, cy);

    // 4. Photorealistic 3D rotating planets
    this.renderPlanets(cx, cy);
  }

  renderNebulae(offsetX, offsetY) {
    const ctx = this.ctx;
    ctx.save();
    for (const neb of this.nebulaClouds) {
      const gx = neb.x + offsetX * 0.25;
      const gy = neb.y + offsetY * 0.25;
      const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, neb.r);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(gx, gy, neb.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  renderStars(offsetX, offsetY) {
    const ctx = this.ctx;
    for (const star of this.stars) {
      star.alpha += (Math.random() - 0.5) * star.twinkleSpeed;
      if (star.alpha > 0.95) star.alpha = 0.95;
      if (star.alpha < 0.15) star.alpha = 0.15;

      const sx = star.x + offsetX * 0.35;
      const sy = star.y + offsetY * 0.35;

      ctx.save();
      ctx.fillStyle = star.color;
      ctx.globalAlpha = star.alpha;
      ctx.beginPath();
      ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  renderComets() {
    const ctx = this.ctx;
    for (let i = this.comets.length - 1; i >= 0; i--) {
      const c = this.comets[i];
      c.x += c.vx;
      c.y += c.vy;
      c.opacity -= 0.008;

      if (c.opacity <= 0 || c.x > this.width || c.y > this.height) {
        this.comets.splice(i, 1);
        continue;
      }

      ctx.save();
      const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 10, c.y - c.vy * 10);
      grad.addColorStop(0, `rgba(255, 255, 255, ${c.opacity})`);
      grad.addColorStop(0.3, `rgba(56, 189, 248, ${c.opacity * 0.7})`);
      grad.addColorStop(1, 'transparent');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x - c.vx * 10, c.y - c.vy * 10);
      ctx.stroke();
      ctx.restore();
    }
  }

  renderConcentricOrbits(cx, cy) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.orbitTilt);

    ctx.setLineDash([2.5, 6]);

    this.orbitRadii.forEach((rx, idx) => {
      const ry = rx * this.orbitRatioY;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

      const alpha = 0.14 + (idx % 2 === 0 ? 0.06 : 0.02);
      ctx.strokeStyle = `rgba(226, 232, 240, ${alpha})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    });

    ctx.setLineDash([]);
    ctx.restore();
  }

  renderPlanets(cx, cy) {
    const ctx = this.ctx;
    const engine = window.AstroPlanet3D;

    const lang = window.AstroI18n ? window.AstroI18n.currentLang : 'en';
    const planetTranslations = {
      ta: {
        'Mercury': 'புதன்',
        'Venus': 'வெள்ளி',
        'Earth': 'பூமி',
        'Mars': 'செவ்வாய்',
        'Jupiter': 'வியாழன்',
        'Saturn': 'சனி',
        'Uranus': 'யுரேனஸ்',
        'Neptune': 'நெப்டியூன்'
      },
      hi: {
        'Mercury': 'बुध',
        'Venus': 'शुक्र',
        'Earth': 'पृथ्वी',
        'Mars': 'मंगल',
        'Jupiter': 'बृहस्पति',
        'Saturn': 'शनि',
        'Uranus': 'अरुण',
        'Neptune': 'वरुण'
      }
    };

    const calculated = this.planets.map(p => {
      // 1. Orbital motion
      p.angle += p.speed;
      if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

      // 2. Axial rotation of surface texture
      p.rotation = (p.rotation || 0) + p.rotSpeed;
      if (p.rotation > Math.PI * 2) p.rotation -= Math.PI * 2;

      if (p.cloudRotation !== undefined) {
        p.cloudRotation = (p.cloudRotation || 0) + (p.cloudRotSpeed || 0.02);
        if (p.cloudRotation > Math.PI * 2) p.cloudRotation -= Math.PI * 2;
      }

      const rx = this.orbitRadii[p.orbitIndex] || 200;
      const ry = rx * this.orbitRatioY;

      const cosA = Math.cos(p.angle);
      const sinA = Math.sin(p.angle);

      const tiltCos = Math.cos(this.orbitTilt);
      const tiltSin = Math.sin(this.orbitTilt);

      const unrotX = rx * cosA;
      const unrotY = ry * sinA;

      const px = cx + (unrotX * tiltCos - unrotY * tiltSin);
      const py = cy + (unrotX * tiltSin + unrotY * tiltCos);

      const z = sinA;
      const scale = 0.82 + ((z + 1) / 2) * 0.38;
      const alpha = 0.65 + ((z + 1) / 2) * 0.35;

      return {
        planet: p,
        x: px,
        y: py,
        z: z,
        scale: scale,
        alpha: alpha,
        radius: p.baseRadius * scale
      };
    });

    calculated.sort((a, b) => a.z - b.z);

    calculated.forEach(item => {
      const p = item.planet;

      if (engine) {
        engine.render3DPlanet(ctx, {
          name: p.name,
          x: item.x,
          y: item.y,
          radius: item.radius,
          rotation: p.rotation,
          cloudRotation: p.cloudRotation,
          lightAngle: -Math.PI * 0.75,
          alpha: item.alpha,
          scale: item.scale
        });
      }

      if (p.hasMoon) {
        p.moonAngle = (p.moonAngle || 0) + p.moonSpeed;
        const mDist = p.moonDist * item.scale;
        const mx = item.x + Math.cos(p.moonAngle) * mDist;
        const my = item.y + Math.sin(p.moonAngle) * (mDist * 0.45);
        const mr = Math.max(item.radius * 0.25, 2.0);

        if (engine) {
          engine.render3DPlanet(ctx, {
            name: 'moon',
            x: mx,
            y: my,
            radius: mr,
            rotation: p.moonAngle,
            alpha: item.alpha,
            scale: item.scale * 0.5
          });
        }
      }

      // Subtle celestial label
      const localizedName = planetTranslations[lang]?.[p.name];
      const displayName = localizedName || p.name.toUpperCase();
      ctx.save();
      ctx.font = (lang === 'ta' || lang === 'hi')
        ? `bold ${Math.max(10 * item.scale, 9)}px 'Noto Sans Tamil', 'Noto Sans Devanagari', 'Rajdhani', sans-serif`
        : `600 ${Math.max(9.5 * item.scale, 8)}px 'Rajdhani', sans-serif`;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
      ctx.textAlign = 'center';
      const labelY = item.y + item.radius + (p.hasRings ? 18 * item.scale : 12 * item.scale);
      ctx.fillText(displayName, item.x, labelY);
      ctx.restore();
    });
  }
}

// Attach to window
window.SpaceBackground = SpaceBackground;
