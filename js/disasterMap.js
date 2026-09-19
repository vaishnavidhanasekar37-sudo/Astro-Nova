/**
 * ASTRONOVA - Disaster Risk Map
 * Interactive SVG Map with simulated markers for:
 * Flood, Drought, Fire, and Landslide.
 * Every marker prominently labeled: SIMULATED.
 */

class DisasterRiskMap {
  constructor(containerId = 'disaster-map-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.disasters = [
      {
        id: 'FL-01',
        type: 'Flood',
        title: 'Brahmaputra Basin Flash Inundation',
        category: 'Flood',
        severity: 'High Warning',
        coordinates: '26.14° N, 91.73° E',
        x: 680,
        y: 260,
        color: '#00f3ff',
        waterCoverage: '+34% vs Baseline',
        description: 'Simulated monsoon runoff anomaly detected via spectral water mask approximation.'
      },
      {
        id: 'DR-02',
        type: 'Drought',
        title: 'Horn of Africa Aridity Index',
        category: 'Drought',
        severity: 'Severe Aridity',
        coordinates: '8.45° N, 44.52° E',
        x: 550,
        y: 310,
        color: '#ffd166',
        waterCoverage: '-48% Soil Moisture',
        description: 'Simulated chlorophyll depression and high land surface temperature signature.'
      },
      {
        id: 'FR-03',
        type: 'Fire',
        title: 'Boreal Taiga Thermal Anomaly',
        category: 'Fire',
        severity: 'Active Thermal Signature',
        coordinates: '58.00° N, 102.00° E',
        x: 710,
        y: 140,
        color: '#ff3366',
        waterCoverage: '14.2 sq km Burn Scar',
        description: 'Simulated elevated short-wave infrared radiance consistent with wildfire.'
      },
      {
        id: 'LS-04',
        type: 'Landslide',
        title: 'Andes Cordillera Slope Displacement',
        category: 'Landslide',
        severity: 'Moderate Risk',
        coordinates: '12.04° S, 77.04° W',
        x: 270,
        y: 370,
        color: '#f97316',
        waterCoverage: 'Slope Saturation Alert',
        description: 'Simulated terrain displacement vector detected after precipitation event.'
      },
      {
        id: 'FR-05',
        type: 'Fire',
        title: 'Mediterranean Scrubland Hotspot',
        category: 'Fire',
        severity: 'Moderate Thermal Warning',
        coordinates: '38.25° N, 21.73° E',
        x: 505,
        y: 220,
        color: '#ff3366',
        waterCoverage: '2.8 sq km Heat Cluster',
        description: 'Simulated high red/orange pixel intensity in arid shrubland vegetation.'
      }
    ];

    this.render();
  }

  render() {
    this.container.innerHTML = `
      <svg class="disaster-map-svg" viewBox="0 0 1000 500" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="mapGridGrad" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stop-color="#0a1638" />
            <stop offset="100%" stop-color="#030714" />
          </radialGradient>
        </defs>

        <!-- Base Oceanic Background -->
        <rect width="1000" height="500" fill="url(#mapGridGrad)" />

        <!-- Lat / Lon Grid Lines -->
        <g stroke="rgba(0, 243, 255, 0.08)" stroke-width="0.8">
          <line x1="0" y1="125" x2="1000" y2="125" />
          <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(0, 243, 255, 0.2)" stroke-dasharray="4,4" />
          <line x1="0" y1="375" x2="1000" y2="375" />
          <line x1="200" y1="0" x2="200" y2="500" />
          <line x1="400" y1="0" x2="400" y2="500" />
          <line x1="600" y1="0" x2="600" y2="500" />
          <line x1="800" y1="0" x2="800" y2="500" />
        </g>

        <!-- World Continent Outlines (SVG Polygons) -->
        <g fill="rgba(16, 185, 129, 0.14)" stroke="rgba(0, 243, 255, 0.3)" stroke-width="1.2">
          <!-- North America -->
          <polygon points="120,80 180,60 260,70 290,110 240,150 190,180 170,220 140,200 110,130 90,100" />
          <!-- South America -->
          <polygon points="240,240 290,260 330,310 300,410 260,430 230,340 220,270" />
          <!-- Europe -->
          <polygon points="450,110 520,100 550,140 520,180 470,190 440,150" />
          <!-- Africa -->
          <polygon points="450,210 530,210 570,270 540,380 490,400 460,320 430,260" />
          <!-- Asia -->
          <polygon points="550,90 750,70 870,120 840,220 780,240 680,290 600,240 560,160" />
          <!-- Australia -->
          <polygon points="760,330 840,320 860,380 810,410 750,380" />
        </g>

        <!-- Equator Label -->
        <text x="20" y="246" fill="rgba(0, 243, 255, 0.4)" font-family="Rajdhani" font-size="11" letter-spacing="1">EQUATORIAL 00°00'N</text>

        <!-- Simulated Disaster Markers -->
        <g id="disaster-markers-group">
          ${this.disasters.map(d => `
            <g class="disaster-pin" data-id="${d.id}" transform="translate(${d.x}, ${d.y})">
              <!-- Pulse circle -->
              <circle class="pin-pulse" cx="0" cy="0" r="10" fill="none" stroke="${d.color}" stroke-width="1.5" />
              <!-- Center pin -->
              <circle cx="0" cy="0" r="6" fill="${d.color}" />
              <!-- Marker Icon / Label -->
              <text x="10" y="4" fill="#ffffff" font-family="Rajdhani" font-weight="700" font-size="11">
                ${d.type.toUpperCase()} [SIMULATED]
              </text>
            </g>
          `).join('')}
        </g>
      </svg>
    `;

    this.bindMarkerClicks();
  }

  bindMarkerClicks() {
    const pins = this.container.querySelectorAll('.disaster-pin');
    pins.forEach(pin => {
      pin.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const disaster = this.disasters.find(d => d.id === id);
        if (disaster) {
          this.showDisasterModal(disaster);
        }
      });
    });
  }

  showDisasterModal(disaster) {
    const modal = document.getElementById('disaster-detail-modal');
    const body = document.getElementById('disaster-modal-body');
    if (!modal || !body) return;

    body.innerHTML = `
      <div style="border-left: 4px solid ${disaster.color}; padding-left: 16px; margin-bottom: 20px;">
        <span class="prototype-tag">SIMULATED DATA – PROTOTYPE ONLY</span>
        <h3 style="font-family:var(--font-display); color:#fff; font-size:1.3rem; margin-top:8px;">${disaster.title}</h3>
        <p style="color:var(--text-muted); font-size:0.88rem; margin-top:4px;">Coordinates: ${disaster.coordinates}</p>
      </div>

      <div class="grid-2" style="margin-bottom: 20px;">
        <div class="glass-panel" style="padding:14px;">
          <div style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase;">Category</div>
          <div style="font-size:1.1rem; font-weight:700; color:${disaster.color}; font-family:var(--font-hud);">${disaster.category}</div>
        </div>
        <div class="glass-panel" style="padding:14px;">
          <div style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase;">Severity Level</div>
          <div style="font-size:1.1rem; font-weight:700; color:#fff; font-family:var(--font-hud);">${disaster.severity}</div>
        </div>
        <div class="glass-panel" style="padding:14px;">
          <div style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase;">Estimated Metric</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--cyber-cyan); font-family:var(--font-hud);">${disaster.waterCoverage}</div>
        </div>
        <div class="glass-panel" style="padding:14px;">
          <div style="font-size:0.75rem; color:var(--text-dim); text-transform:uppercase;">Model Status</div>
          <div style="font-size:1.1rem; font-weight:700; color:var(--matrix-green); font-family:var(--font-hud);">SYNTHETIC SIMULATION</div>
        </div>
      </div>

      <div style="background:rgba(0, 243, 255, 0.05); border:1px solid var(--border-glass); border-radius:var(--radius-sm); padding:16px; line-height:1.6; font-size:0.9rem; color:#e2e8f0;">
        <strong>Prototype Diagnostic Summary:</strong><br>
        ${disaster.description}
        <div style="margin-top:10px; font-size:0.75rem; color:var(--orbital-gold);">
          NOTICE: This data is generated by an educational simulation algorithm and does NOT represent official meteorological or geological warnings.
        </div>
      </div>
    `;

    modal.classList.add('active');
  }
}

window.DisasterRiskMap = DisasterRiskMap;
