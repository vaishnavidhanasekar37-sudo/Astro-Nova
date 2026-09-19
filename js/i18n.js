/**
 * ASTRONOVA - Multilingual Internationalization Engine (i18n)
 * Supports 10 Languages:
 * Tamil (ta), English (en), Malayalam (ml), Kannada (kn), Telugu (te),
 * Marathi (mr), Hindi (hi), Russian (ru), German (de), Spanish (es).
 *
 * Provides full UI localization, BCP-47 locale tags, dynamic language switching,
 * and synchronizes speech synthesis (TTS) & recognition.
 */

class I18nManager {
  constructor() {
    this.storageKey = 'astronova_language';

        // Supported 10 languages metadata
    this.languages = {
      ta: { code: 'ta', locale: 'ta-IN', name: 'தமிழ்', englishName: 'Tamil', flag: '🇮🇳' },
      en: { code: 'en', locale: 'en-US', name: 'English', englishName: 'English', flag: '🇬🇧' },
      ml: { code: 'ml', locale: 'ml-IN', name: 'മലയാളം', englishName: 'Malayalam', flag: '🇮🇳' },
      kn: { code: 'kn', locale: 'kn-IN', name: 'ಕನ್ನಡ', englishName: 'Kannada', flag: '🇮🇳' },
      te: { code: 'te', locale: 'te-IN', name: 'తెలుగు', englishName: 'Telugu', flag: '🇮🇳' },
      mr: { code: 'mr', locale: 'mr-IN', name: 'मराठी', englishName: 'Marathi', flag: '🇮🇳' },
      hi: { code: 'hi', locale: 'hi-IN', name: 'हिन्दी', englishName: 'Hindi', flag: '🇮🇳' },
      ru: { code: 'ru', locale: 'ru-RU', name: 'Русский', englishName: 'Russian', flag: '🇷🇺' },
      de: { code: 'de', locale: 'de-DE', name: 'Deutsch', englishName: 'German', flag: '🇩🇪' },
      es: { code: 'es', locale: 'es-ES', name: 'Español', englishName: 'Spanish', flag: '🇪🇸' }
    };

    const saved = localStorage.getItem(this.storageKey);
    this.currentLang = this.languages[saved] ? saved : 'en';
    localStorage.setItem(this.storageKey, this.currentLang);

    this.translations = {
      // 1. ENGLISH
      en: {
        orbitalEquatorActive: "Orbital Equator Active",
        welcomeEquatorText: "Welcome to AstroNova",
        planetsRevolving: "8 Planets Revolving Continuously",
        orbitalEpoch: "Epoch: J2026.4",
        mcTrackerTitle: "Real-Time Orbital Telemetry",
        mcLEO: "700 km LEO Orbit",
        mcBattery: "Battery Level:",
        mcSignal: "Signal Strength:",
        mcAltitude: "Orbital Altitude:",
        mcSpeed: "Orbital Velocity:",
        mcProgress: "Orbit Progress:",
        mcThermal: "Thermal Radiator:",
        mcSolar: "Solar Array Output:",
        mcHealth: "Overall System Health:",
        explainSimpleTab: "Simple Explanation",
        explainTechTab: "Technical Explanation",
        explainSimpleText: "Your image shows a relatively high green-region estimate. This may indicate vegetation-covered land. The result is based only on local image characteristics.",
        explainTechText: "Excess Green Index computed as ExG = 2G - R - B. Normalized Difference Water Index (NDWI) evaluated across Blue (450nm equivalent) and NIR-simulated absorption bands.",
        filesSub: "Client-side IndexedDB repository for stored images, spectral analyses, reports, and comparisons.",
        btnFilterFav: "Filter Favorites",
        btnExportBackup: "Export Backup (JSON)",
        settingsSub: "Configure preferences, manage themes, export data, and inspect local device storage.",
        zeroServerTag: "ZERO SERVER DEPENDENCY",
        settingConfigTitle: "SYSTEM CONFIGURATION",
        settingSoundFx: "🔊 Button Click Sounds:",
        settingSoundFxEnabled: "Sound Effects Enabled",
        settingDisplayMode: "🌓 Display Mode:",
        settingThemeLabel: "Interface Theme:",
        settingExportBtn: "📤 Export All Local Data (JSON)",
        settingImportBtn: "📥 Import Data (JSON)",
        settingClearBtn: "🗑️ Clear All Stored Data",
        privacyCenterTitle: "PRIVACY CENTER",
        privacyOfflineBadge: "100% OFFLINE",
        privacyZeroCloud: "🔒 ZERO CLOUD TRANSMISSION GUARANTEE",
        privacyZeroCloudText: "“Your prototype analysis data is stored locally on this device.”",
        privacyLocalFootprint: "Local Data Footprint:",
        privacyImagesCount: "Images Stored in IndexedDB:",
        privacyRecordsCount: "History Records in IndexedDB:",
        privacySandboxNote: "AstroNova operates strictly within your browser's sandboxed environment utilizing HTML5 Canvas, LocalStorage, and IndexedDB. No cookies, trackers, paid APIs, Firebase, or external telemetry servers are connected.",
        brandTitle: 'ASTRONOVA',
        brandSubtitle: 'Remote Sensing Earth Intelligence AI',
        statusLocalActive: '🛰️ Local Prototype Active',
        disclaimer: 'SIMULATED DATA – PROTOTYPE ONLY – NON-AUTHORITATIVE',
        welcomeHeading: 'WELCOME ASTRONOVA',
        welcomeSub: 'Next-Generation Remote Sensing & Planetary Earth Intelligence',
        btnEnterApp: 'ENTER ASTRONOVA',
        chooseLanguagePrompt: 'Select Language / மொழியைத் தேர்ந்தெடுக்கவும்:',

        // Navigation Dock Sections
        sectionCore: 'CORE INTELLIGENCE',
        sectionSpectral: 'SPECTRAL ANALYTICS',
        sectionVault: 'VAULT & SETTINGS',

        // Dock Items
        dockOverview: 'Overview',
        dockMission: 'Mission Control',
        dockEarthTwin: 'Earth Digital Twin',
        dockComparison: 'Image Comparison',
        dockVegetation: 'Spectral Hub (ExG)',
        dockWater: 'Water Intelligence',
        dockFire: 'Fire & Burn Area',
        dockDrought: 'Drought Monitor',
        dockCrops: 'Smart Crop Monitor',
        dockDisasters: 'Disaster Risk Map',
        dockAnalytics: 'Analytics & Trends',
        dockFiles: 'My Earth Data',
        dockSettings: 'Settings & Privacy',

        // Controls
        orbitOn: '🌌 Orbit: ON',
        orbitPaused: '🌌 Orbit: PAUSED',
        soundOn: 'Sound: ON',
        soundOff: 'Sound: MUTED',
        themeLight: 'Brightness',
        themeDark: 'Darkness',
        aiAssistantBtn: 'AI Assistant',
        voiceBtn: 'Voice',
        btnScanCamera: 'Scan Camera',
        btnDemoMode: 'Demo Mode',
        btnPresentation: 'Presentation',
        btnLockDevice: 'Lock',
        btnReplayIntro: 'Replay Intro',

        // Overview / Hero
        heroTitle: 'ASTRO-NOVA EARTH INTELLIGENCE',
        heroSubtitle: 'Next-generation client-side remote sensing AI, satellite telemetry, and environmental intelligence.',
        btnOpenSpectral: 'Open Spectral Analysis',
        btnGenerateReport: 'Generate Dossier',
        btnDownload: 'Download',

        // Hub & Metrics
        hubTitle: 'SATELLITE INGESTION HUB',
        dropzoneText: 'Drag & Drop Sentinel-2 GeoTIFF or Aerial Imagery',
        dropzoneSubtext: 'or browse local files from your terminal (Bands B02, B03, B04, B08)',
        btnBrowseFiles: 'Browse Files',
        btnLoadDemo: 'Load Demo Scene',
        recentObservation: 'RECENT SPECTRAL OBSERVATION',
        btnRunAnalysis: 'Run Live Analysis Pipeline',
        metricNdvi: 'NDVI Vegetation Health',
        metricNdwi: 'NDWI Water Index',
        metricBurn: 'Thermal Burn Score',
        metricDrought: 'Soil Dryness Index',
        gaugeVegetationLabel: 'Vegetation Health',
        gaugeWaterLabel: 'Surface Water',
        gaugeBurnLabel: 'Burn Severity',
        gaugeMoistureLabel: 'Soil Moisture',

        // Mission Control & Systems
        missionControlTitle: 'Mission Control Center',
        mcSubtitle: 'Real-time simulated constellation telemetry for active orbital ground observation units.',
        earthTwinTitle: 'Earth Digital Twin 3D',
        comparisonTitle: 'Before & After Comparison Studio',
        cropMonitorTitle: 'Smart Agricultural Crop Monitor',
        disasterMapTitle: 'Disaster Risk Assessment Map',
        analyticsTitle: 'Analytics & Historical Spectral Trends',
        vaultTitle: 'My Earth Observation Files',
        settingsTitle: 'Settings & Privacy Center',
        settingLangLabel: 'Language / भाषा / மொழி:',

        // AI Assistant
        aiTitle: 'AstroNova Earth Intelligence AI',
        aiSubtitle: 'Multilingual Voice + Text Assistant',
        aiPlaceholder: 'Ask about rain, sun, crops, soil, yield or satellites...',
        aiSendBtn: 'Send',
        aiClearBtn: 'Clear Chat',
        aiSpeakingOn: '🔊 Spoken Voice: ON',
        aiSpeakingOff: '🔇 Spoken Voice: OFF'
      },

      // 2. TAMIL (தமிழ்)
      ta: {
        orbitalEquatorActive: "பூமத்திய ரேகை சுற்றுப்பாதை இயங்குகிறது",
        welcomeEquatorText: "அஸ்ட்ரோநோவாவிற்கு நல்வரவு",
        planetsRevolving: "8 கோள்கள் தொடர்ந்து சுற்றுகின்றன",
        orbitalEpoch: "காலக்கட்டம்: J2026.4",
        mcTrackerTitle: "நிகழ்நேர சுற்றுப்பாதை கண்காணிப்பு",
        mcLEO: "700 கி.மீ LEO சுற்றுப்பாதை",
        mcBattery: "மின்கல அளவு:",
        mcSignal: "சிக்னல் வலிமை:",
        mcAltitude: "சுற்றுப்பாதை உயரம்:",
        mcSpeed: "சுற்றுப்பாதை வேகம்:",
        mcProgress: "சுற்றுப்பாதை முன்னேற்றம்:",
        mcThermal: "வெப்ப ரேடியேட்டர்:",
        mcSolar: "சூரிய மின்கல உற்பத்தி:",
        mcHealth: "ஒட்டுமொத்த கணினி நிலை:",
        explainSimpleTab: "எளிய விளக்கம்",
        explainTechTab: "தொழில்நுட்ப விளக்கம்",
        explainSimpleText: "உங்கள் படம் அதிக பசுமையான தாவரப் பகுதியைக் காட்டுகிறது. இது தாவரங்களால் மூடப்பட்ட நிலத்தைக் குறிக்கலாம்.",
        explainTechText: "அதிகப்படியான பச்சை குறியீடு ExG = 2G - R - B என கணக்கிடப்படுகிறது. NDWI குறியீடு நீர்ப்பரப்பு மற்றும் உறிஞ்சுதல் பட்டைகளை ஆய்வு செய்கிறது.",
        filesSub: "சேமிக்கப்பட்ட படங்கள், நிறமாலை பகுப்பாய்வுகள், அறிக்கைகளுக்கான கிளையன்ட்-பக்க சேமிப்பகம்.",
        btnFilterFav: "விருப்பமானவை மட்டும்",
        btnExportBackup: "காப்புப்பிரதி ஏற்றுமதி (JSON)",
        settingsSub: "விருப்பங்களை உள்ளமைக்கவும், கருப்பொருள்களை நிர்வகிக்கவும், உள்ளூர் சேமிப்பகத்தை ஆய்வு செய்யவும்.",
        zeroServerTag: "சர்வர் சார்பற்றது",
        settingConfigTitle: "கணினி அமைப்பு",
        settingSoundFx: "🔊 பொத்தான் கிளிக் ஒலிகள்:",
        settingSoundFxEnabled: "ஒலி விளைவுகள் இயக்கப்பட்டுள்ளன",
        settingDisplayMode: "🌓 காட்சி முறை:",
        settingThemeLabel: "இடைமுக வண்ணத் தீம்:",
        settingExportBtn: "📤 அனைத்து உள்ளூர் தரவையும் ஏற்றுமதி செய்க (JSON)",
        settingImportBtn: "📥 தரவை இறக்குமதி செய்க (JSON)",
        settingClearBtn: "🗑️ அனைத்து சேமிக்கப்பட்ட தரவையும் அழிக்கவும்",
        privacyCenterTitle: "தனியுரிமை மையம்",
        privacyOfflineBadge: "100% ஆஃப்லைன்",
        privacyZeroCloud: "🔒 கிளவுட் பரிமாற்றம் இல்லை உத்தரவாதம்",
        privacyZeroCloudText: "“உங்கள் பகுப்பாய்வுத் தரவு இந்த சாதனத்தில் மட்டுமே உள்ளூரில் சேமிக்கப்படுகிறது.”",
        privacyLocalFootprint: "உள்ளூர் தரவு அளவு:",
        privacyImagesCount: "சேமிக்கப்பட்ட படங்கள்:",
        privacyRecordsCount: "வரலாற்று பதிவுகள்:",
        privacySandboxNote: "அஸ்ட்ரோநோவா உங்கள் உலாவியின் பாதுகாப்பான சூழலில் மட்டுமே இயங்குகிறது. குக்கீகள், டிராக்கர்கள் அல்லது வெளிப்புற சர்வர்கள் எதுவும் இணைக்கப்படவில்லை.",
        brandTitle: 'அஸ்ட்ரோநோவா',
        brandSubtitle: 'தொலை உணர்வு பூமி நுண்ணறிவு AI',
        statusLocalActive: '🛰️ மாதிரி இயங்குகிறது',
        disclaimer: 'உருவகப்படுத்தப்பட்ட மாதிரி தரவு – அதிகாரப்பூர்வமற்றது',
        welcomeHeading: 'அஸ்ட்ரோநோவாவிற்கு நல்வரவு',
        welcomeSub: 'அடுத்த தலைமுறை தொலை உணர்வு மற்றும் கோள் நுண்ணறிவு',
        btnEnterApp: 'அஸ்ட்ரோநோவாவைத் தொடங்கு',
        chooseLanguagePrompt: 'மொழியைத் தேர்ந்தெடுக்கவும்:',

        sectionCore: 'முதன்மை நுண்ணறிவு',
        sectionSpectral: 'நிறமாலை பகுப்பாய்வு',
        sectionVault: 'தரவு பெட்டகம் & அமைப்புகள்',

        dockOverview: 'கண்ணோட்டம்',
        dockMission: 'மிஷன் கட்டுப்பாடு',
        dockEarthTwin: 'பூமி டிஜிட்டல் இரட்டை',
        dockComparison: 'பட ஒப்பீடு',
        dockVegetation: 'நிறமாலை மையம் (ExG)',
        dockWater: 'நீர் நுண்ணறிவு',
        dockFire: 'தீ மற்றும் எரிந்த பகுதி',
        dockDrought: 'வறட்சி கண்காணிப்பு',
        dockCrops: 'ஸ்மார்ட் பயிர் கண்காணிப்பு',
        dockDisasters: 'பேரிடர் இடர் வரைபடம்',
        dockAnalytics: 'பகுப்பாய்வு மற்றும் போக்குகள்',
        dockFiles: 'எனது பூமி தரவு',
        dockSettings: 'அமைப்புகள் & தனியுரிமை',

        orbitOn: '🌌 சுற்றுப்பாதை: ஆன்',
        orbitPaused: '🌌 சுற்றுப்பாதை: இடைநிறுத்தம்',
        soundOn: 'ஒலி: ஆன்',
        soundOff: 'ஒலி: முடக்கப்பட்டது',
        themeLight: 'ஒளிர்வு',
        themeDark: 'இருள்',
        aiAssistantBtn: 'AI உதவியாளர்',
        voiceBtn: 'குரல் வழி',
        btnScanCamera: 'கேமரா ஸ்கேன்',
        btnDemoMode: 'மாதிரி முறை',
        btnPresentation: 'விளக்கக்காட்சி',
        btnLockDevice: 'முடக்கு',
        btnReplayIntro: 'மறுதொடக்க அறிமுகம்',

        heroTitle: 'அஸ்ட்ரோ-நோவா பூமி நுண்ணறிவு',
        heroSubtitle: 'அடுத்த தலைமுறை உலாவி சார் செயற்கை நுண்ணறிவு, செயற்கைக்கோள் தொலை அளவியல் மற்றும் சுற்றுச்சூழல் நுண்ணறிவு.',
        btnOpenSpectral: 'நிறமாலை பகுப்பாய்வைத் திற',
        btnGenerateReport: 'அறிக்கையை உருவாக்கு',
        btnDownload: 'பதிவிறக்கு',

        hubTitle: 'செயற்கைக்கோள் பதிவேற்ற மையம்',
        dropzoneText: 'Sentinel-2 GeoTIFF அல்லது வான்வழிப் படங்களை இங்கு இழுத்து விடவும்',
        dropzoneSubtext: 'அல்லது உள்ளூர் கோப்புகளைத் தேர்ந்தெடுக்கவும் (B02, B03, B04, B08)',
        btnBrowseFiles: 'கோப்புகளைத் தேடுக',
        btnLoadDemo: 'மாதிரி படத்தை ஏற்று',
        recentObservation: 'சமீபத்திய நிறமாலை பார்வை',
        btnRunAnalysis: 'நேரலை பகுப்பாய்வை இயக்கு',
        metricNdvi: 'NDVI தாவர ஆரோக்கியம்',
        metricNdwi: 'NDWI நீர் குறியீடு',
        metricBurn: 'வெப்ப எரிப்பு மதிப்பெண்',
        metricDrought: 'மண் வறட்சி குறியீடு',
        gaugeVegetationLabel: 'தாவர ஆரோக்கியம்',
        gaugeWaterLabel: 'மேற்பரப்பு நீர்',
        gaugeBurnLabel: 'எரிந்த தீவிரம்',
        gaugeMoistureLabel: 'மண் ஈரப்பதம்',

        missionControlTitle: 'மிஷன் கட்டுப்பாட்டு மையம்',
        mcSubtitle: 'செயலில் உள்ள செயற்கைக்கோள்களுக்கான நிகழ்நேர தொலை அளவியல்.',
        earthTwinTitle: 'பூமி முப்பரிமாண டிஜிட்டல் இரட்டை',
        comparisonTitle: 'முன் மற்றும் பின் பட ஒப்பீட்டு அரங்கம்',
        cropMonitorTitle: 'ஸ்மார்ட் விவசாய பயிர் கண்காணிப்பு',
        disasterMapTitle: 'பேரிடர் இடர் மதிப்பீட்டு வரைபடம்',
        analyticsTitle: 'பகுப்பாய்வு மற்றும் வரலாற்று நிறமாலை போக்குகள்',
        vaultTitle: 'எனது பூமி கண்காணிப்பு கோப்புகள்',
        settingsTitle: 'கணினி அமைப்புகள் & தனியுரிமை மையம்',
        settingLangLabel: 'மொழி / Language:',

        aiTitle: 'அஸ்ட்ரோநோவா பூமி நுண்ணறிவு AI',
        aiSubtitle: 'பன்மொழி குரல் மற்றும் உரை உதவியாளர்',
        aiPlaceholder: 'மழை, வெயில், நிலம், பயிர் விளைச்சல் அல்லது செயற்கைக்கோள் பற்றிக் கேளுங்கள்...',
        aiSendBtn: 'அனுப்பு',
        aiClearBtn: 'அரட்டையை அழி',
        aiSpeakingOn: '🔊 பேசும் குரல்: ஆன்',
        aiSpeakingOff: '🔇 பேசும் குரல்: முடக்கப்பட்டது'
      },

      // 3. MALAYALAM (മലയാളം)
      ml: {
        orbitalEquatorActive: "ഭ്രമണപഥ മധ്യരേഖ സജീവം",
        welcomeEquatorText: "ആസ്ട്രോനോവയിലേക്ക് സ്വാഗതം",
        planetsRevolving: "8 ഗ്രഹങ്ങൾ തുടർച്ചയായി ഭ്രമണം ചെയ്യുന്നു",
        orbitalEpoch: "കാലഘട്ടം: J2026.4",
        mcTrackerTitle: "തത്സമയ ഭ്രമണപഥ ടെലിമെട്രി",
        mcLEO: "700 കി.മീ LEO ഭ്രമണപഥം",
        mcBattery: "ബാറ്ററി ലെവൽ:",
        mcSignal: "സിഗ്നൽ കരുത്ത്:",
        mcAltitude: "ഭ്രമണപഥ ഉയരം:",
        mcSpeed: "ഭ്രമണപഥ വേഗത:",
        mcProgress: "ഭ്രമണപഥ പുരോഗതി:",
        mcThermal: "തെർമൽ റേഡിയേറ്റർ:",
        mcSolar: "സോളാർ പാനൽ ഔട്ട്പുട്ട്:",
        mcHealth: "സിസ്റ്റം ആരോഗ്യം:",
        explainSimpleTab: "ലളിതമായ വിശദീകരണം",
        explainTechTab: "സാങ്കേതിക വിശദീകരണം",
        explainSimpleText: "നിങ്ങളുടെ ചിത്രം താരതമ്യേന ഉയർന്ന ഹരിത പ്രദേശം കാണിക്കുന്നു. ഇത് സസ്യങ്ങളുള്ള ഭൂമിയെ സൂചിപ്പിക്കുന്നു.",
        explainTechText: "അധിക പച്ച സൂചിക ExG = 2G - R - B ആയി കണക്കാക്കുന്നു. നീല, NIR ബാൻഡുകളിൽ NDWI വിലയിരുത്തപ്പെടുന്നു.",
        filesSub: "സംഭരിച്ച ചിത്രങ്ങൾ, സ്പെക്ട്രൽ വിശകലനങ്ങൾ, റിപ്പോർട്ടുകൾ എന്നിവയ്ക്കായുള്ള പ്രാദേശിക സംഭരണം.",
        btnFilterFav: "പ്രിയപ്പെട്ടവ ഫിൽട്ടർ ചെയ്യുക",
        btnExportBackup: "ബാക്കപ്പ് എക്സ്പോർട്ട് ചെയ്യുക (JSON)",
        settingsSub: "മുൻഗണനകൾ ക്രമീകരിക്കുക, തീമുകൾ കൈകാര്യം ചെയ്യുക, ഡാറ്റ നിയന്ത്രിക്കുക.",
        zeroServerTag: "സെർവർ ആശ്രിതത്വമില്ല",
        settingConfigTitle: "സിസ്റ്റം കോൺഫിഗറേഷൻ",
        settingSoundFx: "🔊 ബട്ടൺ ക്ലിക്ക് ശബ്ദങ്ങൾ:",
        settingSoundFxEnabled: "ശബ്ദ ഇഫക്റ്റുകൾ സജീവം",
        settingDisplayMode: "🌓 ഡിസ്പ്ലേ മോഡ്:",
        settingThemeLabel: "ഇന്റർഫേസ് തീം:",
        settingExportBtn: "📤 എല്ലാ ഡാറ്റയും എക്സ്പോർട്ട് ചെയ്യുക (JSON)",
        settingImportBtn: "📥 ഡാറ്റ ഇമ്പോർട്ട് ചെയ്യുക (JSON)",
        settingClearBtn: "🗑️ എല്ലാ ഡാറ്റയും മായ്ക്കുക",
        privacyCenterTitle: "സ്വകാര്യതാ കേന്ദ്രം",
        privacyOfflineBadge: "100% ഓഫ്‌ലൈൻ",
        privacyZeroCloud: "🔒 ക്ലൗഡ് ട്രാൻസ്മിഷൻ ഇല്ല ഗ്യാരണ്ടി",
        privacyZeroCloudText: "“നിങ്ങളുടെ വിശകലന ഡാറ്റ ഈ ഉപകരണത്തിൽ മാത്രമേ സംഭരിക്കപ്പെടുന്നുള്ളൂ.”",
        privacyLocalFootprint: "പ്രാദേശിക ഡാറ്റ വലുപ്പം:",
        privacyImagesCount: "IndexedDB-ൽ സംഭരിച്ച ചിത്രങ്ങൾ:",
        privacyRecordsCount: "ചരിത്ര രേഖകൾ:",
        privacySandboxNote: "ആസ്ട്രോനോവ നിങ്ങളുടെ ബ്രൗസറിന്റെ സുരക്ഷിതമായ പരിതസ്ഥിതിയിൽ മാത്രമേ പ്രവർത്തിക്കൂ. ബാഹ്യ സെർവറുകളൊന്നും ബന്ധിപ്പിച്ചിട്ടില്ല.",
        brandTitle: 'ആസ്ട്രോനോവ',
        brandSubtitle: 'റിമോട്ട് സെൻസിംഗ് എർത്ത് ഇൻ്റലിജൻസ് AI',
        statusLocalActive: '🛰️ പ്രോട്ടോടൈപ്പ് സജീവം',
        disclaimer: 'സിമുലേറ്റഡ് ഡാറ്റ – പ്രോട്ടോടൈപ്പ് മാത്രം',
        welcomeHeading: 'സ്വാഗതം ആസ്ട്രോനോവ',
        welcomeSub: 'അടുത്ത തലമുറ റിമോട്ട് സെൻസിംഗും ഭൂമി ബുദ്ധിയും',
        btnEnterApp: 'ആസ്ട്രോനോവ ആരംഭിക്കുക',
        chooseLanguagePrompt: 'ഭാഷ തിരഞ്ഞെടുക്കുക:',

        sectionCore: 'പ്രധാന ബുദ്ധി',
        sectionSpectral: 'സ്പെക്ട്രൽ വിശകലനം',
        sectionVault: 'ഡാറ്റാ നിലവറയും ക്രമീകരണങ്ങളും',

        dockOverview: 'അവലോകനം',
        dockMission: 'മിഷൻ കൺട്രോൾ',
        dockEarthTwin: 'ഭൂമി ഡിജിറ്റൽ ഇരട്ട',
        dockComparison: 'ചിത്ര താരതമ്യം',
        dockVegetation: 'സസ്യജാല ഹബ്ബ് (ExG)',
        dockWater: 'ജല നിരീക്ഷണം',
        dockFire: 'തീപിടുത്ത പ്രദേശം',
        dockDrought: 'വരൾച്ചാ നിരീക്ഷണം',
        dockCrops: 'സ്മാർട്ട് വിള നിരീക്ഷണം',
        dockDisasters: 'ദുരന്ത സാധ്യത ഭൂപടം',
        dockAnalytics: 'വിശകലനവും പ്രവണതകളും',
        dockFiles: 'എന്റെ ഭൂമി ഡാറ്റ',
        dockSettings: 'ക്രമീകരണങ്ങൾ',

        orbitOn: '🌌 ഭ്രമണപഥം: ഓൺ',
        orbitPaused: '🌌 ഭ്രമണപഥം: താൽക്കാലികമായി നിർത്തി',
        soundOn: 'ശബ്ദം: ഓൺ',
        soundOff: 'ശബ്ദം: ഓഫ്',
        themeLight: 'വെളിച്ചം',
        themeDark: 'ഇരുട്ട്',
        aiAssistantBtn: 'AI അസിസ്റ്റന്റ്',
        voiceBtn: 'ശബ്ദം',
        btnScanCamera: 'ക്യാമറ സ്കാൻ',
        btnDemoMode: 'ഡെമോ മോഡ്',
        btnPresentation: 'അവതരണം',
        btnLockDevice: 'ലോക്ക്',
        btnReplayIntro: 'ആമുഖം വീണ്ടും',

        heroTitle: 'ആസ്ട്രോ-നോവ ഭൗമ ഇന്റലിജൻസ്',
        heroSubtitle: 'അടുത്ത തലമുറ റിമോട്ട് സെൻസിംഗ് AI, ഉപഗ്രഹ ടെലിമെട്രി, പരിസ്ഥിതി ബുദ്ധി.',
        btnOpenSpectral: 'സ്പെക്ട്രൽ വിശകലനം തുറക്കുക',
        btnGenerateReport: 'റിപ്പോർട്ട് തയ്യാറാക്കുക',
        btnDownload: 'ഡൗൺലോഡ്',

        hubTitle: 'ഉപഗ്രഹ ഡാറ്റാ കേന്ദ്രം',
        dropzoneText: 'Sentinel-2 GeoTIFF അല്ലെങ്കിൽ ഏരിയൽ ചിത്രങ്ങൾ ഇവിടെ വലിച്ചിടുക',
        dropzoneSubtext: 'അല്ലെങ്കിൽ ഫയലുകൾ തിരഞ്ഞെടുക്കുക (B02, B03, B04, B08)',
        btnBrowseFiles: 'ഫയലുകൾ തിരയുക',
        btnLoadDemo: 'ഡെമോ ചിത്രം ലോഡ് ചെയ്യുക',
        recentObservation: 'സമീപകാല സ്പെക്ട്രൽ നിരീക്ഷണം',
        btnRunAnalysis: 'ലൈവ് വിശകലനം നടത്തുക',
        metricNdvi: 'NDVI സസ്യ ആരോഗ്യം',
        metricNdwi: 'NDWI ജല സൂചിക',
        metricBurn: 'താപ ദഹന സ്കോർ',
        metricDrought: 'മണ്ണ് വരൾച്ചാ സൂചിക',
        gaugeVegetationLabel: 'സസ്യ ആരോഗ്യം',
        gaugeWaterLabel: 'ഉപരിതല ജലം',
        gaugeBurnLabel: 'കത്തലിന്റെ തീവ്രത',
        gaugeMoistureLabel: 'മണ്ണിലെ ഈർപ്പം',

        missionControlTitle: 'മിഷൻ കൺട്രോൾ സെന്റർ',
        mcSubtitle: 'സജീവ ഉപഗ്രഹങ്ങൾക്കായുള്ള തത്സമയ ടെലിമെട്രി.',
        earthTwinTitle: 'ഭൂമി 3D ഡിജിറ്റൽ ഇരട്ട',
        comparisonTitle: 'ചിത്ര താരതമ്യ സ്റ്റുഡിയോ',
        cropMonitorTitle: 'സ്മാർട്ട് കാർഷിക വിള നിരീക്ഷണം',
        disasterMapTitle: 'ദുരന്ത സാധ്യത വിലയിരുത്തൽ മാപ്പ്',
        analyticsTitle: 'വിശകലനവും ചരിത്രപരമായ പ്രവണതകളും',
        vaultTitle: 'എന്റെ ഭൗമ നിരീക്ഷണ ഫയലുകൾ',
        settingsTitle: 'ക്രമീകരണങ്ങളും സ്വകാര്യതയും',
        settingLangLabel: 'ഭാഷ / Language:',

        aiTitle: 'ആസ്ട്രോനോവ AI അസിസ്റ്റന്റ്',
        aiSubtitle: 'ബഹുഭാഷാ ശബ്ദ-ടെക്സ്റ്റ് സഹായി',
        aiPlaceholder: 'മഴ, വെയിൽ, കൃഷി, വിളവ്, ഉപഗ്രഹം എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ...',
        aiSendBtn: 'അയക്കുക',
        aiClearBtn: 'ചാറ്റ് മായ്ക്കുക',
        aiSpeakingOn: '🔊 സംസാരിക്കുന്ന ശബ്ദം: ഓൺ',
        aiSpeakingOff: '🔇 സംസാരിക്കുന്ന ശബ്ദം: ഓഫ്'
      },

      // 4. KANNADA (ಕನ್ನಡ)
      kn: {
        orbitalEquatorActive: "ಕಕ್ಷೀಯ ಸಮಭಾಜಕ ಸಕ್ರಿಯ",
        welcomeEquatorText: "ಆಸ್ಟ್ರೋನೋವಾಗೆ ಸುಸ್ವಾಗತ",
        planetsRevolving: "8 ಗ್ರಹಗಳು ನಿರಂತರವಾಗಿ ಪರಿಭ್ರಮಿಸುತ್ತಿವೆ",
        orbitalEpoch: "ಯುಗ: J2026.4",
        mcTrackerTitle: "ನೈಜ-ಸಮಯದ ಕಕ್ಷೀಯ ಟೆಲಿಮೆಟ್ರಿ",
        mcLEO: "700 ಕಿ.ಮೀ LEO ಕಕ್ಷೆ",
        mcBattery: "ಬ್ಯಾಟರಿ ಮಟ್ಟ:",
        mcSignal: "ಸಿಗ್ನಲ್ ಸಾಮರ್ಥ್ಯ:",
        mcAltitude: "ಕಕ್ಷೀಯ ಎತ್ತರ:",
        mcSpeed: "ಕಕ್ಷೀಯ ವೇಗ:",
        mcProgress: "ಕಕ್ಷೆಯ ಪ್ರಗತಿ:",
        mcThermal: "ಥರ್ಮಲ್ ರೇಡಿಯೇಟರ್:",
        mcSolar: "ಸೌರ ಫಲಕದ ಉತ್ಪಾದನೆ:",
        mcHealth: "ಒಟ್ಟಾರೆ ಸಿಸ್ಟಮ್ ಸ್ಥಿತಿ:",
        explainSimpleTab: "ಸರಳ ವಿವರಣೆ",
        explainTechTab: "ತಾಂತ್ರಿಕ ವಿವರಣೆ",
        explainSimpleText: "ನಿಮ್ಮ ಚಿತ್ರವು ಹಸಿರು ಪ್ರದೇಶದ ಹೆಚ್ಚಿನ ಅಂದಾಜನ್ನು ತೋರಿಸುತ್ತದೆ. ಇದು ಸಸ್ಯವರ್ಗದಿಂದ ಆವೃತವಾದ ಭೂಮಿಯನ್ನು ಸೂಚಿಸುತ್ತದೆ.",
        explainTechText: "ಹೆಚ್ಚುವರಿ ಹಸಿರು ಸೂಚ್ಯಂಕ ExG = 2G - R - B ಎಂದು ಲೆಕ್ಕಹಾಕಲಾಗಿದೆ. ನೀಲಿ ಮತ್ತು NIR ಬ್ಯಾಂಡ್‌ಗಳಲ್ಲಿ NDWI ಮೌಲ್ಯಮಾಪನ ಮಾಡಲಾಗಿದೆ.",
        filesSub: "ಸಂಗ್ರಹಿಸಿದ ಚಿತ್ರಗಳು, ರೋಹಿತ ವಿಶ್ಲೇಷಣೆಗಳು ಮತ್ತು ವರದಿಗಳಿಗಾಗಿ ಸಾಧನದ ಸಂಗ್ರಹಣೆ.",
        btnFilterFav: "ಮೆಚ್ಚಿನವುಗಳನ್ನು ಫಿಲ್ಟರ್ ಮಾಡಿ",
        btnExportBackup: "ಬ್ಯಾಕಪ್ ರಫ್ತು ಮಾಡಿ (JSON)",
        settingsSub: "ಆದ್ಯತೆಗಳನ್ನು ಕಾನ್ಫಿಗರ್ ಮಾಡಿ, ಥೀಮ್‌ಗಳನ್ನು ನಿರ್ವಹಿಸಿ ಮತ್ತು ಡೇಟಾ ರಫ್ತು ಮಾಡಿ.",
        zeroServerTag: "ಶೂನ್ಯ ಸರ್ವರ್ ಅವಲಂಬನೆ",
        settingConfigTitle: "ಸಿಸ್ಟಮ್ ಕಾನ್ಫಿಗರೇಶನ್",
        settingSoundFx: "🔊 ಬಟನ್ ಕ್ಲಿಕ್ ಶಬ್ದಗಳು:",
        settingSoundFxEnabled: "ಧ್ವನಿ ಪರಿಣಾಮಗಳು ಸಕ್ರಿಯವಾಗಿವೆ",
        settingDisplayMode: "🌓 ಪ್ರದರ್ಶನ ಮೋಡ್:",
        settingThemeLabel: "ಇಂಟರ್ಫೇಸ್ ಥೀಮ್:",
        settingExportBtn: "📤 ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ರಫ್ತು ಮಾಡಿ (JSON)",
        settingImportBtn: "📥 ಡೇಟಾ ಆಮದು ಮಾಡಿ (JSON)",
        settingClearBtn: "🗑️ ಎಲ್ಲಾ ಡೇಟಾವನ್ನು ಅಳಿಸಿ",
        privacyCenterTitle: "ಗೌಪ್ಯತೆ ಕೇಂದ್ರ",
        privacyOfflineBadge: "100% ಆಫ್‌ಲೈನ್",
        privacyZeroCloud: "🔒 ಶೂನ್ಯ ಕ್ಲೌಡ್ ಪ್ರಸರಣ ಖಾತರಿ",
        privacyZeroCloudText: "“ನಿಮ್ಮ ವಿಶ್ಲೇಷಣಾ ಡೇಟಾವನ್ನು ಈ ಸಾಧನದಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.”",
        privacyLocalFootprint: "ಸ್ಥಳೀಯ ಡೇಟಾ ಗಾತ್ರ:",
        privacyImagesCount: "IndexedDB ಯಲ್ಲಿ ಸಂಗ್ರಹಿಸಲಾದ ಚಿತ್ರಗಳು:",
        privacyRecordsCount: "ಇತಿಹಾಸ ದಾಖಲೆಗಳು:",
        privacySandboxNote: "ಆಸ್ಟ್ರೋನೋವಾ ಸಂಪೂರ್ಣವಾಗಿ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ನ ಸುರಕ್ಷಿತ ಪರಿಸರದಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
        brandTitle: 'ಆಸ್ಟ್ರೋನೋವಾ',
        brandSubtitle: 'ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್ ಭೂ ಗುಪ್ತಚರ AI',
        statusLocalActive: '🛰️ ಮಾದರಿ ಸಕ್ರಿಯವಾಗಿದೆ',
        disclaimer: 'ಸಿಮ್ಯುಲೇಟೆಡ್ ಡೇಟಾ – ಮೂಲಮಾದರಿ ಮಾತ್ರ',
        welcomeHeading: 'ಆಸ್ಟ್ರೋನೋವಾಗೆ ಸುಸ್ವಾಗತ',
        welcomeSub: 'ಮುಂದಿನ ಪೀಳಿಗೆಯ ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್ ಮತ್ತು ಗ್ರಹಗಳ ಬುದ್ಧಿಮತ್ತೆ',
        btnEnterApp: 'ಆಸ್ಟ್ರೋನೋವಾ ಪ್ರವೇಶಿಸಿ',
        chooseLanguagePrompt: 'ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ:',

        sectionCore: 'ಮುಖ್ಯ ಗುಪ್ತಚರ',
        sectionSpectral: 'ಸ್ಪೆಕ್ಟ್ರಲ್ ವಿಶ್ಲೇಷಣೆ',
        sectionVault: 'ಡೇಟಾ ವಾಲ್ಟ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು',

        dockOverview: 'ಅವಲೋಕನ',
        dockMission: 'ಮಿಷನ್ ನಿಯಂತ್ರಣ',
        dockEarthTwin: 'ಭೂಮಿ ಡಿಜಿಟಲ್ ಅವಳಿ',
        dockComparison: 'ಚಿತ್ರ ಹೋಲಿಕೆ',
        dockVegetation: 'ಸಸ್ಯವರ್ಗ ಹಬ್ (ExG)',
        dockWater: 'ನೀರಿನ ಗುಪ್ತಚರ',
        dockFire: 'ಬೆಂಕಿ ಮತ್ತು ಸುಟ್ಟ ಪ್ರದೇಶ',
        dockDrought: 'ಬರ ಮೇಲ್ವಿಚಾರಣೆ',
        dockCrops: 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ಮಾನಿಟರ್',
        dockDisasters: 'ವಿಪತ್ತು ಅಪಾಯ ನಕ್ಷೆ',
        dockAnalytics: 'ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಪ್ರವೃತ್ತಿಗಳು',
        dockFiles: 'ನನ್ನ ಭೂಮಿಯ ಡೇಟಾ',
        dockSettings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಗೌಪ್ಯತೆ',

        orbitOn: '🌌 ಕಕ್ಷೆ: ಆನ್',
        orbitPaused: '🌌 ಕಕ್ಷೆ: ವಿರಾಮಗೊಳಿಸಲಾಗಿದೆ',
        soundOn: 'ಧ್ವನಿ: ಆನ್',
        soundOff: 'ಧ್ವನಿ: ಮ್ಯೂಟ್',
        themeLight: 'ಬೆಳಕು',
        themeDark: 'ಕತ್ತಲೆ',
        aiAssistantBtn: 'AI ಸಹಾಯಕ',
        voiceBtn: 'ಧ್ವನಿ',
        btnScanCamera: 'ಕ್ಯಾಮೆರಾ ಸ್ಕ್ಯಾನ್',
        btnDemoMode: 'ಡೆಮೊ ಮೋಡ್',
        btnPresentation: 'ಪ್ರಸ್ತುತಿ',
        btnLockDevice: 'ಲಾಕ್',
        btnReplayIntro: 'ಪರಿಚಯ ಮರುಪ್ಲೇ',

        heroTitle: 'ಆಸ್ಟ್ರೋ-ನೋವಾ ಭೂ ಗುಪ್ತಚರ',
        heroSubtitle: 'ಮುಂದಿನ ಪೀಳಿಗೆಯ ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್ AI, ಉಪಗ್ರಹ ಟೆಲಿಮೆಟ್ರಿ ಮತ್ತು ಪರಿಸರ ಬುದ್ಧಿಮತ್ತೆ.',
        btnOpenSpectral: 'ಸ್ಪೆಕ್ಟ್ರಲ್ ವಿಶ್ಲೇಷಣೆ ತೆರೆಯಿರಿ',
        btnGenerateReport: 'ವರದಿ ರಚಿಸಿ',
        btnDownload: 'ಡೌನ್‌ಲೋಡ್',

        hubTitle: 'ಉಪಗ್ರಹ ಡೇಟಾ ಕೇಂದ್ರ',
        dropzoneText: 'Sentinel-2 GeoTIFF ಅಥವಾ ವೈಮಾನಿಕ ಚಿತ್ರಗಳನ್ನು ಇಲ್ಲಿ ಬಿಡಿ',
        dropzoneSubtext: 'ಅಥವಾ ಸ್ಥಳೀಯ ಫೈಲ್‌ಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ (B02, B03, B04, B08)',
        btnBrowseFiles: 'ಫೈಲ್‌ಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ',
        btnLoadDemo: 'ಡೆಮೊ ದೃಶ್ಯ ಲೋಡ್ ಮಾಡಿ',
        recentObservation: 'ಇತ್ತೀಚಿನ ಸ್ಪೆಕ್ಟ್ರಲ್ ವೀಕ್ಷಣೆ',
        btnRunAnalysis: 'ಲೈವ್ ವಿಶ್ಲೇಷಣೆ ನಡೆಸಿ',
        metricNdvi: 'NDVI ಸಸ್ಯವರ್ಗದ ಆರೋಗ್ಯ',
        metricNdwi: 'NDWI ನೀರಿನ ಸೂಚ್ಯಂಕ',
        metricBurn: 'ಉಷ್ಣ ಸುಡುವಿಕೆ ಸ್ಕೋರ್',
        metricDrought: 'ಮಣ್ಣಿನ ಬರ ಸೂಚ್ಯಂಕ',
        gaugeVegetationLabel: 'ಸಸ್ಯವರ್ಗದ ಆರೋಗ್ಯ',
        gaugeWaterLabel: 'ಮೇಲ್ಮೈ ನೀರು',
        gaugeBurnLabel: 'ಸುಡುವ ತೀವ್ರತೆ',
        gaugeMoistureLabel: 'ಮಣ್ಣಿನ ತೇವಾಂಶ',

        missionControlTitle: 'ಮಿಷನ್ ಕಂಟ್ರೋಲ್ ಸೆಂಟರ್',
        mcSubtitle: 'ಸಕ್ರಿಯ ಉಪಗ್ರಹಗಳ ನೈಜ-ಸಮಯದ ಟೆಲಿಮೆಟ್ರಿ.',
        earthTwinTitle: 'ಭೂಮಿ 3D ಡಿಜಿಟಲ್ ಅವಳಿ',
        comparisonTitle: 'ಚಿತ್ರ ಹೋಲಿಕೆ ಸ್ಟುಡಿಯೋ',
        cropMonitorTitle: 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಬೆಳೆ ಮಾನಿಟರ್',
        disasterMapTitle: 'ವಿಪತ್ತು ಅಪಾಯ ಮೌಲ್ಯಮಾಪನ ನಕ್ಷೆ',
        analyticsTitle: 'ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಐತಿಹಾಸಿಕ ಪ್ರವೃತ್ತಿಗಳು',
        vaultTitle: 'ನನ್ನ ಭೂಮಿ ವೀಕ್ಷಣಾ ಕಡತಗಳು',
        settingsTitle: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು ಮತ್ತು ಗೌಪ್ಯತೆ ಕೇಂದ್ರ',
        settingLangLabel: 'ಭಾಷೆ / Language:',

        aiTitle: 'ಆಸ್ಟ್ರೋನೋವಾ AI ಸಹಾಯಕ',
        aiSubtitle: 'ಬಹುಭಾಷಾ ಧ್ವನಿ ಮತ್ತು ಪಠ್ಯ ಸಹಾಯಕ',
        aiPlaceholder: 'ಮಳೆ, ಬಿಸಿಲು, ಮಣ್ಣು, ಬೆಳೆ ಇಳುವರಿ ಅಥವಾ ಉಪಗ್ರಹಗಳ ಬಗ್ಗೆ ಕೇಳಿ...',
        aiSendBtn: 'ಕಳುಹಿಸಿ',
        aiClearBtn: 'ಚಾಟ್ ತೆರವುಗೊಳಿಸಿ',
        aiSpeakingOn: '🔊 ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆ: ಆನ್',
        aiSpeakingOff: '🔇 ಧ್ವನಿ ಪ್ರತಿಕ್ರಿಯೆ: ಆಫ್'
      },

      // 5. TELUGU (తెలుగు)
      te: {
        orbitalEquatorActive: "కక్ష్యా భూమధ్యరేఖ సక్రియంగా ఉంది",
        welcomeEquatorText: "ఆస్ట్రోనోవాకు స్వాగతం",
        planetsRevolving: "8 గ్రహాలు నిరంతరం పరిభ్రమిస్తున్నాయి",
        orbitalEpoch: "యుగం: J2026.4",
        mcTrackerTitle: "రియల్ టైమ్ కక్ష్యా టెలిమెట్రీ",
        mcLEO: "700 కి.మీ LEO కక్ష్య",
        mcBattery: "బ్యాటరీ స్థాయి:",
        mcSignal: "సిగ్నల్ బలం:",
        mcAltitude: "ಕಕ್ಷ್ಯ ఎత్తు:",
        mcSpeed: "కక్ష్య వేగం:",
        mcProgress: "కక్ష్య పురోగతి:",
        mcThermal: "థర్మల్ రేడియేటర్:",
        mcSolar: "సోలార్ ప్యానెల్ అవుట్‌పుట్:",
        mcHealth: "మొత్తం సిస్టమ్ స్థితి:",
        explainSimpleTab: "సరళమైన వివరణ",
        explainTechTab: "సాంకేతిక వివరణ",
        explainSimpleText: "మీ చిత్రం సాపేక్షంగా ఎక్కువ పచ్చని ప్రాంత అంచనాను చూపుతుంది. ఇది వృక్షసంపదతో కూడిన భూమిని సూచిస్తుంది.",
        explainTechText: "అదనపు ఆకుపచ్చ సూచిక ExG = 2G - R - B గా లెక్కించబడింది. బ్లూ మరియు NIR బ్యాండ్లలో NDWI విశ్లేషించబడింది.",
        filesSub: "భద్రపరిచిన చిత్రాలు, స్పెక్ట్రల్ విశ్లేషణలు, నివేదికల కోసం స్థానిక డేటాబేస్.",
        btnFilterFav: "ఇష్టమైనవి ఫిల్ಟರ್ చేయండి",
        btnExportBackup: "బ్యాకప్ ఎగుమతి (JSON)",
        settingsSub: "ప్రాధాన్యతలను కాన్ఫిగర్ చేయండి, థీమ్‌లను నిర్వహించండి మరియు డేటాను ఎగుమతి చేయండి.",
        zeroServerTag: "సున్నా సర్వర్ ఆధారపడటం",
        settingConfigTitle: "సిస్టమ్ కాన్ఫిగరేషన్",
        settingSoundFx: "🔊 బటన్ క్లిక్ శబ్దాలు:",
        settingSoundFxEnabled: "సౌండ్ ఎఫెక్ట్స్ ప్రారంభించబడ్డాయి",
        settingDisplayMode: "🌓 ప్రదర్శన మోడ్:",
        settingThemeLabel: "ఇంటర్‌ఫేస్ థీమ్:",
        settingExportBtn: "📤 మొత్తం డేటాను ఎగుమతి చేయండి (JSON)",
        settingImportBtn: "📥 డేటాను దిగుమతి చేయండి (JSON)",
        settingClearBtn: "🗑️ మొత్తం డేಟాను తొలಗించండి",
        privacyCenterTitle: "గోప్యతా కేంద్రం",
        privacyOfflineBadge: "100% ఆఫ్‌లైన్",
        privacyZeroCloud: "🔒 సున్నా క్లౌడ్ ట్రాన్స్‌మిషన్ హామీ",
        privacyZeroCloudText: "“మీ విశ్లేషణ డేటా ఈ పరికరంలో మాత్రమే స్థానికంగా నిల్వ చేయబడుతుంది.”",
        privacyLocalFootprint: "స్థానిక డేటా పరిమాణం:",
        privacyImagesCount: "IndexedDB లో నిల్వ చేయబడిన చిత్రాలు:",
        privacyRecordsCount: "చరిత్ర రికార్డులు:",
        privacySandboxNote: "ఆస్ట్రోనోవా పూర్తిగా మీ బ్రౌజర్ యొక్క సురక్షిత వాతావరణంలో పనిచేస్తుంది.",
        brandTitle: 'ఆస్ట్రోనోవా',
        brandSubtitle: 'రిమోట్ సెన్సింగ్ ఎర్త్ ఇంటెలిజెన్స్ AI',
        statusLocalActive: '🛰️ నమూనా సక్రియం',
        disclaimer: 'సిమ్యులేటెడ్ డేటా – ప్రోటోటైప్ మాత్రమే',
        welcomeHeading: 'ఆస్ట్రోనోవాకు స్వాగతం',
        welcomeSub: 'తదుపరి తరం రిమోట్ సెన్సింగ్ మరియు భూమి ఇంటెలిజెన్స్',
        btnEnterApp: 'ఆస్ట్రోనోవా ప్రారంభించండి',
        chooseLanguagePrompt: 'భాషను ఎంచుకోండి:',

        sectionCore: 'ప్రధాన ఇంటెలిజెన్స్',
        sectionSpectral: 'స్పెక్ట్రల్ విశ్లేషణ',
        sectionVault: 'డేటా వాల్ట్ & సెట్టింగ్‌లు',

        dockOverview: 'అవలోకనం',
        dockMission: 'మిషన్ కంట్రోల్',
        dockEarthTwin: 'ఎర్త్ డిజిటల్ ట్విన్',
        dockComparison: 'చిత్ర పోలిక',
        dockVegetation: 'వృక్షసంపద కేంద్రం (ExG)',
        dockWater: 'నీటి ఇంటెలిజెన్స్',
        dockFire: 'అగ్ని ప్రమాద ప్రాంతం',
        dockDrought: 'కరువు పర్యవేక్షణ',
        dockCrops: 'స్మార్ట్ పంట మానిటర్',
        dockDisasters: 'విపత్తు ముప్పు పటం',
        dockAnalytics: 'విశ్లేషణ మరియు పోకడలు',
        dockFiles: 'నా భూమి డేటా',
        dockSettings: 'సెట్టింగ్‌లు & గోప్యత',

        orbitOn: '🌌 కక్ష్య: ఆన్',
        orbitPaused: '🌌 కక్ష్య: పాజ్ చేయబడింది',
        soundOn: 'ధ్వని: ఆన్',
        soundOff: 'ధ్వని: మ్యూట్',
        themeLight: 'వెలుగు',
        themeDark: 'చీకటి',
        aiAssistantBtn: 'AI అసిస్టెంట్',
        voiceBtn: 'వాయిస్',
        btnScanCamera: 'కెమెరా స్కాన్',
        btnDemoMode: 'డెమో మోడ్',
        btnPresentation: 'ప్రదర్శన',
        btnLockDevice: 'లాక్',
        btnReplayIntro: 'పరిచయం మళ్లీ ప్లే చేయి',

        heroTitle: 'ఆస్ట్రో-నోవా ఎర్త్ ఇంటెలిజెన్స్',
        heroSubtitle: 'తదుపరి తరం రిమోట్ సెన్సింగ్ AI, ఉపగ్రహ టెలిమెట్రీ మరియు పర్యావరణ ఇంటెలిజెన్స్.',
        btnOpenSpectral: 'స్పెక్ట్రల్ విశ్లేషణ తెరవండి',
        btnGenerateReport: 'నివేదిక రూపొందించండి',
        btnDownload: 'డౌన్‌లోడ్',

        hubTitle: 'ఉపగ్రహ డేటా కేంద్రం',
        dropzoneText: 'Sentinel-2 GeoTIFF లేదా ఏరియల్ చిత్రాలను ఇక్కడ లాగండి',
        dropzoneSubtext: 'లేదా స్థానిక ఫైళ్లను ఎంచుకోండి (B02, B03, B04, B08)',
        btnBrowseFiles: 'ఫైళ్లను బ్రౌజ్ చేయండి',
        btnLoadDemo: 'డెమో చిత్రాన్ని లోడ్ చేయండి',
        recentObservation: 'ఇటీవలి స్పెక్ట్రల్ పరిశీలన',
        btnRunAnalysis: 'లైవ్ విశ్లేషణను ప్రారంభించండి',
        metricNdvi: 'NDVI వృక్షసంపద ఆరోగ్యం',
        metricNdwi: 'NDWI నీటి సూచిక',
        metricBurn: 'థర్మల్ బర్న్ స్కోరు',
        metricDrought: 'నేల కరువు సూచిక',
        gaugeVegetationLabel: 'వృక్షసంపద ఆరోగ్యం',
        gaugeWaterLabel: 'ఉపరితల నీరు',
        gaugeBurnLabel: 'కాలిన తీవ్రత',
        gaugeMoistureLabel: 'నేల తేమ',

        missionControlTitle: 'మిషన్ కంట్రోల్ సెంటర్',
        mcSubtitle: 'కక్ష్యలో ఉన్న ఉపగ్రహాల ప్రత్యక్ష టెలిమెట్రీ.',
        earthTwinTitle: 'ఎర్త్ 3D డిజిటల్ ట్విన్',
        comparisonTitle: 'చిత్ర పోలిక స్టూడియో',
        cropMonitorTitle: 'స్మార్ట్ వ్యవసాయ పంట మానిటర్',
        disasterMapTitle: 'విపత్తు ముప్పు అంచనా పటం',
        analyticsTitle: 'విశ్లేషణ మరియు చారిత్రక పోకడలు',
        vaultTitle: 'నా భూమి పరిశీలన ఫైళ్లు',
        settingsTitle: 'సెట్టింగ్‌లు & గోప్యతా కేంద్రం',
        settingLangLabel: 'భాష / Language:',

        aiTitle: 'ఆస్ట్రోనోవా AI అసిస్టెంట్',
        aiSubtitle: 'బహుభాషా వాయిస్ & టెక్స్ట్ సహాయకుడు',
        aiPlaceholder: 'వర్షం, ఎండ, నేల, పంట దిగుబడి లేదా ఉపగ్రహాల గురించి అడగండి...',
        aiSendBtn: 'పంపు',
        aiClearBtn: 'చాట్ క్లియర్ చేయి',
        aiSpeakingOn: '🔊 మాట్లాడే స్వరం: ఆన్',
        aiSpeakingOff: '🔇 మాట్లాడే స్వరం: ఆఫ్'
      },

      // 6. MARATHI (मराठी)
      mr: {
        orbitalEquatorActive: "कक्षीय विषुववृत्त सक्रिय",
        welcomeEquatorText: "अ‍ॅस्ट्रोनोव्हा मध्ये स्वागत",
        planetsRevolving: "8 ग्रह सतत फिरत आहेत",
        orbitalEpoch: "युग: J2026.4",
        mcTrackerTitle: "रिअल-टाइम कक्षीय टेलिमेट्री",
        mcLEO: "700 किमी LEO कक्षा",
        mcBattery: "बॅटरी पातळी:",
        mcSignal: "सिग्नल सामर्थ्य:",
        mcAltitude: "कक्षीय उंची:",
        mcSpeed: "कक्षीय वेग:",
        mcProgress: "कक्षा प्रगती:",
        mcThermal: "थर्मल रेडिएटर:",
        mcSolar: "सौर पॅनेल आउटपुट:",
        mcHealth: "एकूण सिस्टम स्थिती:",
        explainSimpleTab: "साधे स्पष्टीकरण",
        explainTechTab: "तांत्रिक स्पष्टीकरण",
        explainSimpleText: "तुमची प्रतिमा तुलनेने जास्त हिरवा भाग दर्शवते. हे वनस्पती-आच्छादित जमीन दर्शवू शकते.",
        explainTechText: "अतिरिक्त हिरवा निर्देशांक ExG = 2G - R - B म्हणून गणला जातो. NDWI निर्देशांक पाण्याचे मूल्यांकन करतो.",
        filesSub: "साठवलेल्या प्रतिमा, वर्णक्रमीय विश्लेषण आणि अहवालांसाठी स्थानिक डेटाबेस.",
        btnFilterFav: "आवडते फिल्टर करा",
        btnExportBackup: "बॅकअप निर्यात करा (JSON)",
        settingsSub: "प्राधान्ये कॉन्फिगर करा, थीम व्यवस्थापित करा आणि डेटा निर्यात करा.",
        zeroServerTag: "शून्य सर्व्हर अवलंबित्व",
        settingConfigTitle: "सिस्टम कॉन्फिगरेशन",
        settingSoundFx: "🔊 बटण क्लिक आवाज:",
        settingSoundFxEnabled: "ध्वनी प्रभाव सक्षम",
        settingDisplayMode: "🌓 डिस्प्ले मोड:",
        settingThemeLabel: "इंटरफेस थीम:",
        settingExportBtn: "📤 सर्व डेटा निर्यात करा (JSON)",
        settingImportBtn: "📥 डेटा आयात करा (JSON)",
        settingClearBtn: "🗑️ सर्व साठवलेला डेटा साफ करा",
        privacyCenterTitle: "गोपनीयता केंद्र",
        privacyOfflineBadge: "100% ऑफलाइन",
        privacyZeroCloud: "🔒 शून्य क्लाउड ट्रान्समिशन हमी",
        privacyZeroCloudText: "“तुमचा विश्लेषण डेटा केवळ या डिव्हाइसवर स्थानिक पातळीवर साठवला जातो.”",
        privacyLocalFootprint: "स्थानिक डेटा आकार:",
        privacyImagesCount: "IndexedDB मध्ये साठवलेल्या प्रतिमा:",
        privacyRecordsCount: "इतिहास नोंदी:",
        privacySandboxNote: "अ‍ॅस्ट्रोनोव्हा पूर्णपणे आपल्या ब्राउझरच्या सुरक्षित वातावरणात कार्य करते.",
        brandTitle: 'अ‍ॅस्ट्रोनोव्हा',
        brandSubtitle: 'रिमोट सेन्सिंग पृथ्वी बुद्धिमत्ता AI',
        statusLocalActive: '🛰️ प्रोटोटाइप सक्रिय',
        disclaimer: 'सिम्युलेटेड डेटा – केवळ प्रोटोटाइप',
        welcomeHeading: 'अ‍ॅस्ट्रोनोव्हा मध्ये आपले स्वागत आहे',
        welcomeSub: 'पुढील पिढीचे रिमोट सेन्सिंग आणि ग्रहांची बुद्धिमत्ता',
        btnEnterApp: 'अ‍ॅस्ट्रोनोव्हा सुरू करा',
        chooseLanguagePrompt: 'भाषा निवडा:',

        sectionCore: 'मुख्य बुद्धिमत्ता',
        sectionSpectral: 'स्पेक्ट्रल विश्लेषण',
        sectionVault: 'डेटा व्हॉल्ट आणि सेटिंग्ज',

        dockOverview: 'विहंगावलोकन',
        dockMission: 'मिशन नियंत्रण',
        dockEarthTwin: 'पृथ्वी डिजिटल ट्विन',
        dockComparison: 'प्रतिमा तुलना',
        dockVegetation: 'वनस्पती केंद्र (ExG)',
        dockWater: 'पाणी बुद्धिमत्ता',
        dockFire: 'आग आणि जळलेला भाग',
        dockDrought: 'दुष्काळ निरीक्षण',
        dockCrops: 'स्मार्ट पीक मॉनिटर',
        dockDisasters: 'आपत्ती धोका नकाशा',
        dockAnalytics: 'विश्लेषण आणि ट्रेंड',
        dockFiles: 'माझा पृथ्वी डेटा',
        dockSettings: 'सेटिंग्ज आणि गोपनीयता',

        orbitOn: '🌌 कक्षा: चालू',
        orbitPaused: '🌌 कक्षा: थांबवली',
        soundOn: 'आवाज: चालू',
        soundOff: 'आवाज: बंद',
        themeLight: 'प्रकाश',
        themeDark: 'अंधार',
        aiAssistantBtn: 'AI सहाय्यक',
        voiceBtn: 'आवाज',
        btnScanCamera: 'कॅमेरा स्कॅन',
        btnDemoMode: 'डेमो मोड',
        btnPresentation: 'सादरीकरण',
        btnLockDevice: 'लॉक',
        btnReplayIntro: 'पुन्हा परिचय पहा',

        heroTitle: 'अ‍ॅस्ट्रो-नोव्हा पृथ्वी बुद्धिमत्ता',
        heroSubtitle: 'पुढील पिढीचे रिमोट सेन्सिंग AI, उपग्रह टेलिमेट्री आणि पर्यावरण बुद्धिमत्ता.',
        btnOpenSpectral: 'स्पेक्ट्रल विश्लेषण उघडा',
        btnGenerateReport: 'अहवाल तयार करा',
        btnDownload: 'डाउनलोड',

        hubTitle: 'उपग्रह डेटा केंद्र',
        dropzoneText: 'Sentinel-2 GeoTIFF किंवा हवाई छायाचित्रे येथे ड्रॅग करा',
        dropzoneSubtext: 'किंवा स्थानिक फाइल्स निवडा (B02, B03, B04, B08)',
        btnBrowseFiles: 'फाइल्स शोधा',
        btnLoadDemo: 'डेमो दृश्य लोड करा',
        recentObservation: 'अलीकडील स्पेक्ट्रल निरीक्षण',
        btnRunAnalysis: 'थेट विश्लेषण चालवा',
        metricNdvi: 'NDVI वनस्पती आरोग्य',
        metricNdwi: 'NDWI जल निर्देशांक',
        metricBurn: 'थर्मल बर्न स्कोअर',
        metricDrought: 'माती दुष्काळ निर्देशांक',
        gaugeVegetationLabel: 'वनस्पती आरोग्य',
        gaugeWaterLabel: 'पृष्ठभागावरील पाणी',
        gaugeBurnLabel: 'तीव्रता',
        gaugeMoistureLabel: 'मातीतील ओलावा',

        missionControlTitle: 'मिशन नियंत्रण केंद्र',
        mcSubtitle: 'सक्रिय उपग्रहांसाठी थेट टेलिमेट्री.',
        earthTwinTitle: 'पृथ्वी 3D डिजिटल ट्विन',
        comparisonTitle: 'प्रतिमा तुलना स्टुडिओ',
        cropMonitorTitle: 'स्मार्ट शेती पीक मॉनिटर',
        disasterMapTitle: 'आपत्ती धोका मूल्यांकन नकाशा',
        analyticsTitle: 'विश्लेषण आणि ऐतिहासिक ट्रेंड',
        vaultTitle: 'माझ्या पृथ्वी निरीक्षण फाइल्स',
        settingsTitle: 'सेटिंग्ज आणि गोपनीयता केंद्र',
        settingLangLabel: 'भाषा / Language:',

        aiTitle: 'अ‍ॅस्ट्रोनोव्हा AI सहाय्यक',
        aiSubtitle: 'बहुभाषिक आवाज आणि मजकूर सहाय्यक',
        aiPlaceholder: 'पाऊस, सूर्यप्रकाश, जमीन, पीक उत्पादन किंवा उपग्रहांबद्दल विचारा...',
        aiSendBtn: 'पाठवा',
        aiClearBtn: 'गप्पा साफ करा',
        aiSpeakingOn: '🔊 बोलणारा आवाज: चालू',
        aiSpeakingOff: '🔇 बोलणारा आवाज: बंद'
      },

      // 7. HINDI (हिन्दी)
      hi: {
        orbitalEquatorActive: "कक्षीय भूमध्य रेखा सक्रिय",
        welcomeEquatorText: "एस्ट्रोनोवा में आपका स्वागत है",
        planetsRevolving: "8 ग्रह निरंतर परिक्रमा कर रहे हैं",
        orbitalEpoch: "युग: J2026.4",
        mcTrackerTitle: "वास्तविक समय कक्षीय टेलीमेट्री",
        mcLEO: "700 किमी LEO कक्षा",
        mcBattery: "बैटरी स्तर:",
        mcSignal: "सिग्नल शक्ति:",
        mcAltitude: "कक्षीय ऊंचाई:",
        mcSpeed: "कक्षीय वेग:",
        mcProgress: "कक्षा प्रगति:",
        mcThermal: "थर्मल रेडिएटर:",
        mcSolar: "सौर पैनल आउटपुट:",
        mcHealth: "समग्र प्रणाली स्वास्थ्य:",
        explainSimpleTab: "सरल व्याख्या",
        explainTechTab: "तकनीकी व्याख्या",
        explainSimpleText: "आपकी छवि अपेक्षाकृत उच्च हरित क्षेत्र का अनुमान दर्शाती है। यह वनस्पति से आच्छादित भूमि का संकेत हो सकता है।",
        explainTechText: "अतिरिक्त हरा सूचकांक ExG = 2G - R - B के रूप में गणना किया गया। जल सूचकांक (NDWI) नीले और NIR बैंड पर मूल्यांकित।",
        filesSub: "सहेजी गई छवियों, वर्णक्रमीय विश्लेषणों, रिपोर्टों के लिए स्थानीय डेटाबेस।",
        btnFilterFav: "पसंदीदा फ़िल्टर करें",
        btnExportBackup: "बैकअप निर्यात करें (JSON)",
        settingsSub: "प्राथमिकताएं कॉन्फ़िगर करें, थीम प्रबंधित करें और स्थानीय भंडारण की जांच करें।",
        zeroServerTag: "सर्वर निर्भरता शून्य",
        settingConfigTitle: "सिस्टम कॉन्फ़िगरेशन",
        settingSoundFx: "🔊 बटन क्लिक ध्वनियाँ:",
        settingSoundFxEnabled: "ध्वनि प्रभाव सक्षम",
        settingDisplayMode: "🌓 डिस्प्ले मोड:",
        settingThemeLabel: "इंटरफ़ेस थीम:",
        settingExportBtn: "📤 सभी स्थानीय डेटा निर्यात करें (JSON)",
        settingImportBtn: "📥 डेटा आयात करें (JSON)",
        settingClearBtn: "🗑️ सभी संग्रहीत डेटा हटाएं",
        privacyCenterTitle: "गोपनीयता केंद्र",
        privacyOfflineBadge: "100% ऑफ़लाइन",
        privacyZeroCloud: "🔒 शून्य क्लाउड ट्रांसमिशन गारंटी",
        privacyZeroCloudText: "“आपका विश्लेषण डेटा केवल इसी डिवाइस पर स्थानीय रूप से संग्रहीत है।”",
        privacyLocalFootprint: "स्थानीय डेटा आकार:",
        privacyImagesCount: "IndexedDB में संग्रहीत छवियां:",
        privacyRecordsCount: "IndexedDB में इतिहास रिकॉर्ड:",
        privacySandboxNote: "एस्ट्रोनोवा पूरी तरह से आपके ब्राउज़र के सुरक्षित वातावरण में काम करता है। कोई कुकीज़, ट्रैकर्स या बाहरी सर्वर जुड़े नहीं हैं।",
        brandTitle: 'एस्ट्रोनोवा',
        brandSubtitle: 'रिमोट सेंसिंग अर्थ इंटेलिजेंस AI',
        statusLocalActive: '🛰️ प्रोटोटाइप सक्रिय',
        disclaimer: 'सिम्युलेटेड डेटा – केवल प्रोटोटाइप',
        welcomeHeading: 'एस्ट्रोनोवा में आपका स्वागत है',
        welcomeSub: 'अगली पीढ़ी का रिमोट सेंसिंग और ग्रह बुद्धिमत्ता',
        btnEnterApp: 'एस्ट्रोनोवा शुरू करें',
        chooseLanguagePrompt: 'भाषा चुनें / Select Language:',

        sectionCore: 'कोर इंटेलिजेंस',
        sectionSpectral: 'स्पेक्ट्रल विश्लेषण',
        sectionVault: 'डेटा वॉल्ट और सेटिंग्स',

        dockOverview: 'अवलोकन',
        dockMission: 'मिशन नियंत्रण',
        dockEarthTwin: 'पृथ्वी डिजिटल ट्विन',
        dockComparison: 'छवि तुलना',
        dockVegetation: 'वनस्पति केंद्र (ExG)',
        dockWater: 'जल बुद्धिमत्ता',
        dockFire: 'आग और जला हुआ क्षेत्र',
        dockDrought: 'सूखा मॉनिटर',
        dockCrops: 'स्मार्ट फसल मॉनिटर',
        dockDisasters: 'आपदा जोखिम मानचित्र',
        dockAnalytics: 'विश्लेषण और रुझान',
        dockFiles: 'मेरा पृथ्वी डेटा',
        dockSettings: 'सेटिंग्स और गोपनीयता',

        orbitOn: '🌌 कक्षा: चालू',
        orbitPaused: '🌌 कक्षा: रुकी हुई',
        soundOn: 'ध्वनि: चालू',
        soundOff: 'ध्वनि: बंद',
        themeLight: 'प्रकाश',
        themeDark: 'अंधेरा',
        aiAssistantBtn: 'AI सहायक',
        voiceBtn: 'आवाज',
        btnScanCamera: 'कैमरा स्कैन',
        btnDemoMode: 'डेमो मोड',
        btnPresentation: 'प्रस्तुति',
        btnLockDevice: 'लॉक करें',
        btnReplayIntro: 'परिचय पुनः देखें',

        heroTitle: 'एस्ट्रो-नोवा अर्थ इंटेलिजेंस',
        heroSubtitle: 'अगली पीढ़ी का रिमोट सेंसिंग AI, उपग्रह टेलीमेट्री और पर्यावरण बुद्धिमत्ता।',
        btnOpenSpectral: 'स्पेक्ट्रल विश्लेषण खोलें',
        btnGenerateReport: 'रिपोर्ट बनाएं',
        btnDownload: 'डाउनलोड',

        hubTitle: 'उपग्रह डेटा केंद्र',
        dropzoneText: 'Sentinel-2 GeoTIFF या हवाई चित्र यहां खींचें और छोड़ें',
        dropzoneSubtext: 'या अपनी डिवाइस से फाइलें चुनें (B02, B03, B04, B08)',
        btnBrowseFiles: 'फाइलें चुनें',
        btnLoadDemo: 'डेमो दृश्य लोड करें',
        recentObservation: 'हालिया स्पेक्ट्रल अवलोकन',
        btnRunAnalysis: 'लाइव विश्लेषण चलाएं',
        metricNdvi: 'NDVI वनस्पति स्वास्थ्य',
        metricNdwi: 'NDWI जल सूचकांक',
        metricBurn: 'थर्मल बर्न स्कोर',
        metricDrought: 'मिट्टी का सूखा सूचकांक',
        gaugeVegetationLabel: 'वनस्पति स्वास्थ्य',
        gaugeWaterLabel: 'सतही जल',
        gaugeBurnLabel: 'दहन तीव्रता',
        gaugeMoistureLabel: 'मिट्टी की नमी',

        missionControlTitle: 'मिशन नियंत्रण केंद्र',
        mcSubtitle: 'सक्रिय उपग्रहों के लिए रीयल-टाइम टेलीमेट्री।',
        earthTwinTitle: 'पृथ्वी 3D डिजिटल ट्विन',
        comparisonTitle: 'छवि तुलना स्टूडियो',
        cropMonitorTitle: 'स्मार्ट कृषि फसल मॉनिटर',
        disasterMapTitle: 'आपदा जोखिम मूल्यांकन मानचित्र',
        analyticsTitle: 'विश्लेषण और ऐतिहासिक रुझान',
        vaultTitle: 'मेरी पृथ्वी अवलोकन फाइलें',
        settingsTitle: 'सेटिंग्स और गोपनीयता केंद्र',
        settingLangLabel: 'भाषा / Language:',

        aiTitle: 'एस्ट्रोनोवा AI सहायक',
        aiSubtitle: 'बहुभाषी आवाज और टेक्स्ट सहायक',
        aiPlaceholder: 'बारिश, धूप, जमीन, फसल की पैदावार या उपग्रहों के बारे में पूछें...',
        aiSendBtn: 'भेजें',
        aiClearBtn: 'चैट साफ करें',
        aiSpeakingOn: '🔊 बोलने वाली आवाज: चालू',
        aiSpeakingOff: '🔇 बोलने वाली आवाज: बंद'
      },

      // 8. RUSSIAN (Русский)
      ru: {
        orbitalEquatorActive: "Орбитальный экватор активен",
        welcomeEquatorText: "Добро пожаловать в АстроНова",
        planetsRevolving: "8 планет непрерывно вращаются",
        orbitalEpoch: "Эпоха: J2026.4",
        mcTrackerTitle: "Орбитальная телеметрия в реальном времени",
        mcLEO: "700 км низкая околоземная орбита",
        mcBattery: "Заряд батареи:",
        mcSignal: "Мощность сигнала:",
        mcAltitude: "Высота орбиты:",
        mcSpeed: "Орбитальная скорость:",
        mcProgress: "Прогресс витка:",
        mcThermal: "Тепловой радиатор:",
        mcSolar: "Мощность солнечных батарей:",
        mcHealth: "Общее состояние системы:",
        explainSimpleTab: "Простое объяснение",
        explainTechTab: "Техническое объяснение",
        explainSimpleText: "На изображении видна высокая доля растительного покрова на основе локальных характеристик изображения.",
        explainTechText: "Индекс Excess Green рассчитан как ExG = 2G - R - B. Индекс NDWI оценивает водные и спектральные полосы.",
        filesSub: "Локальное хранилище IndexedDB для спутниковых снимков, анализов и отчетов.",
        btnFilterFav: "Избранное",
        btnExportBackup: "Экспорт резервной копии (JSON)",
        settingsSub: "Настройка параметров, тем оформления и управление локальными данными.",
        zeroServerTag: "БЕЗ СЕРВЕРА",
        settingConfigTitle: "КОНФИГУРАЦИЯ СИСТЕМЫ",
        settingSoundFx: "🔊 Звуки нажатия кнопок:",
        settingSoundFxEnabled: "Звуковые эффекты включены",
        settingDisplayMode: "🌓 Режим отображения:",
        settingThemeLabel: "Тема интерфейса:",
        settingExportBtn: "📤 Экспорт всех локальных данных (JSON)",
        settingImportBtn: "📥 Импорт данных (JSON)",
        settingClearBtn: "🗑️ Очистить все сохраненные данные",
        privacyCenterTitle: "ЦЕНТР КОНФИДЕНЦИАЛЬНОСТИ",
        privacyOfflineBadge: "100% ОФФЛАЙН",
        privacyZeroCloud: "🔒 ГАРАНТИЯ ОТСУТСТВИЯ ПЕРЕДАЧИ В ОБЛАКО",
        privacyZeroCloudText: "«Данные анализа хранятся исключительно локально на вашем устройстве.»",
        privacyLocalFootprint: "Локальный объем данных:",
        privacyImagesCount: "Снимков в IndexedDB:",
        privacyRecordsCount: "Записей истории в IndexedDB:",
        privacySandboxNote: "AstroNova работает исключительно в изолированной среде браузера с использованием HTML5 Canvas, LocalStorage и IndexedDB. Никаких трекеров и внешних серверов.",
        brandTitle: 'АСТРОНОВА',
        brandSubtitle: 'ИИ Дистанционного Зондирования Земли',
        statusLocalActive: '🛰️ Локальный Прототип Активен',
        disclaimer: 'СИМУЛИРОВАННЫЕ ДАННЫЕ – ТОЛЬКО ПРОТОТИП',
        welcomeHeading: 'ДОБРО ПОЖАЛОВАТЬ В АСТРОНОВА',
        welcomeSub: 'Искусственный Интеллект Дистанционного Зондирования Планеты',
        btnEnterApp: 'ВОЙТИ В АСТРОНОВА',
        chooseLanguagePrompt: 'Выберите язык:',

        sectionCore: 'БАЗОВЫЙ ИНТЕЛЛЕКТ',
        sectionSpectral: 'СПЕКТРАЛЬНЫЙ АНАЛИЗ',
        sectionVault: 'ХРАНИЛИЩЕ И НАСТРОЙКИ',

        dockOverview: 'Обзор',
        dockMission: 'Центр Управления',
        dockEarthTwin: 'Цифровой Двойник Земли',
        dockComparison: 'Сравнение Снимков',
        dockVegetation: 'Спектральный Хаб (ExG)',
        dockWater: 'Водные Ресурсы',
        dockFire: 'Очаги Пожаров',
        dockDrought: 'Мониторинг Засухи',
        dockCrops: 'Мониторинг Урожая',
        dockDisasters: 'Карта Рисков Катастроф',
        dockAnalytics: 'Аналитика и Тренды',
        dockFiles: 'Мои Данные Земли',
        dockSettings: 'Настройки и Приватность',

        orbitOn: '🌌 Орбита: ВКЛ',
        orbitPaused: '🌌 Орбита: ПАУЗА',
        soundOn: 'Звук: ВКЛ',
        soundOff: 'Звук: ВЫКЛ',
        themeLight: 'Светлая',
        themeDark: 'Тёмная',
        aiAssistantBtn: 'ИИ Ассистент',
        voiceBtn: 'Голос',
        btnScanCamera: 'Сканировать Камерой',
        btnDemoMode: 'Демо Режим',
        btnPresentation: 'Презентация',
        btnLockDevice: 'Блокировка',
        btnReplayIntro: 'Повторить Интро',

        heroTitle: 'АСТРО-НОВА ЗЕМНОЙ ИНТЕЛЛЕКТ',
        heroSubtitle: 'Клиентский ИИ дистанционного зондирования, спутниковая телеметрия и экологический интеллект.',
        btnOpenSpectral: 'Открыть Спектральный Анализ',
        btnGenerateReport: 'Создать Отчет',
        btnDownload: 'Скачать',

        hubTitle: 'ХАБ СПУТНИКОВЫХ ДАННЫХ',
        dropzoneText: 'Перетащите GeoTIFF снимки Sentinel-2 или аэрофотоснимки',
        dropzoneSubtext: 'или выберите файлы на устройстве (Каналы B02, B03, B04, B08)',
        btnBrowseFiles: 'Выбрать Файлы',
        btnLoadDemo: 'Загрузить Демо Снимок',
        recentObservation: 'ПОСЛЕДНЕЕ НАБЛЮДЕНИЕ',
        btnRunAnalysis: 'Запустить Анализ',
        metricNdvi: 'Индекс Растительности NDVI',
        metricNdwi: 'Водный Индекс NDWI',
        metricBurn: 'Индекс Термического Выгорания',
        metricDrought: 'Индекс Сухости Почвы',
        gaugeVegetationLabel: 'Здоровье Растительности',
        gaugeWaterLabel: 'Поверхностные Воды',
        gaugeBurnLabel: 'Степень Выгорания',
        gaugeMoistureLabel: 'Влажность Почвы',

        missionControlTitle: 'Центр Управления Полетами',
        mcSubtitle: 'Реалистичная телеметрия орбитальной спутниковой группировки.',
        earthTwinTitle: '3D Цифровой Двойник Земли',
        comparisonTitle: 'Студия Сравнения Снимков',
        cropMonitorTitle: 'Умный Мониторинг Сельскохозяйственных Культур',
        disasterMapTitle: 'Карта Оценки Рисков ЧС',
        analyticsTitle: 'Аналитика и Исторические Тренды',
        vaultTitle: 'Файлы Наблюдения Земли',
        settingsTitle: 'Центр Настроек и Приватности',
        settingLangLabel: 'Язык / Language:',

        aiTitle: 'АстроНова ИИ Ассистент',
        aiSubtitle: 'Многоязычный голосовой и текстовый помощник',
        aiPlaceholder: 'Спросите о дожде, солнце, почве, урожае или спутниках...',
        aiSendBtn: 'Отправить',
        aiClearBtn: 'Очистить',
        aiSpeakingOn: '🔊 Голосовой ответ: ВКЛ',
        aiSpeakingOff: '🔇 Голосовой ответ: ВЫКЛ'
      },

      // 9. GERMAN (Deutsch)
      de: {
        orbitalEquatorActive: "Orbitaler Äquator aktiv",
        welcomeEquatorText: "Willkommen bei AstroNova",
        planetsRevolving: "8 Planeten kreisen kontinuierlich",
        orbitalEpoch: "Epoche: J2026.4",
        mcTrackerTitle: "Echtzeit-Orbitaltelemetrie",
        mcLEO: "700 km LEO-Umlaufbahn",
        mcBattery: "Akkustand:",
        mcSignal: "Signalstärke:",
        mcAltitude: "Bahnhöhe:",
        mcSpeed: "Orbitalgeschwindigkeit:",
        mcProgress: "Umlauffortschritt:",
        mcThermal: "Thermoradiator:",
        mcSolar: "Solarmodulleistung:",
        mcHealth: "Gesamtsystemstatus:",
        explainSimpleTab: "Einfache Erklärung",
        explainTechTab: "Technische Erklärung",
        explainSimpleText: "Ihr Bild zeigt eine relativ hohe Grünflächenschätzung, was auf vegetationsbedecktes Land hinweist.",
        explainTechText: "Excess Green Index berechnet als ExG = 2G - R - B. NDWI analysiert Wasser- und NIR-Spektralbänder.",
        filesSub: "Clientseitiger IndexedDB-Speicher für gespeicherte Bilder, Spektralanalysen und Berichte.",
        btnFilterFav: "Favoriten filtern",
        btnExportBackup: "Backup exportieren (JSON)",
        settingsSub: "Einstellungen konfigurieren, Themes verwalten und Daten exportieren.",
        zeroServerTag: "KEINE SERVERABHÄNGIGKEIT",
        settingConfigTitle: "SYSTEMKONFIGURATION",
        settingSoundFx: "🔊 Tastenklick-Töne:",
        settingSoundFxEnabled: "Soundeffekte aktiviert",
        settingDisplayMode: "🌓 Anzeigemodus:",
        settingThemeLabel: "Oberflächen-Theme:",
        settingExportBtn: "📤 Alle lokalen Daten exportieren (JSON)",
        settingImportBtn: "📥 Daten importieren (JSON)",
        settingClearBtn: "🗑️ Alle gespeicherten Daten löschen",
        privacyCenterTitle: "DATENSCHUTZZENTRUM",
        privacyOfflineBadge: "100% OFFLINE",
        privacyZeroCloud: "🔒 GARANTIE: KEINE CLOUD-ÜBERTRAGUNG",
        privacyZeroCloudText: "„Ihre Analysedaten werden ausschließlich lokal auf diesem Gerät gespeichert.“",
        privacyLocalFootprint: "Lokaler Speicherbedarf:",
        privacyImagesCount: "In IndexedDB gespeicherte Bilder:",
        privacyRecordsCount: "Verlaufsdatensätze in IndexedDB:",
        privacySandboxNote: "AstroNova arbeitet ausschließlich in der Sandbox Ihres Browsers. Keine Tracker, keine externen Server.",
        brandTitle: 'ASTRONOVA',
        brandSubtitle: 'Fernerkundung & Erd-Intelligenz KI',
        statusLocalActive: '🛰️ Lokaler Prototyp Aktiv',
        disclaimer: 'SIMULIERTE DATEN – NUR PROTOTYP',
        welcomeHeading: 'WILLKOMMEN BEI ASTRONOVA',
        welcomeSub: 'Fernerkundungs-KI und planetare Erdbeobachtung der nächsten Generation',
        btnEnterApp: 'ASTRONOVA STARTEN',
        chooseLanguagePrompt: 'Sprache wählen / Select Language:',

        sectionCore: 'KERNINTELLIGENZ',
        sectionSpectral: 'SPEKTRALANALYSE',
        sectionVault: 'DATENTRESOR & EINSTELLUNGEN',

        dockOverview: 'Übersicht',
        dockMission: 'Missionskontrolle',
        dockEarthTwin: 'Digitaler Zwilling der Erde',
        dockComparison: 'Bildvergleich',
        dockVegetation: 'Spektral-Hub (ExG)',
        dockWater: 'Wasserintelligenz',
        dockFire: 'Brand- & Brandflächen',
        dockDrought: 'Dürremonitor',
        dockCrops: 'Smarter Erntemonitor',
        dockDisasters: 'Katastrophen-Risikokarte',
        dockAnalytics: 'Analysen & Trends',
        dockFiles: 'Meine Erd-Daten',
        dockSettings: 'Einstellungen & Datenschutz',

        orbitOn: '🌌 Umlaufbahn: EIN',
        orbitPaused: '🌌 Umlaufbahn: PAUSIERT',
        soundOn: 'Ton: EIN',
        soundOff: 'Ton: STUMM',
        themeLight: 'Helligkeit',
        themeDark: 'Dunkelheit',
        aiAssistantBtn: 'KI-Assistent',
        voiceBtn: 'Sprache',
        btnScanCamera: 'Kamera-Scan',
        btnDemoMode: 'Demo-Modus',
        btnPresentation: 'Präsentation',
        btnLockDevice: 'Sperren',
        btnReplayIntro: 'Intro wiederholen',

        heroTitle: 'ASTRO-NOVA ERD-INTELLIGENZ',
        heroSubtitle: 'Clientseitige Fernerkundungs-KI der nächsten Generation, Satellitentelemetrie und Umweltintelligenz.',
        btnOpenSpectral: 'Spektralanalyse öffnen',
        btnGenerateReport: 'Dossier erstellen',
        btnDownload: 'Herunterladen',

        hubTitle: 'SATELLITEN-DATENZENTRUM',
        dropzoneText: 'Sentinel-2 GeoTIFF oder Luftbilder hierher ziehen',
        dropzoneSubtext: 'oder lokale Dateien auswählen (Kanäle B02, B03, B04, B08)',
        btnBrowseFiles: 'Dateien durchsuchen',
        btnLoadDemo: 'Demo-Szene laden',
        recentObservation: 'AKTUELLE BEOBACHTUNG',
        btnRunAnalysis: 'Live-Analyse ausführen',
        metricNdvi: 'NDVI Vegetationsgesundheit',
        metricNdwi: 'NDWI Wasserindex',
        metricBurn: 'Thermischer Brandwert',
        metricDrought: 'Bodendürre-Index',
        gaugeVegetationLabel: 'Vegetationsgesundheit',
        gaugeWaterLabel: 'Oberflächenwasser',
        gaugeBurnLabel: 'Brandintensität',
        gaugeMoistureLabel: 'Bodenfeuchtigkeit',

        missionControlTitle: 'Missionskontrollzentrum',
        mcSubtitle: 'Echtzeit-Telemetrie der aktiven orbitalen Beobachtungseinheiten.',
        earthTwinTitle: 'Digitaler 3D-Zwilling der Erde',
        comparisonTitle: 'Vorher-Nachher Vergleichsstudio',
        cropMonitorTitle: 'Intelligenter landwirtschaftlicher Erntemonitor',
        disasterMapTitle: 'Katastrophenrisiko-Karte',
        analyticsTitle: 'Analytik & Historische Spektraltrends',
        vaultTitle: 'Meine Erdbeobachtungs-Dateien',
        settingsTitle: 'Einstellungen & Datenschutzzentrum',
        settingLangLabel: 'Sprache / Language:',

        aiTitle: 'AstroNova Erd-Intelligenz KI',
        aiSubtitle: 'Mehrsprachiger Sprach- & Textassistent',
        aiPlaceholder: 'Fragen Sie nach Regen, Sonne, Boden, Ernteertrag oder Satelliten...',
        aiSendBtn: 'Senden',
        aiClearBtn: 'Chat leeren',
        aiSpeakingOn: '🔊 Sprachausgabe: EIN',
        aiSpeakingOff: '🔇 Sprachausgabe: AUS'
      },

      // 10. SPANISH (Español)
      es: {
        orbitalEquatorActive: "Ecuador orbital activo",
        welcomeEquatorText: "Bienvenido a AstroNova",
        planetsRevolving: "8 planetas girando continuamente",
        orbitalEpoch: "Época: J2026.4",
        mcTrackerTitle: "Telemetría orbital en tiempo real",
        mcLEO: "Órbita LEO de 700 km",
        mcBattery: "Nivel de batería:",
        mcSignal: "Fuerza de señal:",
        mcAltitude: "Altitud orbital:",
        mcSpeed: "Velocidad orbital:",
        mcProgress: "Progreso orbital:",
        mcThermal: "Radiador térmico:",
        mcSolar: "Rendimiento solar:",
        mcHealth: "Estado general del sistema:",
        explainSimpleTab: "Explicación simple",
        explainTechTab: "Explicación técnica",
        explainSimpleText: "Su imagen muestra una estimación relativamente alta de vegetación basada en las características de la imagen.",
        explainTechText: "Índice de exceso de verde calculado como ExG = 2G - R - B. Índice de agua (NDWI) evaluado en bandas azul y NIR.",
        filesSub: "Repositorio IndexedDB local para imágenes almacenadas, análisis espectrales e informes.",
        btnFilterFav: "Filtrar favoritos",
        btnExportBackup: "Exportar copia de seguridad (JSON)",
        settingsSub: "Configurar preferencias, administrar temas e inspeccionar almacenamiento local.",
        zeroServerTag: "CERO DEPENDENCIA DE SERVIDOR",
        settingConfigTitle: "CONFIGURACIÓN DEL SISTEMA",
        settingSoundFx: "🔊 Sonidos de botones:",
        settingSoundFxEnabled: "Efectos de sonido activados",
        settingDisplayMode: "🌓 Modo de visualización:",
        settingThemeLabel: "Tema de la interfaz:",
        settingExportBtn: "📤 Exportar todos los datos locales (JSON)",
        settingImportBtn: "📥 Importar datos (JSON)",
        settingClearBtn: "🗑️ Borrar todos los datos almacenados",
        privacyCenterTitle: "CENTRO DE PRIVACIDAD",
        privacyOfflineBadge: "100% SIN CONEXIÓN",
        privacyZeroCloud: "🔒 GARANTÍA DE CERO TRANSMISIÓN A LA NUBE",
        privacyZeroCloudText: "“Los datos de su análisis se almacenan únicamente de forma local en este dispositivo.”",
        privacyLocalFootprint: "Huella de datos local:",
        privacyImagesCount: "Imágenes guardadas en IndexedDB:",
        privacyRecordsCount: "Registros del historial en IndexedDB:",
        privacySandboxNote: "AstroNova funciona estrictamente en el entorno protegido de su navegador. Sin cookies, rastreadores ni servidores externos.",
        brandTitle: 'ASTRONOVA',
        brandSubtitle: 'IA de Detección Remota e Inteligencia Terrestre',
        statusLocalActive: '🛰️ Prototipo Local Activo',
        disclaimer: 'DATOS SIMULADOS – SOLO PROTOTIPO',
        welcomeHeading: 'BIENVENIDO A ASTRONOVA',
        welcomeSub: 'IA de Teledetección de Nueva Generación e Inteligencia Planetaria',
        btnEnterApp: 'ENTRAR A ASTRONOVA',
        chooseLanguagePrompt: 'Seleccione Idioma / Select Language:',

        sectionCore: 'INTELIGENCIA PRINCIPAL',
        sectionSpectral: 'ANÁLISIS ESPECTRAL',
        sectionVault: 'BÓVEDA Y AJUSTES',

        dockOverview: 'Visión General',
        dockMission: 'Control de Misión',
        dockEarthTwin: 'Gemelo Digital de la Tierra',
        dockComparison: 'Comparación de Imágenes',
        dockVegetation: 'Centro Espectral (ExG)',
        dockWater: 'Inteligencia Hídrica',
        dockFire: 'Área de Fuego y Quemaduras',
        dockDrought: 'Monitor de Sequía',
        dockCrops: 'Monitor Inteligente de Cultivos',
        dockDisasters: 'Mapa de Riesgo de Desastres',
        dockAnalytics: 'Analíticas y Tendencias',
        dockFiles: 'Mis Datos Terrestres',
        dockSettings: 'Ajustes y Privacidad',

        orbitOn: '🌌 Órbita: ACTIVADA',
        orbitPaused: '🌌 Órbita: PAUSADA',
        soundOn: 'Sonido: ACTIVADO',
        soundOff: 'Sonido: SILENCIADO',
        themeLight: 'Brillo',
        themeDark: 'Oscuridad',
        aiAssistantBtn: 'Asistente IA',
        voiceBtn: 'Voz',
        btnScanCamera: 'Escanear Cámara',
        btnDemoMode: 'Modo Demo',
        btnPresentation: 'Presentación',
        btnLockDevice: 'Bloquear',
        btnReplayIntro: 'Repetir Intro',

        heroTitle: 'INTELIGENCIA TERRESTRE ASTRO-NOVA',
        heroSubtitle: 'IA de teledetección del lado del cliente, telemetría satelital e inteligencia ambiental.',
        btnOpenSpectral: 'Abrir Análisis Espectral',
        btnGenerateReport: 'Generar Informe',
        btnDownload: 'Descargar',

        hubTitle: 'CENTRO DE DATOS SATELITALES',
        dropzoneText: 'Arrastre imágenes GeoTIFF de Sentinel-2 o aéreas aquí',
        dropzoneSubtext: 'o examine archivos locales (Bandas B02, B03, B04, B08)',
        btnBrowseFiles: 'Examinar Archivos',
        btnLoadDemo: 'Cargar Escena Demo',
        recentObservation: 'OBSERVACIÓN ESPECTRAL RECIENTE',
        btnRunAnalysis: 'Ejecutar Análisis en Vivo',
        metricNdvi: 'Salud de Vegetación NDVI',
        metricNdwi: 'Índice de Agua NDWI',
        metricBurn: 'Puntuación Térmica de Quemado',
        metricDrought: 'Índice de Sequedad del Suelo',
        gaugeVegetationLabel: 'Salud de Vegetación',
        gaugeWaterLabel: 'Agua Superficial',
        gaugeBurnLabel: 'Severidad de Quemado',
        gaugeMoistureLabel: 'Humedad del Suelo',

        missionControlTitle: 'Centro de Control de Misión',
        mcSubtitle: 'Telemetría simulada en tiempo real para unidades de observación orbital.',
        earthTwinTitle: 'Gemelo Digital 3D de la Tierra',
        comparisonTitle: 'Estudio de Comparación Antes y Después',
        cropMonitorTitle: 'Monitor Agrícola Inteligente de Cultivos',
        disasterMapTitle: 'Mapa de Evaluación de Riesgos',
        analyticsTitle: 'Analíticas y Tendencias Espectrales',
        vaultTitle: 'Mis Archivos de Observación',
        settingsTitle: 'Centro de Ajustes y Privacidad',
        settingLangLabel: 'Idioma / Language:',

        aiTitle: 'IA de Inteligencia Terrestre AstroNova',
        aiSubtitle: 'Asistente Multilingüe de Voz y Texto',
        aiPlaceholder: 'Pregunte sobre lluvia, sol, suelo, cosecha o satélites...',
        aiSendBtn: 'Enviar',
        aiClearBtn: 'Borrar Chat',
        aiSpeakingOn: '🔊 Voz Hablada: ACTIVADA',
        aiSpeakingOff: '🔇 Voz Hablada: DESACTIVADA'
      }
    };

    this.init();
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.bindLanguageControls();
  }

  getLocale() {
    const info = this.languages[this.currentLang];
    return info ? info.locale : 'en-US';
  }

  getLanguageInfo(code) {
    return this.languages[code] || this.languages['en'];
  }

  bindLanguageControls() {
    // 1. Settings view dropdown
    const langSelector = document.getElementById('setting-language-select');
    if (langSelector) {
      langSelector.innerHTML = Object.values(this.languages).map(l => {
        return `<option value="${l.code}">${l.flag} ${l.name} (${l.englishName})</option>`;
      }).join('');

      langSelector.value = this.currentLang;
      langSelector.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
    }

    // 2. Top navbar language picker button
    const navLangToggle = document.getElementById('btn-lang-toggle');
    if (navLangToggle) {
      navLangToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleLanguageModal();
      });
    }

    // Close language picker modal on outside click
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('astronova-lang-picker-modal');
      if (modal && modal.classList.contains('active')) {
        if (!modal.contains(e.target) && e.target !== navLangToggle && !navLangToggle.contains(e.target)) {
          modal.classList.remove('active');
        }
      }
    });
  }

  toggleLanguageModal() {
    let modal = document.getElementById('astronova-lang-picker-modal');
    if (!modal) {
      modal = this.createLanguagePickerModal();
      document.body.appendChild(modal);
    }
    modal.classList.toggle('active');
  }

  createLanguagePickerModal() {
    const modal = document.createElement('div');
    modal.id = 'astronova-lang-picker-modal';
    modal.className = 'astronova-lang-modal';

    const header = document.createElement('div');
    header.className = 'lang-modal-header';
    header.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:1.3rem;">🌐</span>
        <strong style="font-family:var(--font-hud); font-size:1rem; color:var(--cyber-cyan);">SELECT LANGUAGE / மொழியைத் தேர்ந்தெடு</strong>
      </div>
      <button class="modal-close-btn" style="padding:2px 8px;" onclick="document.getElementById('astronova-lang-picker-modal').classList.remove('active')">✕</button>
    `;
    modal.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'lang-modal-grid';

    Object.values(this.languages).forEach(l => {
      const btn = document.createElement('button');
      btn.className = `lang-picker-btn ${l.code === this.currentLang ? 'active' : ''}`;
      btn.dataset.langCode = l.code;
      btn.innerHTML = `
        <span class="lang-flag">${l.flag}</span>
        <span class="lang-native-name">${l.name}</span>
        <span class="lang-sub-name">${l.englishName}</span>
      `;
      btn.addEventListener('click', () => {
        this.setLanguage(l.code);
        modal.classList.remove('active');
      });
      grid.appendChild(btn);
    });

    modal.appendChild(grid);
    return modal;
  }

  setLanguage(langCode) {
    if (!this.languages[langCode]) {
      langCode = 'en';
    }

    this.currentLang = langCode;
    try {
      localStorage.setItem(this.storageKey, langCode);
      sessionStorage.setItem(this.storageKey, langCode);
    } catch (e) {
      console.warn('Storage write error:', e);
    }

    this.applyLanguage(langCode);

    // Sync settings select if present
    const langSelector = document.getElementById('setting-language-select');
    if (langSelector) {
      langSelector.value = langCode;
    }

    // Sync active state in welcome pills
    document.querySelectorAll('.welcome-lang-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === langCode);
    });

    // Sync active state in language modal
    document.querySelectorAll('.lang-picker-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.langCode === langCode);
    });

    // Notify other modules (AI Assistant, Speech Recognition, Sound, UI)
    window.dispatchEvent(new CustomEvent('astronovaLanguageChanged', {
      detail: {
        lang: langCode,
        locale: this.getLocale(),
        langInfo: this.languages[langCode]
      }
    }));

    if (window.AstroApp && window.AstroApp.showToast) {
      const langInfo = this.languages[langCode];
      window.AstroApp.showToast(
        `${langInfo.flag} ${langInfo.name}`,
        `Language switched to ${langInfo.englishName}. UI and AI speech updated.`,
        'info'
      );
    }
  }

  t(key) {
    const langDict = this.translations[this.currentLang] || this.translations['en'];
    return langDict[key] || this.translations['en'][key] || key;
  }

  applyLanguage(langCode) {
    const dict = this.translations[langCode] || this.translations['en'];

    // 1. Elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // 2. Placeholders with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // 3. Titles with data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      }
    });

    // 4. Update language indicator in top navbar
    const navLangText = document.getElementById('btn-lang-text');
    if (navLangText) {
      const info = this.languages[langCode];
      navLangText.textContent = `${info.flag} ${info.name}`;
    }

    // 5. Update dynamic navbar controls
    this.refreshNavbarStrings(langCode);
  }

  refreshNavbarStrings(langCode) {
    const dict = this.translations[langCode] || this.translations['en'];

    // Sound button
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      const isMuted = window.AstroSound ? window.AstroSound.isMuted : false;
      const textSpan = soundBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = isMuted ? dict.soundOff : dict.soundOn;
      }
    }

    // Theme mode button
    const themeBtn = document.getElementById('btn-theme-mode-toggle');
    if (themeBtn) {
      const isLight = document.documentElement.getAttribute('data-theme-mode') === 'light';
      const textSpan = themeBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = isLight ? dict.themeDark : dict.themeLight;
      }
    }

    // Space animation toggle
    const spaceBtn = document.getElementById('btn-space-anim-toggle');
    if (spaceBtn) {
      const isRunning = window.AstroSpaceBg ? window.AstroSpaceBg.isRunning : true;
      const textSpan = document.getElementById('btn-space-anim-text') || spaceBtn;
      textSpan.textContent = isRunning ? (dict.orbitOn || '🌌 Orbit: ON') : (dict.orbitPaused || '🌌 Orbit: PAUSED');
    }

    // Network status badge
    const badge = document.getElementById('network-status-badge');
    if (badge) {
      const labelSpan = badge.querySelector('span:last-child');
      if (labelSpan) {
        labelSpan.textContent = dict.statusLocalActive;
      }
    }

    // AI Assistant button text
    const aiBtn = document.getElementById('btn-ai-assistant-toggle');
    if (aiBtn) {
      const textSpan = aiBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = dict.aiAssistantBtn;
      }
    }

    // Voice button text
    const voiceBtn = document.getElementById('btn-voice-toggle');
    if (voiceBtn) {
      const textSpan = voiceBtn.querySelector('.btn-text');
      if (textSpan) {
        textSpan.textContent = dict.voiceBtn;
      }
    }
  }
}

window.I18nManager = I18nManager;
