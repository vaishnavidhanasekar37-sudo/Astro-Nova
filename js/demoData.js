/**
 * ASTRONOVA - Bundled Demo Mode Datasets
 * 100% Offline Procedurally Generated High-Res Satellite Imagery
 * Scenarios: Flooded area, Agricultural land, Dry land, Forest, Urban area, Fire/burn area
 * Clearly marked: DEMO / SIMULATED DATA
 */

class DemoDataGenerator {
  static createDemoImage(scenario, width = 640, height = 480) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    switch (scenario) {
      case 'flooded_area':
        this.renderFloodedArea(ctx, width, height);
        break;
      case 'agricultural_land':
        this.renderAgriculturalLand(ctx, width, height);
        break;
      case 'dry_land':
        this.renderDryLand(ctx, width, height);
        break;
      case 'forest':
        this.renderForest(ctx, width, height);
        break;
      case 'urban':
        this.renderUrban(ctx, width, height);
        break;
      case 'fire_burn':
        this.renderFireBurn(ctx, width, height);
        break;
      default:
        this.renderAgriculturalLand(ctx, width, height);
    }

    // Add DEMO WATERMARK on canvas
    ctx.save();
    ctx.font = '700 13px "Rajdhani", sans-serif';
    ctx.fillStyle = 'rgba(255, 209, 102, 0.85)';
    ctx.fillRect(12, height - 32, 230, 22);
    ctx.fillStyle = '#050814';
    ctx.fillText('DEMO / SIMULATED DATASET', 18, height - 17);
    ctx.restore();

    return canvas.toDataURL('image/png');
  }

  static renderFloodedArea(ctx, w, h) {
    // Muddy terrain base
    ctx.fillStyle = '#4a5538';
    ctx.fillRect(0, 0, w, h);

    // Floodwaters river and delta inundation
    ctx.fillStyle = '#1e40af';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3);
    ctx.bezierCurveTo(w * 0.3, h * 0.1, w * 0.6, h * 0.6, w, h * 0.4);
    ctx.lineTo(w, h * 0.8);
    ctx.bezierCurveTo(w * 0.5, h * 0.9, w * 0.2, h * 0.5, 0, h * 0.7);
    ctx.closePath();
    ctx.fill();

    // Large overflowing standing water lakes
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(w * 0.35, h * 0.65, w * 0.22, h * 0.18, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w * 0.75, h * 0.28, w * 0.18, h * 0.14, -0.3, 0, Math.PI * 2);
    ctx.fill();

    // Sediment tint
    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.fillRect(0, 0, w, h);
  }

  static renderAgriculturalLand(ctx, w, h) {
    // Patchwork crop parcels
    const cols = 8;
    const rows = 6;
    const cellW = w / cols;
    const cellH = h / rows;

    const cropColors = [
      '#15803d', '#16a34a', '#22c55e', '#4ade80', // various lush greens
      '#65a30d', '#84cc16', '#a3e635',             // light crops
      '#ca8a04', '#eab308'                         // ripening wheat/barley
    ];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = cropColors[(r * cols + c * 3) % cropColors.length];
        ctx.fillStyle = color;
        ctx.fillRect(c * cellW, r * cellH, cellW - 2, cellH - 2);

        // Center pivot irrigation circle in some plots
        if ((r + c) % 3 === 0) {
          ctx.fillStyle = 'rgba(21, 128, 61, 0.6)';
          ctx.beginPath();
          ctx.arc(c * cellW + cellW / 2, r * cellH + cellH / 2, Math.min(cellW, cellH) * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  static renderDryLand(ctx, w, h) {
    // Arid desertified landscape
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#d97706');
    grad.addColorStop(0.5, '#b45309');
    grad.addColorStop(1, '#92400e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Dry wash channels and dunes
    ctx.strokeStyle = 'rgba(254, 243, 199, 0.25)';
    ctx.lineWidth = 4;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * (h / 10));
      ctx.bezierCurveTo(w * 0.4, (i - 1) * (h / 10), w * 0.7, (i + 2) * (h / 10), w, (i + 1) * (h / 10));
      ctx.stroke();
    }
  }

  static renderForest(ctx, w, h) {
    // Dense canopy
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, w, h);

    // Forest canopy textures
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const rad = Math.random() * 20 + 8;
      ctx.fillStyle = Math.random() > 0.4 ? '#047857' : '#059669';
      ctx.beginPath();
      ctx.arc(x, y, rad, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  static renderUrban(ctx, w, h) {
    // Concrete urban ground
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, 0, w, h);

    // Street grid
    ctx.fillStyle = '#1e293b';
    for (let x = 0; x < w; x += 55) {
      ctx.fillRect(x, 0, 10, h);
    }
    for (let y = 0; y < h; y += 45) {
      ctx.fillRect(0, y, w, 8);
    }

    // Commercial rooftops
    ctx.fillStyle = '#94a3b8';
    for (let i = 0; i < 30; i++) {
      const rx = (i * 73) % (w - 40);
      const ry = (i * 57) % (h - 35);
      ctx.fillRect(rx, ry, 35, 25);
    }
  }

  static renderFireBurn(ctx, w, h) {
    // Charred dark ground
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(0, 0, w, h);

    // Burn scar
    ctx.fillStyle = '#44403c';
    ctx.beginPath();
    ctx.ellipse(w * 0.45, h * 0.5, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
    ctx.fill();

    // Active flame front (intense red/orange)
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.45, w * 0.22, 0.4, 2.8);
    ctx.stroke();

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.45, w * 0.22, 0.5, 2.6);
    ctx.stroke();

    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.45, w * 0.22, 0.6, 2.4);
    ctx.stroke();
  }
}

window.DemoDataGenerator = DemoDataGenerator;
