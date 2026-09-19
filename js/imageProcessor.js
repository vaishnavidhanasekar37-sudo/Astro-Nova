/**
 * ASTRONOVA - Remote Sensing Local Image Processor
 * 100% Client-Side Spectral Pixel Analysis using Canvas ImageData
 * Modules: Vegetation Health (ExG/NDVI), Water Intelligence (NDWI),
 * Fire & Burn Scar Detection, and Drought & Dryness Index.
 * 
 * All outputs prominently labeled as Local Estimates / Prototype.
 */

class RemoteSensingProcessor {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
  }

  /**
   * Loads an image (from File, Blob, DataURL, or Image element) onto canvas
   */
  async loadImage(source) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        this.canvas.width = img.naturalWidth || img.width;
        this.canvas.height = img.naturalHeight || img.height;
        this.ctx.drawImage(img, 0, 0);
        resolve(img);
      };
      img.onerror = reject;

      if (source instanceof File || source instanceof Blob) {
        const reader = new FileReader();
        reader.onload = (e) => (img.src = e.target.result);
        reader.readAsDataURL(source);
      } else if (typeof source === 'string') {
        img.src = source;
      } else if (source instanceof HTMLImageElement) {
        this.canvas.width = source.naturalWidth || source.width;
        this.canvas.height = source.naturalHeight || source.height;
        this.ctx.drawImage(source, 0, 0);
        resolve(source);
      } else {
        reject(new Error('Invalid image source'));
      }
    });
  }

  /**
   * Runs the comprehensive spectral evaluation across all indices
   */
  analyzeCurrentImage() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w === 0 || h === 0) return null;

    const imgData = this.ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const totalPixels = w * h;

    let totalGreenPixels = 0;
    let totalWaterPixels = 0;
    let totalFireBurnPixels = 0;
    let totalDrySoilPixels = 0;

    let sumR = 0, sumG = 0, sumB = 0, sumLuma = 0;

    // Masks for false-color visualization overlays
    const vegMask = new Uint8ClampedArray(data.length);
    const waterMask = new Uint8ClampedArray(data.length);
    const fireMask = new Uint8ClampedArray(data.length);
    const droughtMask = new Uint8ClampedArray(data.length);

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      sumR += r;
      sumG += g;
      sumB += b;

      // Perceived luminance (ITU-R BT.601)
      const luma = 0.299 * r + 0.587 * g + 0.114 * b;
      sumLuma += luma;

      // 1. Vegetation Index (Excess Green Index: ExG = 2G - R - B)
      // High green dominance indicates active chlorophyll canopy
      const exg = 2 * g - r - b;
      const isVegetation = (g > r * 1.05 && g > b * 1.05 && exg > 15) || (g > 80 && g > r && g > b);
      if (isVegetation) {
        totalGreenPixels++;
        // Green false-color overlay
        vegMask[i] = 16;
        vegMask[i + 1] = 220;
        vegMask[i + 2] = 130;
        vegMask[i + 3] = 200;
      } else {
        vegMask[i] = r;
        vegMask[i + 1] = g;
        vegMask[i + 2] = b;
        vegMask[i + 3] = 70;
      }

      // 2. Water Index (Modified NDWI: Green & Blue dominance over Red)
      // Water strongly absorbs red/NIR and reflects blue-green
      const isWater = (b > r * 1.25 && g > r * 1.05 && b > 60) || 
                      (b > 110 && r < 90 && g < 140) ||
                      (b > 70 && g > 70 && r < 50);
      if (isWater) {
        totalWaterPixels++;
        // Vibrant cyan false-color
        waterMask[i] = 0;
        waterMask[i + 1] = 243;
        waterMask[i + 2] = 255;
        waterMask[i + 3] = 220;
      } else {
        waterMask[i] = r;
        waterMask[i + 1] = g;
        waterMask[i + 2] = b;
        waterMask[i + 3] = 70;
      }

      // 3. Fire / Thermal / Burn Scar Index
      // Active fire: extreme red/orange (r > 190, g between 50-160, b < 70)
      // Burn scar: very low luma (< 45) with slight reddish charred tint
      const isFireFlame = (r > 190 && g > 60 && g < 180 && b < 80);
      const isBurnScar = (luma < 48 && r > g && r > b && (r - g) > 4);
      if (isFireFlame || isBurnScar) {
        totalFireBurnPixels++;
        fireMask[i] = isFireFlame ? 255 : 180;
        fireMask[i + 1] = isFireFlame ? 50 : 30;
        fireMask[i + 2] = 20;
        fireMask[i + 3] = 230;
      } else {
        fireMask[i] = r;
        fireMask[i + 1] = g;
        fireMask[i + 2] = b;
        fireMask[i + 3] = 60;
      }

      // 4. Drought / Dry Soil Index
      // Dry arid soil: high red/yellow (r > 130, g > 110, b < 100), low greenness, high luma
      const isDrySoil = (r > 115 && g > 95 && b < 90 && Math.abs(r - g) < 45 && !isVegetation && !isWater);
      if (isDrySoil) {
        totalDrySoilPixels++;
        droughtMask[i] = 255;
        droughtMask[i + 1] = 180;
        droughtMask[i + 2] = 60;
        droughtMask[i + 3] = 200;
      } else {
        droughtMask[i] = r;
        droughtMask[i + 1] = g;
        droughtMask[i + 2] = b;
        droughtMask[i + 3] = 60;
      }
    }

    // Calculations
    const avgR = Math.round(sumR / totalPixels);
    const avgG = Math.round(sumG / totalPixels);
    const avgB = Math.round(sumB / totalPixels);
    const avgLuma = Math.round(sumLuma / totalPixels);

    const vegPercentage = Math.min(Math.round((totalGreenPixels / totalPixels) * 100), 100);
    const waterPercentage = Math.min(Math.round((totalWaterPixels / totalPixels) * 100), 100);
    const burnPercentage = Math.min(Math.round((totalFireBurnPixels / totalPixels) * 100), 100);
    const drynessPercentage = Math.min(Math.round((totalDrySoilPixels / totalPixels) * 100), 100);

    // Health Score: combines vegetation presence, healthy green-red ratio, penalized by excessive dryness/burn
    const healthScore = Math.max(0, Math.min(100, Math.round(
      (vegPercentage * 0.75) + ((100 - drynessPercentage) * 0.15) - (burnPercentage * 0.8) + (avgG > avgR ? 10 : 0)
    )));

    // Water-to-land ratio
    const landPercentage = Math.max(1, 100 - waterPercentage);
    const waterToLandRatio = (waterPercentage / landPercentage).toFixed(2);

    // Drought risk determination
    let droughtRisk = 'Low';
    if (drynessPercentage > 50 || (vegPercentage < 20 && waterPercentage < 8)) {
      droughtRisk = 'High';
    } else if (drynessPercentage > 25 || vegPercentage < 40) {
      droughtRisk = 'Moderate';
    }

    return {
      metadata: {
        width: w,
        height: h,
        totalPixels,
        analyzedAt: new Date().toISOString(),
        disclaimer: 'LOCAL ANALYSIS – SIMULATED DATA – PROTOTYPE ONLY'
      },
      channels: { avgR, avgG, avgB, avgLuma },
      vegetation: {
        percentage: vegPercentage,
        greenAreaPercentage: vegPercentage,
        healthScore: healthScore,
        drynessLevel: drynessPercentage,
        waterIndicator: waterPercentage > 15 ? 'Adequate' : (waterPercentage > 5 ? 'Low' : 'Deficient'),
        label: 'Local Image Estimate'
      },
      water: {
        coverage: waterPercentage,
        regionsEstimate: Math.max(1, Math.round(totalWaterPixels / 12000)),
        waterToLandRatio: waterToLandRatio,
        label: 'Local Spectral Approximation'
      },
      fire: {
        burnPercentage: burnPercentage,
        heatRegionsEstimate: Math.max(0, Math.round(totalFireBurnPixels / 8000)),
        damageIndicator: burnPercentage > 30 ? 'Severe' : (burnPercentage > 10 ? 'Moderate' : 'Low / Negligible'),
        label: 'Prototype Image Indicator – Not a Real Fire Detection System'
      },
      drought: {
        drynessPercentage: drynessPercentage,
        vegetationPercentage: vegPercentage,
        waterIndicator: waterPercentage + '%',
        riskLevel: droughtRisk,
        label: 'Prototype Aridity Estimate'
      },
      masks: {
        vegMask,
        waterMask,
        fireMask,
        droughtMask,
        width: w,
        height: h
      }
    };
  }

  /**
   * Renders a specific false-color overlay onto a target HTML5 canvas
   */
  renderMaskToCanvas(targetCanvas, maskData, width, height) {
    if (!targetCanvas || !maskData) return;
    targetCanvas.width = width;
    targetCanvas.height = height;
    const ctx = targetCanvas.getContext('2d');
    const imgData = ctx.createImageData(width, height);
    imgData.data.set(maskData);
    ctx.putImageData(imgData, 0, 0);
  }
}

window.RemoteSensingProcessor = RemoteSensingProcessor;
