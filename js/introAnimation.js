/**
 * ASTRONOVA - Realistic 3D Space Intro & Concentric Orbiting Celestial Engine
 * Accurately matches the user reference:
 * - Concentric dashed/dotted circular/elliptical orbital paths
 * - Photorealistic 3D rotating planetary globes with axial spin & surface textures
 *   (Earth with clouds, Saturn with 3D tilted rings, Jupiter with bands, Mars with ice cap)
 * - Authentic deep cosmic darkness with realistic pinprick starfield & subtle nebulae
 * - 60 FPS continuous dynamics
 */

class SpaceIntro {
  constructor(overlayId = 'intro-overlay', canvasId = 'intro-canvas') {
    this.overlay = document.getElementById(overlayId);
    this.canvas = document.getElementById(canvasId);
    if (!this.overlay || !this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.animationId = null;
    this.isRunning = true;

    // Subtle mouse parallax
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.targetMouseX = this.mouseX;
    this.targetMouseY = this.mouseY;

    // Starfield & Deep Space elements
    this.stars = [];
    this.numStars = 320;
    this.comets = [];
    this.nebulaClouds = [];

    // Concentric Orbit Configuration
    // Perspective tilt for realistic celestial look
    this.orbitTilt = 12 * (Math.PI / 180);
    this.orbitRatioY = 0.76; // Gentle perspective compression matching reference image

    // Concentric planetary definitions matching reference image
    // Saturn on left, Earth center, Mars right, Jupiter lower
    this.planets = [
      {
        name: 'Earth',
        baseRadius: 15,
        orbitIndex: 1,
        angle: 1.52, // Near upper-center / central focus
        speed: 0.0040,
        rotation: 0.2,
        rotSpeed: 0.018,
        cloudRotation: 0.5,
        cloudRotSpeed: 0.023,
        hasMoon: true,
        moonAngle: 0,
        moonSpeed: 0.05,
        moonDist: 28
      },
      {
        name: 'Mars',
        baseRadius: 12,
        orbitIndex: 2,
        angle: 0.12, // Towards the right
        speed: 0.0032,
        rotation: 1.0,
        rotSpeed: 0.016
      },
      {
        name: 'Jupiter',
        baseRadius: 28,
        orbitIndex: 3,
        angle: 1.62, // Positioned at the bottom/lower orbit
        speed: 0.0020,
        rotation: 2.1,
        rotSpeed: 0.028
      },
      {
        name: 'Saturn',
        baseRadius: 22,
        orbitIndex: 4,
        angle: 3.18, // Prominently on the left
        speed: 0.0014,
        rotation: 0.6,
        rotSpeed: 0.022,
        hasRings: true
      },
      {
        name: 'Venus',
        baseRadius: 13,
        orbitIndex: 0,
        angle: 4.8,
        speed: 0.0048,
        rotation: 0.8,
        rotSpeed: 0.012
      },
      {
        name: 'Mercury',
        baseRadius: 8,
        orbitIndex: 0,
        angle: 1.9,
        speed: 0.0065,
        rotation: 0.4,
        rotSpeed: 0.014
      },
      {
        name: 'Uranus',
        baseRadius: 16,
        orbitIndex: 5,
        angle: 5.6,
        speed: 0.0010,
        rotation: 1.4,
        rotSpeed: 0.019
      },
      {
        name: 'Neptune',
        baseRadius: 15,
        orbitIndex: 6,
        angle: 4.1,
        speed: 0.0008,
        rotation: 2.7,
        rotSpeed: 0.018
      }
    ];

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

    // Responsive scaling for concentric orbit radii
    const minDim = Math.min(this.width, this.height);
    const scale = Math.max(minDim / 860, 0.55);

    // Concentric radii matching the reference rings
    this.orbitRadii = [
      65 * scale,   // 0: innermost (Mercury / Venus)
      125 * scale,  // 1: Earth orbit
      195 * scale,  // 2: Mars orbit
      280 * scale,  // 3: Jupiter orbit
      385 * scale,  // 4: Saturn orbit
      485 * scale,  // 5: Uranus orbit
      585 * scale,  // 6: Neptune orbit
      690 * scale   // 7: outer Kuiper edge
    ];
  }

  initStars() {
    this.stars = [];
    // Deep space realistic colors: crisp white, diamond cyan, warm starlight gold, subtle rose
    const colors = ['#ffffff', '#f8fafc', '#e0f2fe', '#fef08a', '#cbd5e1', '#a5f3fc'];
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
      { x: this.width * 0.18, y: this.height * 0.28, r: 320, color: 'rgba(30, 58, 138, 0.09)' },
      { x: this.width * 0.82, y: this.height * 0.38, r: 360, color: 'rgba(88, 28, 135, 0.07)' },
      { x: this.width * 0.52, y: this.height * 0.78, r: 340, color: 'rgba(6, 78, 59, 0.06)' },
      { x: this.width * 0.35, y: this.height * 0.85, r: 280, color: 'rgba(15, 23, 42, 0.25)' }
    ];
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = e.clientX;
      this.targetMouseY = e.clientY;
    });

    // Occasional shooting stars
    setInterval(() => {
      if (this.isRunning && Math.random() > 0.4 && this.comets.length < 2) {
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
      vx: (Math.random() - 0.5) * 3 + 4,
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

  render() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    // Authentic deep space void
    ctx.clearRect(0, 0, w, h);

    // Smooth subtle mouse parallax
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.04;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.04;
    const parallaxX = (this.mouseX - w / 2) * 0.02;
    const parallaxY = (this.mouseY - h / 2) * 0.02;

    // Concentric center
    const cx = w / 2 + parallaxX;
    const cy = h / 2 + parallaxY;

    // 1. Faint cosmic nebulae
    this.renderNebulae(parallaxX, parallaxY);

    // 2. Multi-layer twinkling stars
    this.renderStars(parallaxX, parallaxY);

    // 3. Shooting stars / comets
    this.renderComets();

    // 4. Draw concentric dotted orbital rings matching the reference image
    this.renderConcentricOrbits(cx, cy);

    // 5. Calculate and render 3D rotating planets
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
      c.opacity -= 0.009;

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

  /**
   * Concentric thin dashed/dotted orbital tracks exactly matching reference image
   */
  renderConcentricOrbits(cx, cy) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.orbitTilt);

    // Orbit paths: concentric dotted rings
    ctx.setLineDash([2.5, 6]);

    this.orbitRadii.forEach((rx, idx) => {
      const ry = rx * this.orbitRatioY;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);

      // Subtle luminosity gradient for concentric rings
      const alpha = 0.16 + (idx % 2 === 0 ? 0.08 : 0.03);
      ctx.strokeStyle = `rgba(226, 232, 240, ${alpha})`;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    });

    ctx.setLineDash([]);
    ctx.restore();
  }

  /**
   * Updates orbital revolutions, 3D axial rotations, and renders photorealistic globes
   */
  renderPlanets(cx, cy) {
    const ctx = this.ctx;
    const engine = window.AstroPlanet3D;

    // Calculate positions and depths
    const calculated = this.planets.map(p => {
      // 1. Orbital revolution
      p.angle += p.speed;
      if (p.angle > Math.PI * 2) p.angle -= Math.PI * 2;

      // 2. Axial rotation of surface features (continents, bands, craters)
      p.rotation = (p.rotation || 0) + p.rotSpeed;
      if (p.rotation > Math.PI * 2) p.rotation -= Math.PI * 2;

      if (p.cloudRotation !== undefined) {
        p.cloudRotation = (p.cloudRotation || 0) + (p.cloudRotSpeed || 0.02);
        if (p.cloudRotation > Math.PI * 2) p.cloudRotation -= Math.PI * 2;
      }

      // Orbital ellipse coordinates with tilt
      const rx = this.orbitRadii[p.orbitIndex] || 200;
      const ry = rx * this.orbitRatioY;

      const cosA = Math.cos(p.angle);
      const sinA = Math.sin(p.angle);

      // Rotate by orbitTilt
      const tiltCos = Math.cos(this.orbitTilt);
      const tiltSin = Math.sin(this.orbitTilt);

      const unrotX = rx * cosA;
      const unrotY = ry * sinA;

      const px = cx + (unrotX * tiltCos - unrotY * tiltSin);
      const py = cy + (unrotX * tiltSin + unrotY * tiltCos);

      // Depth z (positive = foreground / lower hemisphere, negative = background)
      const z = sinA;
      const scale = 0.82 + ((z + 1) / 2) * 0.38;
      const alpha = 0.72 + ((z + 1) / 2) * 0.28;

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

    // Depth sort: background planets first, foreground planets last
    calculated.sort((a, b) => a.z - b.z);

    // Render each realistic 3D globe
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
          lightAngle: -Math.PI * 0.75, // directional cosmic light
          alpha: item.alpha,
          scale: item.scale
        });
      }

      // Earth's orbiting Moon
      if (p.hasMoon) {
        p.moonAngle = (p.moonAngle || 0) + p.moonSpeed;
        const mDist = p.moonDist * item.scale;
        const mx = item.x + Math.cos(p.moonAngle) * mDist;
        const my = item.y + Math.sin(p.moonAngle) * (mDist * 0.45);
        const mr = Math.max(item.radius * 0.26, 2.2);

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

      // Subtle celestial name label
      ctx.save();
      ctx.font = `600 ${Math.max(10 * item.scale, 8.5)}px "Rajdhani", sans-serif`;
      ctx.fillStyle = 'rgba(226, 232, 240, 0.75)';
      ctx.textAlign = 'center';
      const labelY = item.y + item.radius + (p.hasRings ? 18 * item.scale : 12 * item.scale);
      ctx.fillText(p.name.toUpperCase(), item.x, labelY);
      ctx.restore();
    });
  }
}

window.SpaceIntro = SpaceIntro;

// Auto-initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
  window.SpaceIntroInstance = new SpaceIntro('intro-overlay', 'intro-canvas');
});
