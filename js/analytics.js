/**
 * ASTRONOVA - Analytics Dashboard & Environmental Trend Timeline
 * Stores statistics and historical trend sequences in LocalStorage
 * Renders animated multi-series trend charts on Canvas.
 */

class AnalyticsDashboard {
  constructor() {
    this.storageKey = 'astronova_analytics_stats';
    this.timelineKey = 'astronova_environmental_timeline';

    this.stats = this.loadStats();
    this.timeline = this.loadTimeline();

    this.chartCanvas = document.getElementById('trend-chart-canvas');
    this.ctx = this.chartCanvas ? this.chartCanvas.getContext('2d') : null;

    this.init();
  }

  loadStats() {
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    // Default initial seed
    return {
      totalAnalyses: 14,
      imagesAnalyzed: 14,
      agriAnalyses: 9,
      disasterAnalyses: 5,
      avgVegetation: 64,
      avgWater: 28
    };
  }

  saveStats() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
  }

  loadTimeline() {
    const raw = localStorage.getItem(this.timelineKey);
    if (raw) {
      try { return JSON.parse(raw); } catch (e) {}
    }
    // Default seed trend progression
    return [
      { day: 'Day 1', vegetation: 55, water: 22, dryness: 42, agriScore: 58 },
      { day: 'Day 7', vegetation: 63, water: 27, dryness: 35, agriScore: 66 },
      { day: 'Day 14', vegetation: 72, water: 31, dryness: 24, agriScore: 78 },
      { day: 'Day 21', vegetation: 68, water: 29, dryness: 28, agriScore: 73 },
      { day: 'Day 28', vegetation: 76, water: 34, dryness: 18, agriScore: 82 }
    ];
  }

  saveTimeline() {
    localStorage.setItem(this.timelineKey, JSON.stringify(this.timeline));
  }

  init() {
    this.updateStatsUI();
    this.renderTimelineChart();

    window.addEventListener('resize', () => {
      this.renderTimelineChart();
    });

    const addTrendBtn = document.getElementById('btn-add-timeline-entry');
    if (addTrendBtn) {
      addTrendBtn.addEventListener('click', () => this.promptAddEntry());
    }
  }

  recordAnalysis(result, type = 'agriculture') {
    this.stats.totalAnalyses++;
    this.stats.imagesAnalyzed++;
    if (type === 'agriculture') this.stats.agriAnalyses++;
    if (type === 'disaster') this.stats.disasterAnalyses++;

    // Rolling average
    this.stats.avgVegetation = Math.round((this.stats.avgVegetation * 0.8) + (result.vegetation.percentage * 0.2));
    this.stats.avgWater = Math.round((this.stats.avgWater * 0.8) + (result.water.coverage * 0.2));
    this.saveStats();
    this.updateStatsUI();

    // Append to timeline
    const nextDayNum = this.timeline.length * 7 + 1;
    this.timeline.push({
      day: `Day ${nextDayNum}`,
      vegetation: result.vegetation.percentage,
      water: result.water.coverage,
      dryness: result.drought.drynessPercentage,
      agriScore: result.vegetation.healthScore
    });
    if (this.timeline.length > 8) this.timeline.shift(); // keep 8 points
    this.saveTimeline();
    this.renderTimelineChart();
  }

  updateStatsUI() {
    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText('stat-total-analyses', this.stats.totalAnalyses);
    setText('stat-images-analyzed', this.stats.imagesAnalyzed);
    setText('stat-agri-count', this.stats.agriAnalyses);
    setText('stat-disaster-count', this.stats.disasterAnalyses);
    setText('stat-avg-veg', `${this.stats.avgVegetation}%`);
    setText('stat-avg-water', `${this.stats.avgWater}%`);
  }

  renderTimelineChart() {
    if (!this.chartCanvas) {
      this.chartCanvas = document.getElementById('trend-chart-canvas');
      if (this.chartCanvas) this.ctx = this.chartCanvas.getContext('2d');
      else return;
    }

    const container = this.chartCanvas.parentElement;
    const w = container.clientWidth || 800;
    const h = 320;
    this.chartCanvas.width = w * window.devicePixelRatio;
    this.chartCanvas.height = h * window.devicePixelRatio;
    this.chartCanvas.style.width = `${w}px`;
    this.chartCanvas.style.height = `${h}px`;

    const ctx = this.ctx;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, w, h);

    const padding = { top: 30, right: 30, bottom: 40, left: 50 };
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    // Draw horizontal grid lines & Y-axis labels
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.font = '500 11px "Rajdhani", sans-serif';
    ctx.fillStyle = '#8b9bb4';
    ctx.textAlign = 'right';

    for (let yVal = 0; yVal <= 100; yVal += 25) {
      const y = padding.top + chartH - (yVal / 100) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + chartW, y);
      ctx.stroke();
      ctx.fillText(`${yVal}%`, padding.left - 8, y + 4);
    }

    const data = this.timeline;
    if (data.length < 2) return;

    const stepX = chartW / (data.length - 1);

    // Helper to draw a metric line series
    const drawSeries = (key, strokeColor, fillColor) => {
      ctx.beginPath();
      data.forEach((pt, idx) => {
        const x = padding.left + idx * stepX;
        const y = padding.top + chartH - (pt[key] / 100) * chartH;
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Area fill
      if (fillColor) {
        ctx.lineTo(padding.left + (data.length - 1) * stepX, padding.top + chartH);
        ctx.lineTo(padding.left, padding.top + chartH);
        ctx.closePath();
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      // Draw point markers
      data.forEach((pt, idx) => {
        const x = padding.left + idx * stepX;
        const y = padding.top + chartH - (pt[key] / 100) * chartH;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = strokeColor;
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Series 1: Vegetation (Emerald)
    drawSeries('vegetation', '#10b981', 'rgba(16, 185, 129, 0.08)');
    // Series 2: Water (Cyan)
    drawSeries('water', '#00f3ff', 'rgba(0, 243, 255, 0.06)');
    // Series 3: Dryness (Gold)
    drawSeries('dryness', '#ffd166', null);
    // Series 4: Agriculture Health (Purple)
    drawSeries('agriScore', '#c084fc', null);

    // Draw X-axis labels (Timestamps)
    ctx.fillStyle = '#8b9bb4';
    ctx.textAlign = 'center';
    data.forEach((pt, idx) => {
      const x = padding.left + idx * stepX;
      ctx.fillText(pt.day, x, h - 14);
    });
  }

  promptAddEntry() {
    const day = prompt('Enter Timeline Label (e.g., Day 35):', `Day ${(this.timeline.length + 1) * 7}`);
    if (!day) return;
    const veg = parseInt(prompt('Vegetation Estimate % (0-100):', '68'), 10) || 50;
    const water = parseInt(prompt('Water Estimate % (0-100):', '30'), 10) || 25;
    const dry = parseInt(prompt('Dryness Estimate % (0-100):', '20'), 10) || 20;
    const agri = Math.round((veg * 0.7) + ((100 - dry) * 0.3));

    this.timeline.push({ day, vegetation: veg, water, dryness: dry, agriScore: agri });
    if (this.timeline.length > 8) this.timeline.shift();
    this.saveTimeline();
    this.renderTimelineChart();
    if (window.AstroApp) {
      window.AstroApp.showToast('TIMELINE UPDATED', `Saved record for ${day}.`, 'success');
    }
  }
}

window.AnalyticsDashboard = AnalyticsDashboard;
