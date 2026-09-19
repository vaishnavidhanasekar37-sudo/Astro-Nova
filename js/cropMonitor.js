/**
 * ASTRONOVA - Smart Crop Monitor
 * Crop-specific health estimation & educational agricultural suggestions
 * Supported crops: Rice, Wheat, Maize, Cotton, Vegetables, Other
 */

class SmartCropMonitor {
  constructor() {
    this.crops = {
      rice: {
        name: 'Rice (Paddy)',
        emoji: '🌾',
        waterReqBase: 'High (Standing water optimal)',
        optimumGreenness: 65,
        guidance: {
          healthy: 'Chlorophyll canopy is dense. Maintain water depth at 5-7 cm during tillering stage. Monitor for stem borer signs.',
          moderate: 'Mild chlorophyll depression detected. Check nitrogen level; apply split urea dose if within panicle initiation.',
          stressed: 'High dryness detected! Paddy fields require prompt irrigation to prevent moisture stress and yield loss.'
        }
      },
      wheat: {
        name: 'Wheat',
        emoji: '🌿',
        waterReqBase: 'Moderate (Crown root & flowering stages)',
        optimumGreenness: 55,
        guidance: {
          healthy: 'Canopy vigor is optimal. Suitable for heading stage. Ensure field drainage during heavy rainfall.',
          moderate: 'Sub-optimal greenness. Inspect for yellow rust or micronutrient deficiency (zinc/iron).',
          stressed: 'Severe water deficit detected. Immediate crown root irrigation recommended.'
        }
      },
      maize: {
        name: 'Maize (Corn)',
        emoji: '🌽',
        waterReqBase: 'Moderate to High (Tasseling & silking)',
        optimumGreenness: 60,
        guidance: {
          healthy: 'Robust vegetative canopy. Maintain soil moisture particularly during tasseling.',
          moderate: 'Slight discoloration noted. Check for nitrogen chlorosis or fall armyworm leaf damage.',
          stressed: 'Critical water deficiency. Maize leaves will curl under drought; irrigate immediately.'
        }
      },
      cotton: {
        name: 'Cotton',
        emoji: '🌱',
        waterReqBase: 'Moderate (Avoid waterlogging)',
        optimumGreenness: 50,
        guidance: {
          healthy: 'Foliage canopy balanced. Ensure adequate aeration in root zone to prevent boll shedding.',
          moderate: 'Vegetative growth lagging. Consider balanced NPK foliar spray.',
          stressed: 'Soil moisture depleted. Irrigate lightly; avoid standing water on heavy clay soils.'
        }
      },
      vegetables: {
        name: 'Horticultural Vegetables',
        emoji: '🥬',
        waterReqBase: 'Frequent Shallow Irrigation',
        optimumGreenness: 58,
        guidance: {
          healthy: 'Vibrant leaf area index. Maintain drip irrigation scheduling and inspect underside of leaves for pests.',
          moderate: 'Canopy density uneven. Implement light mulching to conserve moisture.',
          stressed: 'High moisture deficit. Vegetables exhibit rapid wilting; irrigate and provide shading if possible.'
        }
      },
      other: {
        name: 'General Field Crop',
        emoji: '🌻',
        waterReqBase: 'Crop Dependent',
        optimumGreenness: 50,
        guidance: {
          healthy: 'Overall canopy spectral reflection indicates stable vegetative state.',
          moderate: 'Moderate spectral reflectance. Conduct local soil testing for electrical conductivity and pH balance.',
          stressed: 'Elevated dryness detected across the parcel. Check irrigation line integrity.'
        }
      }
    };

    this.selectedCrop = 'rice';
    this.latestAnalysis = null;
    this.init();
  }

  init() {
    this.bindEvents();
    this.updateCropUI();
  }

  bindEvents() {
    const cropCards = document.querySelectorAll('.crop-card-btn');
    cropCards.forEach(card => {
      card.addEventListener('click', (e) => {
        const cropKey = e.currentTarget.dataset.crop;
        if (cropKey && this.crops[cropKey]) {
          this.selectedCrop = cropKey;
          cropCards.forEach(c => c.classList.remove('active'));
          e.currentTarget.classList.add('active');
          this.updateCropUI();
        }
      });
    });
  }

  setAnalysisData(analysisResult) {
    this.latestAnalysis = analysisResult;
    this.updateCropUI();
  }

  updateCropUI() {
    const crop = this.crops[this.selectedCrop];
    if (!crop) return;

    // Use latest analysis or fallback prototype values
    const vegPct = this.latestAnalysis ? this.latestAnalysis.vegetation.percentage : 68;
    const drynessPct = this.latestAnalysis ? this.latestAnalysis.drought.drynessPercentage : 22;
    const healthScore = this.latestAnalysis ? this.latestAnalysis.vegetation.healthScore : 74;

    // Calculate crop-specific health
    const healthDelta = vegPct - crop.optimumGreenness;
    let statusCategory = 'healthy';
    if (drynessPct > 45 || healthScore < 40) {
      statusCategory = 'stressed';
    } else if (healthDelta < -15 || healthScore < 65) {
      statusCategory = 'moderate';
    }

    const advice = crop.guidance[statusCategory];

    // Update DOM
    const nameEl = document.getElementById('crop-selected-name');
    const healthEl = document.getElementById('crop-health-val');
    const vegEl = document.getElementById('crop-veg-val');
    const waterEl = document.getElementById('crop-water-val');
    const dryEl = document.getElementById('crop-dry-val');
    const adviceEl = document.getElementById('crop-advice-text');

    if (nameEl) nameEl.textContent = crop.name;
    if (healthEl) healthEl.textContent = `${healthScore}%`;
    if (vegEl) vegEl.textContent = `${vegPct}%`;
    if (waterEl) waterEl.textContent = crop.waterReqBase;
    if (dryEl) dryEl.textContent = `${drynessPct}%`;
    if (adviceEl) adviceEl.textContent = advice;
  }
}

window.SmartCropMonitor = SmartCropMonitor;
