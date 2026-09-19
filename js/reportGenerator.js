/**
 * ASTRONOVA - Smart Report Generator
 * Creates a professional Remote Sensing Intelligence Dossier
 * Includes branding, image, spectral results, agriculture metrics,
 * disaster flags, and disclaimer. Provides PDF/Print download.
 */

class SmartReportGenerator {
  constructor() {
    this.modal = document.getElementById('report-dossier-modal');
    this.content = document.getElementById('report-dossier-content');
    this.init();
  }

  init() {
    const closeBtn = document.getElementById('report-modal-close');
    const printBtn = document.getElementById('btn-print-report');
    const saveDbBtn = document.getElementById('btn-save-report-db');

    if (closeBtn) closeBtn.addEventListener('click', () => this.close());
    if (printBtn) printBtn.addEventListener('click', () => window.print());
    if (saveDbBtn) saveDbBtn.addEventListener('click', () => this.saveToIndexedDB());
  }

  showDossier(analysisData, imageDataUrl, title = 'Earth Intelligence Brief') {
    if (!this.modal || !this.content) return;
    this.currentData = analysisData;
    this.currentImage = imageDataUrl;
    this.currentTitle = title;

    const dateStr = new Date().toLocaleString();

    this.content.innerHTML = `
      <div class="dossier-sheet" style="font-family:var(--font-body); color:#f0f6fc; line-height:1.6;">
        <!-- Header Banner -->
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--cyber-cyan); padding-bottom:16px; margin-bottom:20px;">
          <div style="display:flex; align-items:center; gap:14px;">
            <img src="assets/logo.png" alt="AstroNova" style="width:52px; height:52px; object-fit:contain; border-radius:8px; filter:drop-shadow(0 0 10px rgba(0,243,255,0.5));" />
            <div>
              <h2 style="font-family:var(--font-display); font-size:1.5rem; letter-spacing:2px; color:#fff; margin:0;">ASTRONOVA</h2>
              <p style="font-family:var(--font-hud); font-size:0.85rem; color:var(--cyber-cyan); letter-spacing:1.5px; margin:0; text-transform:uppercase;">Remote Sensing Earth Intelligence Dossier</p>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-family:var(--font-hud); font-size:0.82rem; color:var(--text-muted);">REF ID: AST-${Date.now().toString().slice(-6)}</div>
            <div style="font-family:var(--font-hud); font-size:0.82rem; color:var(--text-muted);">${dateStr}</div>
            <span class="prototype-tag" style="margin-top:4px; display:inline-block;">SIMULATED PROTOTYPE</span>
          </div>
        </div>

        <!-- Image & Key Metrics Section -->
        <div class="grid-2" style="margin-bottom:24px;">
          <div>
            <div style="border:1px solid var(--border-glass-bright); border-radius:var(--radius-md); overflow:hidden; max-height:260px; background:#000;">
              <img src="${imageDataUrl}" style="width:100%; height:100%; object-fit:cover; display:block;" />
            </div>
            <div style="font-size:0.75rem; color:var(--text-dim); margin-top:6px; font-family:var(--font-hud);">
              RESOLUTION: 10m Ground Sample Distance (Simulated Optical-NIR Equivalent)
            </div>
          </div>

          <div style="display:flex; flex-direction:column; justify-content:space-between;">
            <div class="glass-panel" style="padding:16px;">
              <div style="font-family:var(--font-display); font-size:1.05rem; color:var(--cyber-cyan); margin-bottom:12px;">SPECTRAL CLASSIFICATION</div>
              
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                <span>Vegetation Coverage (ExG):</span>
                <strong style="color:var(--matrix-green);">${analysisData.vegetation.percentage}%</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                <span>Water Surface Index (NDWI):</span>
                <strong style="color:var(--cyber-cyan);">${analysisData.water.coverage}%</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                <span>Dry Soil / Aridity Index:</span>
                <strong style="color:var(--orbital-gold);">${analysisData.drought.drynessPercentage}%</strong>
              </div>
              <div style="display:flex; justify-content:space-between; margin-bottom:8px; border-bottom:1px solid rgba(255,255,255,0.06); padding-bottom:4px;">
                <span>Thermal / Burn Scar Area:</span>
                <strong style="color:var(--plasma-red);">${analysisData.fire.burnPercentage}%</strong>
              </div>
              <div style="display:flex; justify-content:space-between; padding-top:4px;">
                <span>Vegetation Health Composite:</span>
                <strong style="color:#fff; font-family:var(--font-display); font-size:1.1rem;">${analysisData.vegetation.healthScore} / 100</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Agriculture & Disaster Evaluation Section -->
        <div class="grid-2" style="margin-bottom:24px;">
          <div class="glass-panel" style="padding:16px;">
            <div style="font-family:var(--font-display); font-size:0.95rem; color:var(--matrix-green); margin-bottom:8px;">🌾 AGRICULTURAL ASSESSMENT</div>
            <p style="font-size:0.86rem; color:var(--text-muted);">
              Canopy vigor is assessed at <strong>${analysisData.vegetation.healthScore}%</strong>. Recommended irrigation condition: 
              <strong>${analysisData.vegetation.waterIndicator}</strong>. Parcel shows stable photosynthetic activity with localized variations.
            </p>
          </div>

          <div class="glass-panel" style="padding:16px;">
            <div style="font-family:var(--font-display); font-size:0.95rem; color:var(--plasma-red); margin-bottom:8px;">⚠️ HAZARD & DISASTER INDICATORS</div>
            <p style="font-size:0.86rem; color:var(--text-muted);">
              Drought Risk Category: <strong style="color:var(--orbital-gold);">${analysisData.drought.riskLevel}</strong>.<br>
              Thermal Anomaly Indicator: <strong>${analysisData.fire.damageIndicator}</strong>.<br>
              Water Inundation Potential: <strong>${analysisData.water.coverage > 30 ? 'Elevated' : 'Standard Baseline'}</strong>.
            </p>
          </div>
        </div>

        <!-- Official Disclaimer -->
        <div style="background:rgba(255, 209, 102, 0.08); border:1px solid rgba(255, 209, 102, 0.3); border-radius:var(--radius-sm); padding:14px; font-size:0.78rem; color:var(--orbital-gold); line-height:1.5;">
          <strong>IMPORTANT PROTOTYPE NOTICE:</strong><br>
          This document is generated by AstroNova's client-side prototype remote sensing algorithms. All figures are mathematical estimations derived from in-browser pixel RGB processing and must NOT be used for real flight telemetry, official disaster evacuations, or certified agricultural insurance claims.
        </div>
      </div>
    `;

    this.modal.classList.add('active');
  }

  close() {
    if (this.modal) this.modal.classList.remove('active');
  }

  async saveToIndexedDB() {
    if (!this.currentData || !window.AstroStorage) return;
    await window.AstroStorage.saveRecord({
      title: `${this.currentTitle} (${new Date().toLocaleDateString()})`,
      type: 'report',
      imageDataUrl: this.currentImage,
      data: this.currentData,
      isFavorite: false
    });
    if (window.AstroApp) {
      window.AstroApp.showToast('SAVED TO MY EARTH DATA', 'Dossier stored in local IndexedDB vault.', 'success');
    }
  }
}

window.SmartReportGenerator = SmartReportGenerator;
