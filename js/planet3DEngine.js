/**
 * ASTRONOVA - 3D Realistic Planetary Globe & Orbiting Dynamics Engine
 * Generates photorealistic, continuously rotating 3D planets with:
 * - High-detail procedural cylindrical surface textures (Earth continents & drifting clouds,
 *   Saturn atmospheric bands & 3D rings, Jupiter turbulent belts & Red Spot, Mars rust terrain & ice cap)
 * - Spherical orthographic projection with true axial rotation (surface spins around the axis)
 * - Directional 3D cosine lighting with terminator shadow and specular highlights
 * - Atmospheric Rayleigh/Fresnel limb glows tailored for each celestial body
 * - Silky smooth 60 FPS performance via optimized canvas slice mapping
 */

(function () {
  'use strict';

  class Planet3DEngine {
    constructor() {
      this.textures = {};
      this.initTextures();
    }

    // Generate high-resolution procedural cylindrical surface textures
    initTextures() {
      this.textures['earth'] = this.createEarthTexture();
      this.textures['earth_clouds'] = this.createCloudsTexture();
      this.textures['saturn'] = this.createSaturnTexture();
      this.textures['saturn_rings'] = this.createSaturnRingsTexture();
      this.textures['jupiter'] = this.createJupiterTexture();
      this.textures['mars'] = this.createMarsTexture();
      this.textures['venus'] = this.createVenusTexture();
      this.textures['mercury'] = this.createMercuryTexture();
      this.textures['uranus'] = this.createUranusTexture();
      this.textures['neptune'] = this.createNeptuneTexture();
      this.textures['moon'] = this.createMoonTexture();
    }

    // Offscreen canvas creator helper
    createCanvas(width, height) {
      const c = document.createElement('canvas');
      c.width = width;
      c.height = height;
      return c;
    }

    // 1. Realistic Earth Texture (deep blue oceans, green/brown continents, ice caps)
    createEarthTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      // Deep ocean base
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
      oceanGrad.addColorStop(0, '#0a2342');
      oceanGrad.addColorStop(0.5, '#0b3c68');
      oceanGrad.addColorStop(1, '#0a2342');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, w, h);

      // Continent shapes (realistic stylized landmasses across equirectangular map)
      ctx.fillStyle = '#1e5f38'; // vegetation green
      const landPatches = [
        // Eurasia / Africa
        { x: 260, y: 70, rx: 65, ry: 45 },
        { x: 300, y: 100, rx: 80, ry: 40 },
        { x: 265, y: 145, rx: 42, ry: 55 },
        { x: 330, y: 155, rx: 32, ry: 35 },
        // Americas
        { x: 110, y: 80, rx: 48, ry: 38 },
        { x: 135, y: 165, rx: 36, ry: 58 },
        // Australia
        { x: 390, y: 180, rx: 30, ry: 22 }
      ];

      landPatches.forEach(p => {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // Mountain / desert inner highlights
        ctx.fillStyle = '#785b32';
        ctx.beginPath();
        ctx.ellipse(p.x - p.rx * 0.15, p.y, p.rx * 0.55, p.ry * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e5f38';
      });

      // Polar ice caps
      ctx.fillStyle = '#eef6fc';
      ctx.fillRect(0, 0, w, 18);
      ctx.fillRect(0, h - 20, w, 20);

      // Coastline turquoise shallow waters
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.4)';
      ctx.lineWidth = 3;
      landPatches.forEach(p => {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx + 2, p.ry + 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      return canvas;
    }

    // 2. Swirling Earth Atmospheric Cloud Layer
    createCloudsTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';

      // Swirling cloud bands and cyclone swirls
      const cloudClusters = [
        { x: 70, y: 60, rx: 60, ry: 15, rot: 0.2 },
        { x: 190, y: 110, rx: 80, ry: 20, rot: -0.15 },
        { x: 290, y: 75, rx: 75, ry: 18, rot: 0.1 },
        { x: 420, y: 130, rx: 90, ry: 22, rot: -0.2 },
        { x: 130, y: 190, rx: 70, ry: 16, rot: 0.15 },
        { x: 330, y: 180, rx: 85, ry: 20, rot: -0.1 }
      ];

      cloudClusters.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.beginPath();
        ctx.ellipse(0, 0, c.rx, c.ry, 0, 0, Math.PI * 2);
        ctx.fill();

        // Feathery cloud wisps
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.ellipse(c.rx * 0.3, -5, c.rx * 0.6, c.ry * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      return canvas;
    }

    // 3. Saturn Body Texture (soft golden butterscotch & cream atmospheric bands)
    createSaturnTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      const bands = [
        { y1: 0, y2: 0.15, col: '#8d7857' },
        { y1: 0.15, y2: 0.28, col: '#baa075' },
        { y1: 0.28, y2: 0.42, col: '#dfcb9f' },
        { y1: 0.42, y2: 0.58, col: '#f3e5c5' }, // equatorial bright zone
        { y1: 0.58, y2: 0.72, col: '#dfcb9f' },
        { y1: 0.72, y2: 0.86, col: '#b89e73' },
        { y1: 0.86, y2: 1.0, col: '#7e6a4b' }
      ];

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      bands.forEach(b => {
        grad.addColorStop(b.y1, b.col);
        grad.addColorStop(b.y2, b.col);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Fine atmospheric micro-striations
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let y = 10; y < h; y += 8) {
        ctx.fillRect(0, y, w, 2);
      }
      ctx.fillStyle = 'rgba(90, 65, 35, 0.08)';
      for (let y = 14; y < h; y += 12) {
        ctx.fillRect(0, y, w, 3);
      }

      return canvas;
    }

    // 4. Saturn High-Resolution Realistic Rings Texture
    createSaturnRingsTexture() {
      const size = 512;
      const canvas = this.createCanvas(size, size);
      const ctx = canvas.getContext('2d');
      const cx = size / 2;
      const cy = size / 2;

      // Realistic ring structure: Inner C-Ring (faint), Broad B-Ring (bright),
      // Cassini Division (dark gap), Outer A-Ring, and outer Encke gap
      const maxR = size * 0.48;
      const minR = size * 0.22;

      for (let r = minR; r <= maxR; r += 0.8) {
        const norm = (r - minR) / (maxR - minR);
        let alpha = 0.5;
        let color = '#d4be92';

        if (norm < 0.22) {
          // C ring - faint & dusty
          alpha = 0.2 + norm * 0.6;
          color = '#9a815a';
        } else if (norm >= 0.22 && norm < 0.62) {
          // B ring - brightest & most opaque
          alpha = 0.75 + Math.sin(norm * 40) * 0.12;
          color = '#e9d6b2';
        } else if (norm >= 0.62 && norm < 0.70) {
          // Cassini Division - dark gap
          alpha = 0.04;
          color = '#382e1e';
        } else {
          // A ring - moderately bright with subtle streaks
          alpha = 0.55 + Math.cos(norm * 30) * 0.1;
          color = '#ceb991';
        }

        ctx.strokeStyle = color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      return canvas;
    }

    // 5. Jupiter Texture (distinct alternating ochre/cream belts + Great Red Spot)
    createJupiterTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      const bands = [
        { y: 0.08, col: '#452b1b' },
        { y: 0.20, col: '#7c4d29' },
        { y: 0.32, col: '#d8aa7a' },
        { y: 0.42, col: '#9c5b2a' },
        { y: 0.50, col: '#eed5b3' }, // Equatorial bright zone
        { y: 0.58, col: '#a35728' }, // South Equatorial Belt
        { y: 0.68, col: '#c89d71' },
        { y: 0.80, col: '#6b3e21' },
        { y: 0.95, col: '#3a2014' }
      ];

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      bands.forEach(b => grad.addColorStop(b.y, b.col));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Turbulent planetary storm waves
      ctx.fillStyle = 'rgba(255, 235, 205, 0.15)';
      for (let i = 0; i < 18; i++) {
        const y = 30 + i * 11;
        ctx.beginPath();
        for (let x = 0; x <= w; x += 20) {
          const dy = Math.sin(x * 0.05 + i) * 3;
          if (x === 0) ctx.moveTo(x, y + dy);
          else ctx.lineTo(x, y + dy);
        }
        ctx.stroke();
      }

      // Great Red Spot
      const spotX = 320;
      const spotY = 160;
      const spotGrad = ctx.createRadialGradient(spotX, spotY, 2, spotX, spotY, 32);
      spotGrad.addColorStop(0, '#bd321d');
      spotGrad.addColorStop(0.6, '#e0583b');
      spotGrad.addColorStop(1, 'rgba(163, 87, 40, 0)');

      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.ellipse(spotX, spotY, 38, 20, -0.08, 0, Math.PI * 2);
      ctx.fill();

      // Inner Red Spot eye
      ctx.fillStyle = 'rgba(255, 220, 200, 0.6)';
      ctx.beginPath();
      ctx.ellipse(spotX - 4, spotY - 2, 14, 7, -0.08, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    // 6. Mars Texture (reddish-rust basalt, darker craters & brilliant ice cap)
    createMarsTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      // Rust base
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#8c3319');
      grad.addColorStop(0.5, '#c85228');
      grad.addColorStop(1, '#8c3319');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Dark basalt markings (Syrtis Major, Acidalia Planitia)
      ctx.fillStyle = '#4e2013';
      const features = [
        { x: 120, y: 130, rx: 50, ry: 30 },
        { x: 260, y: 140, rx: 70, ry: 40 },
        { x: 380, y: 110, rx: 55, ry: 25 },
        { x: 320, y: 170, rx: 40, ry: 25 }
      ];
      features.forEach(f => {
        ctx.beginPath();
        ctx.ellipse(f.x, f.y, f.rx, f.ry, 0.1, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bright polar ice cap at north pole
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.ellipse(w / 2, 8, 80, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // South polar ice cap
      ctx.beginPath();
      ctx.ellipse(w / 2, h - 8, 50, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    // 7. Venus Texture (golden sulfuric swirling clouds)
    createVenusTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#9c7329');
      grad.addColorStop(0.5, '#e5b85d');
      grad.addColorStop(1, '#9c7329');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 245, 205, 0.2)';
      for (let i = 0; i < 20; i++) {
        const cy = 20 + i * 11;
        ctx.beginPath();
        ctx.ellipse(w * 0.5, cy, w * 0.45, 6, -0.05, 0, Math.PI * 2);
        ctx.fill();
      }

      return canvas;
    }

    // 8. Mercury Texture (cratered gray surface)
    createMercuryTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#6e747d';
      ctx.fillRect(0, 0, w, h);

      // Craters and dark rays
      for (let i = 0; i < 60; i++) {
        const cx = Math.random() * w;
        const cy = Math.random() * h;
        const r = Math.random() * 14 + 3;
        ctx.fillStyle = '#42474d';
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(cx - r * 0.2, cy - r * 0.2, r * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      return canvas;
    }

    // 9. Uranus Texture (soft aquamarine cyan gas atmosphere)
    createUranusTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#164e63');
      grad.addColorStop(0.5, '#22d3ee');
      grad.addColorStop(1, '#164e63');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Faint subtle rings/bands
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      for (let y = 30; y < h; y += 16) {
        ctx.fillRect(0, y, w, 4);
      }

      return canvas;
    }

    // 10. Neptune Texture (deep azure blue gas giant with dark storm spots)
    createNeptuneTexture() {
      const w = 512;
      const h = 256;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0c1d4a');
      grad.addColorStop(0.5, '#1d4ed8');
      grad.addColorStop(1, '#0c1d4a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Great Dark Spot & white cirrus methane clouds
      ctx.fillStyle = '#091536';
      ctx.beginPath();
      ctx.ellipse(320, 140, 42, 22, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.fillRect(300, 115, 60, 4);
      ctx.fillRect(150, 80, 80, 3);

      return canvas;
    }

    // 11. Moon Texture
    createMoonTexture() {
      const w = 256;
      const h = 128;
      const canvas = this.createCanvas(w, h);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(0, 0, w, h);

      // Lunar Mare (dark basaltic plains)
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(90, 60, 26, 0, Math.PI * 2);
      ctx.arc(140, 50, 20, 0, Math.PI * 2);
      ctx.arc(170, 75, 18, 0, Math.PI * 2);
      ctx.fill();

      return canvas;
    }

    /**
     * Renders a photorealistic, spinning 3D spherical planet onto the target canvas context.
     * @param {CanvasRenderingContext2D} ctx - Destination 2D context
     * @param {Object} options - Planet parameters
     */
    render3DPlanet(ctx, options) {
      const {
        name,
        x,
        y,
        radius,
        rotation = 0, // axial rotation angle [0..2*PI]
        cloudRotation = 0,
        lightAngle = -Math.PI * 0.75, // Light source angle in radians (default: upper-left cosmic light)
        alpha = 1.0,
        scale = 1.0
      } = options;

      const r = Math.max(radius, 2);
      const textureKey = name.toLowerCase();
      const texture = this.textures[textureKey];

      ctx.save();
      ctx.globalAlpha = alpha;

      // SATURN: Back half of 3D rings must be rendered BEHIND the planet globe
      if (name.toLowerCase() === 'saturn') {
        this.renderSaturnRingHalf(ctx, x, y, r, scale, false);
      }

      // Clip to circular globe
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.clip();

      // 1. Render rotating surface texture
      if (texture) {
        this.renderSphericalTexture(ctx, texture, x, y, r, rotation);
      } else {
        ctx.fillStyle = '#475569';
        ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }

      // 2. Earth: Layer drifting swirling clouds with separate rotation
      if (name.toLowerCase() === 'earth' && this.textures['earth_clouds']) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        this.renderSphericalTexture(ctx, this.textures['earth_clouds'], x, y, r, cloudRotation);
        ctx.restore();
      }

      // 3. Realistic 3D Spherical Shading: Directional Diffuse + Specular + Deep Space Night Shadow
      // Calculate light source position
      const lightDist = r * 0.55;
      const lx = x + Math.cos(lightAngle) * lightDist;
      const ly = y + Math.sin(lightAngle) * lightDist;

      // Realistic spherical lighting gradient
      const sphereShade = ctx.createRadialGradient(lx, ly, r * 0.05, x, y, r * 1.05);
      sphereShade.addColorStop(0, 'rgba(255, 255, 255, 0.45)'); // Specular keylight highlight
      sphereShade.addColorStop(0.28, 'rgba(255, 255, 255, 0.0)'); // Clean diffuse day
      sphereShade.addColorStop(0.65, 'rgba(0, 0, 0, 0.35)'); // Terminator transition
      sphereShade.addColorStop(0.88, 'rgba(0, 1, 3, 0.88)'); // Deep night side shadow
      sphereShade.addColorStop(1.0, '#000103'); // Pitch black space void

      ctx.fillStyle = sphereShade;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);

      // SATURN: Cast ring shadow onto the planet's illuminated day surface
      if (name.toLowerCase() === 'saturn') {
        ctx.save();
        ctx.rotate(24 * (Math.PI / 180));
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(x - r, y - r * 0.06, r * 2, r * 0.16);
        ctx.restore();
      }

      ctx.restore(); // end globe clipping

      // 4. Atmospheric Rayleigh Scattering / Fresnel Rim Glow
      const atmosphereColors = {
        earth: 'rgba(56, 189, 248, 0.65)',
        saturn: 'rgba(250, 204, 21, 0.35)',
        jupiter: 'rgba(251, 146, 60, 0.42)',
        mars: 'rgba(239, 68, 68, 0.35)',
        venus: 'rgba(234, 179, 8, 0.45)',
        uranus: 'rgba(34, 211, 238, 0.55)',
        neptune: 'rgba(59, 130, 246, 0.65)',
        mercury: 'rgba(148, 163, 184, 0.18)'
      };

      const atmoColor = atmosphereColors[textureKey] || 'rgba(0, 243, 255, 0.3)';
      const atmoGrad = ctx.createRadialGradient(x, y, r * 0.82, x, y, r * 1.25);
      atmoGrad.addColorStop(0, atmoColor);
      atmoGrad.addColorStop(0.5, atmoColor.replace('0.65', '0.2').replace('0.55', '0.15').replace('0.45', '0.12').replace('0.35', '0.08'));
      atmoGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = atmoGrad;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // SATURN: Front half of 3D rings rendered IN FRONT of the planet globe
      if (name.toLowerCase() === 'saturn') {
        this.renderSaturnRingHalf(ctx, x, y, r, scale, true);
      }

      ctx.restore();
    }

    /**
     * Efficiently maps cylindrical texture onto a sphere with continuous axial rotation
     */
    renderSphericalTexture(ctx, texture, cx, cy, radius, rotation) {
      const texW = texture.width;
      const texH = texture.height;
      const numSlices = Math.min(Math.max(Math.floor(radius * 1.8), 24), 64);
      const sliceH = (radius * 2) / numSlices;

      // Normalized rotation offset [0..1]
      const uOffset = ((rotation % (Math.PI * 2)) + Math.PI * 2) / (Math.PI * 2);

      for (let i = 0; i < numSlices; i++) {
        const dy = (i + 0.5) * sliceH - radius;
        const normY = dy / radius;
        if (Math.abs(normY) >= 1) continue;

        // Spherical circle chord width at this latitude
        const sliceWidth = Math.sqrt(1 - normY * normY) * radius * 2;
        const sliceX = cx - sliceWidth / 2;
        const sliceY = cy + dy - sliceH / 2;

        const srcY = ((normY + 1) / 2) * texH;
        const srcH = Math.max(texH / numSlices, 1);

        // Texture X source with rotation offset
        const srcX = (uOffset * texW) % texW;
        const srcW = texW * 0.5; // visible hemisphere span

        // Draw primary slice wrapped
        ctx.drawImage(
          texture,
          srcX,
          srcY,
          Math.min(srcW, texW - srcX),
          srcH,
          sliceX,
          sliceY,
          sliceWidth * (Math.min(srcW, texW - srcX) / srcW),
          sliceH + 0.5
        );

        // If wrapping over right boundary of texture
        if (srcX + srcW > texW) {
          const remSrcW = srcX + srcW - texW;
          const doneRatio = (texW - srcX) / srcW;
          ctx.drawImage(
            texture,
            0,
            srcY,
            remSrcW,
            srcH,
            sliceX + sliceWidth * doneRatio,
            sliceY,
            sliceWidth * (1 - doneRatio),
            sliceH + 0.5
          );
        }
      }
    }

    /**
     * Renders Saturn's tilted 3D rings in two passes (back half behind planet, front half in front)
     */
    renderSaturnRingHalf(ctx, cx, cy, globeR, scale, isFront) {
      ctx.save();
      ctx.translate(cx, cy);
      const ringTilt = 24 * (Math.PI / 180); // 24-degree realistic ring tilt
      ctx.rotate(ringTilt);

      const rInner = globeR * 1.35;
      const rOuter = globeR * 2.35;
      const ySquash = 0.28; // Tilted perspective compression

      // Angle span:
      // Front half: 0 to PI (facing viewer)
      // Back half: PI to 2*PI (behind planet)
      const startAngle = isFront ? 0 : Math.PI;
      const endAngle = isFront ? Math.PI : Math.PI * 2;

      ctx.beginPath();
      ctx.ellipse(0, 0, rOuter, rOuter * ySquash, 0, startAngle, endAngle);
      ctx.ellipse(0, 0, rInner, rInner * ySquash, 0, endAngle, startAngle, true);
      ctx.closePath();

      // Multi-band ring gradient with Cassini Division
      const ringGrad = ctx.createLinearGradient(-rOuter, 0, rOuter, 0);
      ringGrad.addColorStop(0, 'rgba(212, 190, 146, 0.2)');
      ringGrad.addColorStop(0.25, 'rgba(243, 229, 197, 0.85)'); // B ring
      ringGrad.addColorStop(0.48, 'rgba(56, 46, 30, 0.15)'); // Cassini division
      ringGrad.addColorStop(0.72, 'rgba(206, 185, 145, 0.75)'); // A ring
      ringGrad.addColorStop(1, 'rgba(212, 190, 146, 0.2)');

      ctx.fillStyle = ringGrad;
      ctx.shadowColor = 'rgba(243, 229, 197, 0.35)';
      ctx.shadowBlur = 6;
      ctx.fill();

      // Planet shadow on back half of rings
      if (!isFront) {
        ctx.fillStyle = 'rgba(0, 1, 4, 0.75)';
        ctx.fillRect(-globeR * 0.85, -rOuter * ySquash, globeR * 1.7, rOuter * ySquash);
      }

      ctx.restore();
    }
  }

  // Export as singleton on window
  window.Planet3DEngine = Planet3DEngine;
  window.AstroPlanet3D = new Planet3DEngine();
})();
