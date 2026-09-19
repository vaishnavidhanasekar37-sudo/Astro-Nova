/**
 * ASTRONOVA - Earth Digital Twin
 * Interactive 3D Canvas Earth Visualization with spherical projection,
 * continents, latitude/longitude grid, satellite orbit, location markers,
 * zoom, manual drag-rotation, and day/night terminator effect.
 */

class EarthDigitalTwin {
  constructor(canvasId = 'earth-twin-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.width = this.canvas.parentElement.clientWidth || 800;
    this.height = this.canvas.parentElement.clientHeight || 520;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Globe state
    this.radius = Math.min(this.width, this.height) * 0.38;
    this.baseRadius = this.radius;
    this.zoomLevel = 1.0;
    this.rotation = 0;
    this.tilt = 0.3; // ~17 degrees
    this.isAutoRotating = true;
    this.rotationSpeed = 0.004;

    // Drag interaction
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    // Orbiting Satellite
    this.satAngle = 0;

    // Location Markers (Lat, Lon in degrees)
    this.markers = [
      { name: 'Amazon Rainforest', lat: -3.46, lon: -62.21, type: 'Forest Canopy', status: 'Dense Vegetation' },
      { name: 'Sahara Desert', lat: 23.41, lon: 25.66, type: 'Arid Zone', status: 'Extreme Dryness' },
      { name: 'Ganges-Brahmaputra Delta', lat: 22.5, lon: 89.5, type: 'Wetland Delta', status: 'High Moisture' },
      { name: 'California Basin', lat: 36.77, lon: -119.41, type: 'Wildfire Watch', status: 'Moderate Risk' },
      { name: 'Great Barrier Reef', lat: -18.28, lon: 147.69, type: 'Marine Ecosystem', status: 'Coral Watch' }
    ];

    // Simplified continent polygon paths in spherical coordinates (lon, lat)
    this.continents = [
      // North America
      [[-165,65], [-140,70], [-100,75], [-60,70], [-55,50], [-70,45], [-80,25], [-105,20], [-120,35], [-130,50], [-165,65]],
      // South America
      [[-80,10], [-50, -5], [-35, -5], [-40, -22], [-60, -55], [-75, -50], [-80, -20], [-80,10]],
      // Eurasia
      [[-10,35], [25,35], [40,40], [60,35], [75,10], [90,20], [120,25], [140,40], [170,65], [100,75], [30,70], [10,55], [-10,35]],
      // Africa
      [[-15,35], [30,32], [50,12], [40, -5], [30, -34], [18, -34], [10, 5], [-15, 15], [-15,35]],
      // Australia
      [[115, -22], [130, -12], [145, -15], [150, -35], [135, -35], [115, -35], [115, -22]]
    ];

    this.activeMarker = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.animate();
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      if (!this.canvas || !this.canvas.parentElement) return;
      this.width = this.canvas.parentElement.clientWidth || 800;
      this.height = this.canvas.parentElement.clientHeight || 520;
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => (this.isDragging = false));

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.rotation += dx * 0.005;
      this.tilt = Math.max(-0.8, Math.min(0.8, this.tilt + dy * 0.005));
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    });

    // Zoom Controls
    const zoomInBtn = document.getElementById('twin-zoom-in');
    const zoomOutBtn = document.getElementById('twin-zoom-out');
    const rotateToggleBtn = document.getElementById('twin-rotate-toggle');

    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        this.zoomLevel = Math.min(this.zoomLevel + 0.15, 1.8);
      });
    }
    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        this.zoomLevel = Math.max(this.zoomLevel - 0.15, 0.7);
      });
    }
    if (rotateToggleBtn) {
      rotateToggleBtn.addEventListener('click', () => {
        this.isAutoRotating = !this.isAutoRotating;
        rotateToggleBtn.classList.toggle('active', this.isAutoRotating);
      });
    }

    // Canvas click for markers
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      this.checkMarkerClick(clickX, clickY);
    });
  }

  project(lonDeg, latDeg) {
    const lonRad = (lonDeg * Math.PI) / 180 + this.rotation;
    const latRad = (latDeg * Math.PI) / 180;

    // 3D sphere coords
    const x3d = Math.cos(latRad) * Math.sin(lonRad);
    const y3d = -Math.sin(latRad);
    const z3d = Math.cos(latRad) * Math.cos(lonRad);

    // Apply tilt around X axis
    const cosT = Math.cos(this.tilt);
    const sinT = Math.sin(this.tilt);

    const yTilted = y3d * cosT - z3d * sinT;
    const zTilted = y3d * sinT + z3d * cosT;

    const r = this.radius * this.zoomLevel;
    const cx = this.width / 2;
    const cy = this.height / 2;

    return {
      x: cx + x3d * r,
      y: cy + yTilted * r,
      z: zTilted,
      visible: zTilted > 0 // on front hemisphere
    };
  }

  animate() {
    if (this.isAutoRotating && !this.isDragging) {
      this.rotation += this.rotationSpeed;
    }
    this.satAngle += 0.015;

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    const ctx = this.ctx;
    const cx = this.width / 2;
    const cy = this.height / 2;
    const r = this.radius * this.zoomLevel;

    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Atmosphere Glow
    const atmoGrad = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.35);
    atmoGrad.addColorStop(0, 'rgba(0, 243, 255, 0.25)');
    atmoGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.1)');
    atmoGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = atmoGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
    ctx.fill();

    // 2. Base Ocean Sphere (Day & Night Terminator)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();

    // Ocean Gradient with Day / Night lighting
    const oceanGrad = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, r * 0.1, cx, cy, r);
    oceanGrad.addColorStop(0, '#1e3a8a'); // sunlight day ocean
    oceanGrad.addColorStop(0.65, '#0f172a'); // terminator zone
    oceanGrad.addColorStop(1, '#020617'); // night side
    ctx.fillStyle = oceanGrad;
    ctx.fill();

    // 3. Latitude & Longitude Coordinate Grid
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.18)';
    ctx.lineWidth = 1;

    // Parallels
    for (let lat = -60; lat <= 60; lat += 30) {
      ctx.beginPath();
      let started = false;
      for (let lon = -180; lon <= 180; lon += 5) {
        const pt = this.project(lon, lat);
        if (pt.visible) {
          if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
          else { ctx.lineTo(pt.x, pt.y); }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // Meridians
    for (let lon = -180; lon < 180; lon += 30) {
      ctx.beginPath();
      let started = false;
      for (let lat = -80; lat <= 80; lat += 5) {
        const pt = this.project(lon, lat);
        if (pt.visible) {
          if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
          else { ctx.lineTo(pt.x, pt.y); }
        } else {
          started = false;
        }
      }
      ctx.stroke();
    }

    // 4. Continents
    ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.2;

    for (const continent of this.continents) {
      ctx.beginPath();
      let started = false;
      for (const coord of continent) {
        const pt = this.project(coord[0], coord[1]);
        if (pt.visible) {
          if (!started) { ctx.moveTo(pt.x, pt.y); started = true; }
          else { ctx.lineTo(pt.x, pt.y); }
        }
      }
      if (started) {
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }

    // 5. Day/Night Terminator Shadow Overlay
    const nightGrad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
    nightGrad.addColorStop(0, 'rgba(0,0,0,0)');
    nightGrad.addColorStop(0.5, 'rgba(0,0,0,0.15)');
    nightGrad.addColorStop(1, 'rgba(0,0,0,0.7)');
    ctx.fillStyle = nightGrad;
    ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    ctx.restore(); // end globe clip

    // 6. Orbiting Satellite Track
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(35 * (Math.PI / 180));
    ctx.strokeStyle = 'rgba(0, 243, 255, 0.35)';
    ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.4, r * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();

    const satX = Math.cos(this.satAngle) * (r * 1.4);
    const satY = Math.sin(this.satAngle) * (r * 0.45);

    ctx.fillStyle = '#ffd166';
    ctx.shadowColor = '#ffd166';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(satX, satY, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = '600 10px "Rajdhani"';
    ctx.fillStyle = '#ffd166';
    ctx.fillText('NOVA-01', satX + 8, satY - 6);
    ctx.restore();

    // 7. Location Markers
    this.renderMarkers();
  }

  renderMarkers() {
    const ctx = this.ctx;
    for (const m of this.markers) {
      const pt = this.project(m.lon, m.lat);
      if (pt.visible) {
        m.screenX = pt.x;
        m.screenY = pt.y;

        // Glowing Marker Pin
        ctx.save();
        ctx.fillStyle = '#00f3ff';
        ctx.shadowColor = '#00f3ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '600 11px "Rajdhani"';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(m.name, pt.x + 8, pt.y - 4);
        ctx.restore();
      } else {
        m.screenX = null;
        m.screenY = null;
      }
    }
  }

  checkMarkerClick(clickX, clickY) {
    for (const m of this.markers) {
      if (m.screenX && m.screenY) {
        const dist = Math.hypot(clickX - m.screenX, clickY - m.screenY);
        if (dist < 14) {
          this.showMarkerDetails(m);
          return;
        }
      }
    }
  }

  showMarkerDetails(marker) {
    const hud = document.getElementById('twin-marker-popup');
    if (!hud) return;

    hud.style.display = 'block';
    hud.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-family:var(--font-hud); font-weight:700; color:var(--cyber-cyan);">${marker.name.toUpperCase()}</span>
        <button onclick="document.getElementById('twin-marker-popup').style.display='none'" style="background:none; border:none; color:var(--text-muted); cursor:pointer;">&times;</button>
      </div>
      <div style="font-size:0.82rem; color:var(--text-muted); line-height:1.5;">
        <div><strong>Coordinates:</strong> ${marker.lat}° N, ${marker.lon}° E</div>
        <div><strong>Classification:</strong> ${marker.type}</div>
        <div><strong>Telemetry Status:</strong> <span style="color:var(--matrix-green);">${marker.status}</span></div>
        <div style="margin-top:6px; font-size:0.7rem; color:var(--orbital-gold);">SIMULATED DATA – PROTOTYPE ONLY</div>
      </div>
    `;
  }
}

window.EarthDigitalTwin = EarthDigitalTwin;
