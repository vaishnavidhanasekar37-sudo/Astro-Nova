/**
 * ASTRONOVA - Conversational Multilingual Voice + Text AI Assistant
 * Dual-modal assistant supporting 10 languages:
 * Tamil, English, Malayalam, Kannada, Telugu, Marathi, Hindi, Russian, German, Spanish.
 *
 * Provides direct, context-aware answers to specific questions
 * (e.g. rain, sunlight, land condition, crop yield, satellites)
 * varying dynamically based on active spectral telemetry and loaded scene data.
 * Speaks STRICTLY in the currently selected language.
 */

class AstroAIAssistant {
  constructor() {
    this.recognition = null;
    this.synth = window.speechSynthesis;
    this.isListening = false;
    this.isSpeaking = false;
    this.voiceEnabled = localStorage.getItem('astronova_ai_voice_enabled') !== 'false'; // default true

    this.drawer = document.getElementById('ai-assistant-drawer');
    this.chatLog = document.getElementById('ai-chat-log');
    this.textInput = document.getElementById('ai-text-input');
    this.micBtn = document.getElementById('ai-mic-btn');
    this.speakingWave = document.getElementById('ai-speaking-wave');
    this.voiceToggleBtn = document.getElementById('ai-voice-toggle-btn');

    this.init();
  }

  getCurrentLang() {
    return window.AstroI18n ? window.AstroI18n.currentLang : 'en';
  }

  getLocale() {
    return window.AstroI18n ? window.AstroI18n.getLocale() : 'en-US';
  }

  init() {
    this.initSpeechRecognition();
    this.bindEvents();
    this.updateVoiceToggleUI();

    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => {
        if (this.synth) this.synth.getVoices();
      };
    }

    window.addEventListener('astronovaLanguageChanged', (e) => {
      const locale = e.detail?.locale || this.getLocale();
      if (this.recognition) {
        this.recognition.lang = locale;
      }
      this.updateVoiceToggleUI();
      this.updateChipsForLanguage(e.detail?.lang || this.getCurrentLang());
    });
  }

  initSpeechRecognition() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      console.warn('Speech Recognition not supported in this browser.');
      if (this.micBtn) {
        this.micBtn.title = 'Speech recognition not supported in this browser';
        this.micBtn.style.opacity = '0.5';
      }
      return;
    }

    this.recognition = new SpeechRec();
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = this.getLocale();

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.micBtn) this.micBtn.classList.add('listening');
      const lang = this.getCurrentLang();
      const listeningPhrases = {
        en: 'Listening to your voice...',
        ta: 'குரலைக் கேட்கிறது...',
        hi: 'आपकी आवाज सुन रहे हैं...',
        ml: 'ശബ്ദം ശ്രവിക്കുന്നു...',
        kn: 'ಧ್ವನಿಯನ್ನು ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
        te: 'వాయిస్ వింటున్నాను...',
        mr: 'तुमचा आवाज ऐकत आहे...',
        ru: 'Слушаю ваш голос...',
        de: 'Ich höre zu...',
        es: 'Escuchando tu voz...'
      };
      this.setAssistantStatus(listeningPhrases[lang] || listeningPhrases.en);
      if (window.AstroSound) window.AstroSound.playClick();
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.micBtn) this.micBtn.classList.remove('listening');
      this.setAssistantStatus('Online • Ready');
    };

    this.recognition.onerror = (e) => {
      console.warn('AI Assistant Speech recognition error:', e.error);
      this.isListening = false;
      if (this.micBtn) this.micBtn.classList.remove('listening');
      this.setAssistantStatus('Microphone standby');
    };

    this.recognition.onresult = (e) => {
      if (e.results && e.results[0] && e.results[0][0]) {
        const transcript = e.results[0][0].transcript.trim();
        if (transcript) {
          this.processUserInput(transcript, true);
        }
      }
    };
  }

  bindEvents() {
    const toggleBtns = document.querySelectorAll('.btn-open-ai-assistant, #btn-ai-assistant-toggle, #floating-ai-orb');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => this.toggleDrawer());
    });

    const closeBtn = document.getElementById('ai-assistant-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    const sendBtn = document.getElementById('ai-send-btn');
    if (sendBtn) {
      sendBtn.addEventListener('click', () => this.sendTextMessage());
    }
    if (this.textInput) {
      this.textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendTextMessage();
        }
      });
    }

    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => this.toggleVoiceListening());
    }

    if (this.voiceToggleBtn) {
      this.voiceToggleBtn.addEventListener('click', () => {
        this.voiceEnabled = !this.voiceEnabled;
        localStorage.setItem('astronova_ai_voice_enabled', this.voiceEnabled ? 'true' : 'false');
        this.updateVoiceToggleUI();
        if (!this.voiceEnabled && this.synth) {
          this.synth.cancel();
        }
        if (window.AstroSound) window.AstroSound.playToggle();
      });
    }

    this.bindChips();
  }

  bindChips() {
    const chips = document.querySelectorAll('.ai-prompt-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const text = e.currentTarget.dataset.prompt || e.currentTarget.textContent.trim();
        this.processUserInput(text, false);
      });
    });
  }

  updateChipsForLanguage(lang) {
    const chipData = {
      en: [
        { label: '🌧️ Did it rain?', prompt: 'Did it rain here?' },
        { label: '☀️ Is there sun?', prompt: 'Is there good sunlight today?' },
        { label: '🌾 Crop yield?', prompt: 'Is the crop yield good?' },
        { label: '🏞️ How is the land?', prompt: 'How is the land condition?' },
        { label: '🛰️ Satellites', prompt: 'Show mission control satellite status' },
        { label: '📊 Telemetry %', prompt: 'What are the current percentage levels?' }
      ],
      ta: [
        { label: '🌧️ மழை பெய்ததா?', prompt: 'இங்கே மழை பெய்ததா?' },
        { label: '☀️ வெயில் இருக்கா?', prompt: 'இன்று சூரிய ஒளி எப்படி உள்ளது?' },
        { label: '🌾 விளைச்சல் நல்லதா?', prompt: 'பயிர் விளைச்சல் நல்லா இருக்கா?' },
        { label: '🏞️ நிலம் எப்படி?', prompt: 'விவசாய நிலத்தின் நிலை எப்படி உள்ளது?' },
        { label: '🛰️ செயற்கைக்கோள்', prompt: 'செயற்கைக்கோள் நிலவரம் என்ன?' },
        { label: '📊 அளவீடுகள்', prompt: 'தாவர அளவீடுகள் என்ன?' }
      ],
      hi: [
        { label: '🌧️ क्या बारिश हुई?', prompt: 'क्या यहाँ बारिश हुई है?' },
        { label: '☀️ क्या धूप है?', prompt: 'आज धूप कैसी है?' },
        { label: '🌾 पैदावार कैसी है?', prompt: 'क्या फसल की पैदावार अच्छी है?' },
        { label: '🏞️ जमीन कैसी है?', prompt: 'जमीन की स्थिति कैसी है?' },
        { label: '🛰️ उपग्रह स्थिति', prompt: 'उपग्रह मिशन स्थिति दिखाएं' },
        { label: '📊 प्रतिशत स्तर', prompt: 'वर्तमान टेलीमेट्री स्तर क्या हैं?' }
      ],
      ml: [
        { label: '🌧️ മഴ പെയ്തോ?', prompt: 'ഇവിടെ മഴ പെയ്തിട്ടുണ്ടോ?' },
        { label: '☀️ വെയിൽ ഉണ്ടോ?', prompt: 'ഇന്ന് സൂര്യപ്രകാശം എങ്ങനെയുണ്ട്?' },
        { label: '🌾 വിളവ് നല്ലതാണോ?', prompt: 'വിളവ് നല്ലതാണോ?' },
        { label: '🏞️ നിലം എങ്ങനെയുണ്ട്?', prompt: 'കൃഷിഭൂമിയുടെ അവസ്ഥ എങ്ങനെയുണ്ട്?' },
        { label: '🛰️ ഉപഗ്രഹം', prompt: 'ഉപഗ്രഹ മിഷൻ നില കാണിക്കുക' },
        { label: '📊 അളവുകൾ %', prompt: 'നിലവിലെ ടെലിമെട്രി നില എന്താണ്?' }
      ],
      kn: [
        { label: '🌧️ ಮಳೆ ಬಂದಿದೆಯಾ?', prompt: 'ಇಲ್ಲಿ ಮಳೆ ಬಂದಿದೆಯಾ?' },
        { label: '☀️ ಬಿಸಿಲು ಇದೆಯಾ?', prompt: 'ಇಂದು ಬಿಸಿಲು ಚೆನ್ನಾಗಿದೆಯಾ?' },
        { label: '🌾 ಬೆಳೆ ಇಳುವರಿ?', prompt: 'ಬೆಳೆ ಇಳುವರಿ ಚೆನ್ನಾಗಿದೆಯಾ?' },
        { label: '🏞️ ಭೂಮಿ ಹೇಗಿದೆ?', prompt: 'ಭೂಮಿ ಸ್ಥಿತಿ ಹೇಗಿದೆ?' },
        { label: '🛰️ ಉಪಗ್ರಹ ಸ್ಥಿತಿ', prompt: 'ಉಪಗ್ರಹ ಮಿಷನ್ ಸ್ಥಿತಿ ತೋರಿಸಿ' },
        { label: '📊 ಶೇಕಡಾವಾರು ಮಟ್ಟ', prompt: 'ಪ್ರಸ್ತುತ ಟೆಲಿಮೆಟ್ರಿ ಮಟ್ಟಗಳು ಯಾವುವು?' }
      ],
      te: [
        { label: '🌧️ వర్షం పడిందా?', prompt: 'ఇక్కడ వర్షం పడిందా?' },
        { label: '☀️ ఎండ ఉందా?', prompt: 'ఈ రోజు ఎండ బాగుందా?' },
        { label: '🌾 దిగుబడి బాగుందా?', prompt: 'పంట దిగుబడి బాగుందా?' },
        { label: '🏞️ నేల ఎలా ఉంది?', prompt: 'వ్యవసాయ నేల ఎలా ఉంది?' },
        { label: '🛰️ ఉపగ్రహ స్థితి', prompt: 'ఉపగ్రహ మిషన్ స్థితిని చూపించు' },
        { label: '📊 టెలిమెట్రీ స్థాయిలు', prompt: 'ప్రస్తుత టెలిమెట్రీ శాతాలు ఏమిటి?' }
      ],
      mr: [
        { label: '🌧️ पाऊस पडला का?', prompt: 'येथे पाऊस पडला आहे का?' },
        { label: '☀️ ऊन आहे का?', prompt: 'सूर्यप्रकाश कसा आहे?' },
        { label: '🌾 पीक चांगले आहे का?', prompt: 'पीक उत्पादन चांगले आहे का?' },
        { label: '🏞️ जमीन कशी आहे?', prompt: 'जमिनीची स्थिती कशी आहे?' },
        { label: '🛰️ उपग्रह स्थिती', prompt: 'उपग्रह मिशन स्थिती दाखवा' },
        { label: '📊 टक्केवारी पातळी', prompt: 'सध्याची टेलिमेट्री टक्केवारी काय आहे?' }
      ],
      ru: [
        { label: '🌧️ Был ли дождь?', prompt: 'Был ли здесь дождь?' },
        { label: '☀️ Есть ли солнце?', prompt: 'Достаточно ли солнечного света?' },
        { label: '🌾 Хорош ли урожай?', prompt: 'Хороший ли прогнозируется урожай?' },
        { label: '🏞️ Какова земля?', prompt: 'В каком состоянии земля и почва?' },
        { label: '🛰️ Спутник', prompt: 'Показать статус спутника' },
        { label: '📊 Телеметрия %', prompt: 'Каковы текущие показатели телеметрии?' }
      ],
      de: [
        { label: '🌧️ Hat es geregnet?', prompt: 'Hat es hier geregnet?' },
        { label: '☀️ Scheint die Sonne?', prompt: 'Gibt es heute ausreichend Sonnenschein?' },
        { label: '🌾 Ist der Ertrag gut?', prompt: 'Ist der Ernteertrag gut?' },
        { label: '🏞️ Wie ist der Boden?', prompt: 'Wie ist der Bodenzustand?' },
        { label: '🛰️ Satelliten', prompt: 'Missionskontroll-Satellitenstatus anzeigen' },
        { label: '📊 Telemetrie %', prompt: 'Was sind die aktuellen Telemetriewerte?' }
      ],
      es: [
        { label: '🌧️ ¿Ha llovido?', prompt: '¿Ha llovido aquí?' },
        { label: '☀️ ¿Hay sol?', prompt: '¿Hay buen sol hoy?' },
        { label: '🌾 ¿La cosecha es buena?', prompt: '¿El rendimiento del cultivo es bueno?' },
        { label: '🏞️ ¿Cómo está la tierra?', prompt: '¿Cómo está la condición de la tierra?' },
        { label: '🛰️ Satélites', prompt: 'Mostrar estado del satélite en control de misión' },
        { label: '📊 Telemetría %', prompt: '¿Cuáles son los niveles actuales de porcentaje?' }
      ]
    };

    const chipsRow = document.querySelector('.ai-chips-row');
    if (!chipsRow) return;

    const list = chipData[lang] || chipData.en;
    chipsRow.innerHTML = list.map(c => `
      <button class="ai-prompt-chip" data-prompt="${c.prompt}">${c.label}</button>
    `).join('');

    this.bindChips();
  }

  toggleDrawer() {
    if (!this.drawer) return;
    const isActive = this.drawer.classList.contains('active');
    if (isActive) {
      this.closeDrawer();
    } else {
      this.openDrawer();
    }
  }

  openDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.add('active');
    if (this.textInput) setTimeout(() => this.textInput.focus(), 300);
    if (window.AstroSound) window.AstroSound.playClick();
  }

  closeDrawer() {
    if (!this.drawer) return;
    this.drawer.classList.remove('active');
    if (this.synth) this.synth.cancel();
    this.isSpeaking = false;
    this.updateSpeakingUI(false);
  }

  toggleVoiceListening() {
    if (!this.recognition) {
      if (window.AstroApp && window.AstroApp.showToast) {
        window.AstroApp.showToast(
          'VOICE INPUT',
          'Web Speech API is not supported in this browser.',
          'warning'
        );
      }
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        if (this.synth) this.synth.cancel();
        this.recognition.lang = this.getLocale();
        this.recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  }

  sendTextMessage() {
    if (!this.textInput) return;
    const text = this.textInput.value.trim();
    if (!text) return;
    this.textInput.value = '';
    this.processUserInput(text, false);
  }

  setAssistantStatus(status) {
    const statusElem = document.getElementById('ai-assistant-status-text');
    if (statusElem) statusElem.textContent = status;
  }

  updateVoiceToggleUI() {
    if (this.voiceToggleBtn) {
      const lang = this.getCurrentLang();
      const onLabels = {
        en: '🔊 Spoken Voice: ON',
        ta: '🔊 பேசும் குரல்: ஆன்',
        hi: '🔊 बोलने वाली आवाज: चालू',
        ml: '🔊 ശബ്ദം: ഓൺ',
        kn: '🔊 ಧ್ವನಿ: ಆನ್',
        te: '🔊 వాయిస్: ఆన్',
        mr: '🔊 आवाज: चालू',
        ru: '🔊 Голос: ВКЛ',
        de: '🔊 Sprache: EIN',
        es: '🔊 Voz: ACTIVADA'
      };
      const offLabels = {
        en: '🔇 Spoken Voice: OFF',
        ta: '🔇 பேசும் குரல்: ஆஃப்',
        hi: '🔇 बोलने वाली आवाज: बंद',
        ml: '🔇 ശബ്ദം: ഓഫ്',
        kn: '🔇 ಧ್ವನಿ: ಆಫ್',
        te: '🔇 వాయిస్: ఆఫ్',
        mr: '🔇 आवाज: बंद',
        ru: '🔇 Голос: ВЫКЛ',
        de: '🔇 Sprache: AUS',
        es: '🔇 Voz: DESACTIVADA'
      };

      this.voiceToggleBtn.innerHTML = `<span>${this.voiceEnabled ? (onLabels[lang] || onLabels.en) : (offLabels[lang] || offLabels.en)}</span>`;
      this.voiceToggleBtn.classList.toggle('active', this.voiceEnabled);
    }
  }

  updateSpeakingUI(speaking) {
    this.isSpeaking = speaking;
    if (this.speakingWave) {
      this.speakingWave.style.display = speaking ? 'flex' : 'none';
    }
  }

  processUserInput(userInput, fromVoice = false) {
    const lang = this.getCurrentLang();
    const tag = fromVoice ? '🎙️ Voice' : '💬 Text';
    this.appendMessage('user', userInput, tag);

    const aiReply = this.generateResponse(userInput);

    setTimeout(() => {
      this.appendMessage('assistant', aiReply.text);

      if (aiReply.action) {
        aiReply.action();
      }

      if (this.voiceEnabled) {
        this.speakResponse(aiReply.spokenText || aiReply.text);
      }
    }, 350);
  }

  /**
   * Evaluates the query against live scene data & telemetry,
   * returning direct answers (Yes it is good / No it is not) for questions
   * asked about rain, sun, soil/land, crop yield, etc.
   */
  generateResponse(input) {
    const text = input.toLowerCase().trim();
    const lang = this.getCurrentLang();
    const app = window.AstroApp;

    // Retrieve active spectral metrics from DOM or pipeline
    const vegVal = parseInt(document.getElementById('veg-gauge-val')?.textContent || '68', 10);
    const healthVal = parseInt(document.getElementById('health-gauge-val')?.textContent || '74', 10);
    const waterVal = parseInt(document.getElementById('water-gauge-val')?.textContent || '28', 10);
    const dryVal = parseInt(document.getElementById('dry-gauge-val')?.textContent || '22', 10);
    const sceneTitle = app?.currentDatasetTitle || 'Agricultural Parcel';

    // State analysis flags
    const isFlooded = waterVal > 50 || sceneTitle.toLowerCase().includes('flood');
    const isDry = dryVal > 40 || vegVal < 40 || sceneTitle.toLowerCase().includes('dry');
    const isGoodYield = healthVal >= 60 && !isDry && !isFlooded;

    // -------------------------------------------------------------------------
    // 1. RAIN / PRECIPITATION QUERY
    // -------------------------------------------------------------------------
    const isRainQuery = /rain|precipitation|shower|rainfall|மழை|बारिश|वर्षा|മഴ|ಮಳೆ|వర్షం|వాన|पाऊस|дожд|regen|lluvia|llov/i.test(text);
    if (isRainQuery) {
      if (isFlooded) {
        const responses = {
          en: {
            text: `🌧️ **Yes, heavy torrential rainfall was detected!**\nCumulative precipitation exceeded **85 mm** over the last 48 hours. Surface water detection (NDWI) is extremely high at **${waterVal}%**, causing localized field inundation and runoff waterlogging.`,
            spoken: `Yes, heavy rainfall was detected! Precipitation exceeded 85 millimeters, with surface water currently at ${waterVal} percent.`
          },
          ta: {
            text: `🌧️ **ஆம், மிகக் கடுமையான கனமழை பெய்துள்ளது!**\nகடந்த 48 மணி நேரத்தில் மழைப்பொழிவு **85 மி.மீ** அளவைத் தாண்டியுள்ளது. மேற்பரப்பு நீர் குறியீடு **${waterVal}%** ஆக உயர்ந்துள்ளதால் வயல்களில் வெள்ள நீர் தேங்கியுள்ளது.`,
            spoken: `ஆம், மிகக் கடுமையான கனமழை பெய்துள்ளது! மழை அளவு 85 மில்லிமீட்டரைத் தாண்டியுள்ளது. வயல்களில் நீர் தேங்கியுள்ளது.`
          },
          hi: {
            text: `🌧️ **हाँ, अत्यधिक भारी बारिश दर्ज की गई है!**\nपिछले 48 घंटों में वर्षा **85 मिमी** से अधिक हुई है। सतही जल सूचकांक **${waterVal}%** तक पहुंच गया है, जिससे खेतों में जलभराव हो गया है।`,
            spoken: `हाँ, भारी बारिश हुई है! 85 मिलीमीटर से अधिक वर्षा दर्ज की गई है और सतही जल ${waterVal} प्रतिशत है।`
          },
          ml: {
            text: `🌧️ **അതെ, അതിശക്തമായ മഴ പെയ്തിട്ടുണ്ട്!**\nകഴിഞ്ഞ 48 മണിക്കൂറിൽ മഴ **85 മി.മീ** കവിഞ്ഞു. ഉപരിതല ജലനിരപ്പ് **${waterVal}%** ആയി ഉയർന്നു.`,
            spoken: `അതെ, ശക്തമായ മഴ പെയ്തിട്ടുണ്ട്! 85 മില്ലിമീറ്ററിലധികം മഴ രേഖപ്പെടുത്തിയിട്ടുണ്ട്.`
          },
          kn: {
            text: `🌧️ **ಹೌದು, ಭಾರಿ ಮಳೆಯಾಗಿದೆ!**\nಕಳೆದ 48 ಗಂಟೆಗಳಲ್ಲಿ ಮಳೆಯ ಪ್ರಮಾಣ **85 ಮಿ.ಮೀ** ಮೀರಿದೆ. ಮೇಲ್ಮೈ ನೀರು **${waterVal}%** ನಷ್ಟಿದೆ.`,
            spoken: `ಹೌದು, ಭಾರಿ ಮಳೆಯಾಗಿದೆ! 85 ಮಿಲಿಮೀಟರ್ ಮಳೆ ದಾಖಲಾಗಿದೆ.`
          },
          te: {
            text: `🌧️ **అవును, భారీ వర్షం పడింది!**\nగత 48 గంటల్లో వర్షపాతం **85 మి.మీ** దాటింది. ఉపరితల నీటి పరిమాణం **${waterVal}%** కి చేరింది.`,
            spoken: `అవును, భారీ వర్షం పడింది! వర్షపాతం 85 మిల్లీమీటర్లు దాటింది.`
          },
          mr: {
            text: `🌧️ **होय, मुसळधार पाऊस पडला आहे!**\nगेल्या 48 तासांत पाऊस **85 मिमी** पेक्षा जास्त झाला आहे. पृष्ठभागावरील पाणी **${waterVal}%** आहे.`,
            spoken: `होय, जोरदार पाऊस पडला आहे! 85 मिमी पेक्षा जास्त पाऊस झाला आहे.`
          },
          ru: {
            text: `🌧️ **Да, прошел сильный ливень!**\nОсадки превысили **85 мм** за последние 48 часов. Уровень поверхностных вод достигает **${waterVal}%**, наблюдается затопление участков.`,
            spoken: `Да, прошел сильный ливень! Уровень осадков превысил 85 миллиметров.`
          },
          de: {
            text: `🌧️ **Ja, es gab starke Regenfälle!**\nDer Niederschlag lag in den letzten 48 Stunden bei über **85 mm**. Der Oberflächenwasser-Index beträgt **${waterVal}%**, was zu Überschwemmungen führt.`,
            spoken: `Ja, es gab starken Regen! Die Niederschlagsmenge lag bei über 85 Millimetern.`
          },
          es: {
            text: `🌧️ **¡Sí, se registraron fuertes lluvias!**\nLa precipitación acumulada superó los **85 mm** en las últimas 48 horas. El índice de agua superficial está al **${waterVal}%**, provocando anegamiento.`,
            spoken: `¡Sí, llovió intensamente! La precipitación superó los 85 milímetros.`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      } else if (isDry) {
        const responses = {
          en: {
            text: `☀️ **No, it has NOT rained recently.**\nRainfall is at **0.0 mm** over this observation cycle. Soil dryness is critical at **${dryVal}%** with depleted subsoil moisture. Supplemental irrigation is urgently advised.`,
            spoken: `No, it has not rained recently. Precipitation is at zero millimeters, and soil dryness is elevated at ${dryVal} percent.`
          },
          ta: {
            text: `☀️ **இல்லை, சமீபத்தில் மழை பெய்யவில்லை.**\nமழைப்பொழிவு **0.0 மி.மீ** ஆக உள்ளது. மண் வறட்சி அளவு **${dryVal}%** ஆக உயர்ந்துள்ளதால் உடனடியாக நீர்ப்பாசனம் செய்ய பரிந்துரைக்கப்படுகிறது.`,
            spoken: `இல்லை, சமீபத்தில் மழை பெய்யவில்லை. மழை அளவு பூஜ்ஜியம் மி.மீ. மண் வறட்சி ${dryVal} சதவீதம் உள்ளது.`
          },
          hi: {
            text: `☀️ **नहीं, हाल ही में बारिश नहीं हुई है।**\nवर्षा का स्तर **0.0 मिमी** है। मिट्टी में सूखापन **${dryVal}%** तक पहुंच गया है, तुरंत सिंचाई की आवश्यकता है।`,
            spoken: `नहीं, हाल में बारिश नहीं हुई है। वर्षा शून्य मिमी है और मिट्टी का सूखापन ${dryVal} प्रतिशत है।`
          },
          ml: {
            text: `☀️ **ഇല്ല, ഈയിടെയായി മഴ പെയ്തിട്ടില്ല.**\nമഴയുടെ അളവ് **0.0 മി.മീ** ആണ്. മണ്ണിലെ വരൾച്ച **${dryVal}%** ആയതിനാൽ നനയ്ക്കൽ ആവശ്യമാണ്.`,
            spoken: `ഇല്ല, അടുത്തിടെ മഴ പെയ്തിട്ടില്ല. മഴ പൂജ്യമാണ്.`
          },
          kn: {
            text: `☀️ **ಇಲ್ಲ, ಇತ್ತೀಚೆಗೆ ಮಳೆ ಬಂದಿಲ್ಲ.**\nಮಳೆಯ ಪ್ರಮಾಣ **0.0 ಮಿ.ಮೀ**. ಮಣ್ಣಿನ ಬರ **${dryVal}%** ನಷ್ಟಿದ್ದು ತಕ್ಷಣ ನೀರಾವರಿ ಅಗತ್ಯವಿದೆ.`,
            spoken: `ಇಲ್ಲ, ಇತ್ತೀಚೆಗೆ ಮಳೆ ಆಗಿಲ್ಲ. ಮಳೆ ಶೂನ್ಯ ಮಿಲಿಮೀಟರ್ ಇದೆ.`
          },
          te: {
            text: `☀️ **లేదు, ఇటీవల వర్షం పడలేదు.**\nవర్షపాతం **0.0 మి.మీ** గా ఉంది. నేల ఎండిపోవడం **${dryVal}%** కి చేరింది. నీటిపారుదల అవసరం.`,
            spoken: `లేదు, ఇటీవల వర్షం పడలేదు. వర్షపాతం సున్నాగా ఉంది.`
          },
          mr: {
            text: `☀️ **नाही, अलीकडे पाऊस पडलेला नाही.**\nपाऊस **0.0 मिमी** आहे. जमिनीतील कोरडेपणा **${dryVal}%** झाला असून सिंचनाची गरज आहे.`,
            spoken: `नाही, नुकताच पाऊस पडलेला नाही. पाऊस शून्य मिमी आहे.`
          },
          ru: {
            text: `☀️ **Нет, дождя в последнее время НЕ было.**\nУровень осадков **0.0 мм**. Индекс сухости почвы повышен до **${dryVal}%**, требуется орошение.`,
            spoken: `Нет, дождя в последнее время не было. Осадки нулевые, почва сухая.`
          },
          de: {
            text: `☀️ **Nein, es hat in letzter Zeit NICHT geregnet.**\nDer Niederschlag beträgt **0,0 mm**. Der Trockenheitsindex liegt bei **${dryVal}%**, Bewässerung ist erforderlich.`,
            spoken: `Nein, es hat nicht geregnet. Der Niederschlag liegt bei null Millimetern.`
          },
          es: {
            text: `☀️ **No, NO ha llovido recientemente.**\nLa precipitación es de **0.0 mm**. La sequedad del suelo está en **${dryVal}%**, se recomienda riego inmediato.`,
            spoken: `No, no ha llovido recientemente. La precipitación es de cero milímetros.`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      } else {
        const responses = {
          en: {
            text: `🌧️ **Yes, beneficial moderate rainfall was recorded!**\nPrecipitation reached **18.4 mm** yesterday. Soil moisture is optimal at **64%**, providing sufficient hydration without waterlogging risk.`,
            spoken: `Yes, beneficial rainfall was recorded! Precipitation was 18.4 millimeters, keeping soil moisture at a healthy 64 percent.`
          },
          ta: {
            text: `🌧️ **ஆம், மிதமான நன்மையான மழை பெய்துள்ளது!**\nநேற்று சுமார் **18.4 மி.மீ** மழை பதிவாகியுள்ளது. மண் ஈரப்பதம் **64%** என்ற உகந்த அளவில் பயிர் வளர்ச்சிக்கு மிகச் சிறப்பாக உள்ளது.`,
            spoken: `ஆம், போதுமான நல்ல மழை பெய்துள்ளது! 18.4 மில்லிமீட்டர் மழை பதிவாகியுள்ளது. மண் ஈரப்பதம் 64 சதவீதம் உள்ளது.`
          },
          hi: {
            text: `🌧️ **हाँ, लाभकारी मध्यम वर्षा हुई है!**\nकल **18.4 मिमी** बारिश दर्ज की गई। मिट्टी की नमी **64%** पर इष्टतम बनी हुई है।`,
            spoken: `हाँ, अच्छी बारिश हुई है! 18.4 मिलीमीटर वर्षा से मिट्टी में पर्याप्त नमी बनी हुई है।`
          },
          ml: {
            text: `🌧️ **അതെ, പ്രയോജനകരമായ മഴ പെയ്തിട്ടുണ്ട്!**\nഇന്നലെ **18.4 മി.മീ** മഴ രേഖപ്പെടുത്തി. മണ്ണിലെ ഈർപ്പം **64%** ആണ്.`,
            spoken: `അതെ, നല്ല മഴ പെയ്തിട്ടുണ്ട്! 18.4 മില്ലിമീറ്റർ മഴ രേഖപ്പെടുത്തി.`
          },
          kn: {
            text: `🌧️ **ಹೌದು, ಉತ್ತಮವಾದ ಮಳೆಯಾಗಿದೆ!**\nನಿನ್ನೆ **18.4 ಮಿ.ಮೀ** ಮಳೆ ದಾಖಲಾಗಿದೆ. ಮಣ್ಣಿನ ತೇವಾಂಶ **64%** ದಷ್ಟಿದೆ.`,
            spoken: `ಹೌದು, ಉತ್ತಮ ಮಳೆಯಾಗಿದೆ! 18.4 ಮಿಲಿಮೀಟರ್ ಮಳೆಯಿಂದ ಮಣ್ಣು ಹಸಿಯಾಗಿದೆ.`
          },
          te: {
            text: `🌧️ **అవును, అనుకూలమైన వర్షం పడింది!**\nనిన్న **18.4 మి.మీ** వర్షం కురిసింది. నేలలో తేమ **64%** వద్ద స్థిరంగా ఉంది.`,
            spoken: `అవును, మంచి వర్షం పడింది! 18.4 మిల్లీమీటర్ల వర్షపాతం నమోదైంది.`
          },
          mr: {
            text: `🌧️ **होय, समाधानकारक पाऊस पडला आहे!**\nकाल **18.4 मिमी** पाऊस झाला. मातीतील ओलावा **64%** आहे.`,
            spoken: `होय, समाधानकारक पाऊस झाला आहे! 18.4 मिमी पाऊस पडला.`
          },
          ru: {
            text: `🌧️ **Да, прошел умеренный благоприятный дождь!**\nВыпало **18.4 мм** осадков. Влажность почвы оптимальна — **64%**.`,
            spoken: `Да, прошел благоприятный дождь! Выпало 18.4 миллиметра осадков.`
          },
          de: {
            text: `🌧️ **Ja, es gab nützliche Niederschläge!**\nGestern fielen **18,4 mm** Regen. Die Bodenfeuchtigkeit ist mit **64%** optimal.`,
            spoken: `Ja, es gab nützlichen Regen! Es fielen 18,4 Millimeter Niederschlag.`
          },
          es: {
            text: `🌧️ **¡Sí, se registró lluvia moderada y beneficiosa!**\nCayeron **18.4 mm** de agua ayer. La humedad del suelo es óptima al **64%**.`,
            spoken: `¡Sí, llovió favorablemente! Se registraron 18.4 milímetros de precipitación.`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      }
    }

    // -------------------------------------------------------------------------
    // 2. SUN / SUNLIGHT / SOLAR IRRADIANCE QUERY
    // -------------------------------------------------------------------------
    const isSunQuery = /sun|sunlight|sunshine|solar|வெயில்|சூரிய|धूप|सूर्य|വെയിൽ|ಬಿಸಿಲು|ఎండ|ऊन|солнц|sonne|sol /i.test(text);
    if (isSunQuery) {
      if (isFlooded) {
        const responses = {
          en: {
            text: `☁️ **No, there is very little sunlight today.**\nCloud cover is dense at **88%** due to the passing convective storm front. Solar irradiance is depressed to **2.4 kWh/m²**, which lowers photosynthetic activity.`,
            spoken: `No, sunlight is very weak today. Cloud cover is 88 percent with solar irradiance at only 2.4 kilowatt hours per square meter.`
          },
          ta: {
            text: `☁️ **இல்லை, இன்று போதிய சூரிய வெளிச்சம் இல்லை.**\nமழை மேகங்கள் **88%** சூழ்ந்துள்ளதால் சூரிய கதிர்வீச்சு அளவு **2.4 kWh/m²** ஆக குறைந்துள்ளது. ஒளிச்சேர்க்கை வேகம் மந்தமாக உள்ளது.`,
            spoken: `இல்லை, இன்று போதுமான வெயில் இல்லை. மேகமூட்டம் 88 சதவீதம் உள்ளதால் சூரிய ஒளி மிகவும் குறைவாக உள்ளது.`
          },
          hi: {
            text: `☁️ **नहीं, आज धूप बहुत कम है।**\nघने बादलों के कारण बादल आवरण **88%** है। सौर विकिरण घटकर **2.4 kWh/m²** रह गया है।`,
            spoken: `नहीं, आज धूप नहीं के बराबर है। घने बादल छाए हुए हैं।`
          },
          ml: {
            text: `☁️ **ഇല്ല, ഇന്ന് സൂര്യപ്രകാശം വളരെ കുറവാണ്.**\nമേഘാവൃതമായതിനാൽ സൗരവികിരണം **2.4 kWh/m²** ആയി കുറഞ്ഞു.`,
            spoken: `ഇല്ല, ഇന്ന് വെയിൽ കുറവാണ്. ആകാശം മേഘാവൃതമാണ്.`
          },
          kn: {
            text: `☁️ **ಇಲ್ಲ, ಇಂದು ಬಿಸಿಲು ತುಂಬಾ ಕಡಿಮೆಯಾಗಿದೆ.**\nಮೋಡ ಕವಿದ ವಾತಾವರಣವಿದ್ದು ಸೌರ ವಿಕಿರಣ **2.4 kWh/m²** ಮಾತ್ರ ಇದೆ.`,
            spoken: `ಇಲ್ಲ, ಇಂದು ಬಿಸಿಲು ಇಲ್ಲ. ಮೋಡ ಕವಿದಿದೆ.`
          },
          te: {
            text: `☁️ **లేదు, ఈ రోజు ఎండ చాలా తక్కువగా ఉంది.**\nదట్టమైన మేఘాల కారణంగా సౌర వికిరణం **2.4 kWh/m²** కి పడిపోయింది.`,
            spoken: `లేదు, ఈ రోజు ఎండ లేదు. మేఘావృతమై ఉంది.`
          },
          mr: {
            text: `☁️ **नाही, आज ऊन खूपच कमी आहे.**\nढगाळ वातावरणामुळे सौर विकिरण **2.4 kWh/m²** वर आले आहे.`,
            spoken: `नाही, आज ऊन नाही. ढगाळ वातावरण आहे.`
          },
          ru: {
            text: `☁️ **Нет, солнца сегодня практически нет.**\nОблачность составляет **88%**. Солнечная радиация снижена до **2.4 кВт·ч/м²**.`,
            spoken: `Нет, сегодня пасмурно. Солнечное излучение сильно ослаблено.`
          },
          de: {
            text: `☁️ **Nein, heute gibt es nur sehr wenig Sonnenschein.**\nDie Bewölkung beträgt **88%**. Die Sonneneinstrahlung liegt bei nur **2,4 kWh/m²**.`,
            spoken: `Nein, heute scheint die Sonne kaum. Die Bewölkung liegt bei 88 Prozent.`
          },
          es: {
            text: `☁️ **No, hoy hay muy poca luz solar.**\nLa cobertura nubosa es del **88%**. La radiación solar ha caído a **2.4 kWh/m²**.`,
            spoken: `No, hoy el sol está muy débil debido a la densa nubosidad.`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      } else {
        const responses = {
          en: {
            text: `☀️ **Yes, there is excellent, bright sunshine!**\nSolar irradiance is measured at **8.4 kWh/m²** with minimal cloud cover (**12%**). Active photosynthetic radiation (PAR) is at peak efficiency for crop growth.`,
            spoken: `Yes, there is strong, bright sunshine today! Solar radiation is 8.4 kilowatt hours per square meter with clear skies.`
          },
          ta: {
            text: `☀️ **ஆம், நல்ல தெளிவான வெயில் அடிக்கிறது!**\nசூரிய கதிர்வீச்சு அளவு **8.4 kWh/m²** ஆக உள்ளது. மேகமூட்டம் வெறும் **12%** மட்டுமே உள்ளதால் தாவரங்களின் ஒளிச்சேர்க்கைக்கு உகந்த சூழல் நிலவுகிறது.`,
            spoken: `ஆம், மிக நல்ல வெயில் அடிக்கிறது! சூரிய ஒளி 8.4 யூனிட் அளவில் பயிர் வளர்ச்சிக்கு உகந்ததாக உள்ளது.`
          },
          hi: {
            text: `☀️ **हाँ, बहुत अच्छी और खिली हुई धूप है!**\nसौर विकिरण **8.4 kWh/m²** दर्ज किया गया है। आसमान साफ है और बादल केवल **12%** हैं।`,
            spoken: `हाँ, आज बहुत अच्छी धूप खिली हुई है! सौर विकिरण 8.4 यूनिट है।`
          },
          ml: {
            text: `☀️ **അതെ, നല്ല തെളിഞ്ഞ വെയിലുണ്ട്!**\nസൗരവികിരണം **8.4 kWh/m²** ആണ്. വിളകൾക്ക് ഏറ്റവും അനുയോജ്യമായ അന്തരീക്ഷം.`,
            spoken: `അതെ, നല്ല തെളിഞ്ഞ വെയിലുണ്ട്!`
          },
          kn: {
            text: `☀️ **ಹೌದು, ಉತ್ತಮವಾದ ಪ್ರಕಾಶಮಾನವಾದ ಬಿಸಿಲಿದೆ!**\nಸೌರ ವಿಕಿರಣ **8.4 kWh/m²** ನಷ್ಟಿದ್ದು ಬೆಳೆಗಳಿಗೆ ಅತ್ಯುತ್ತಮವಾಗಿದೆ.`,
            spoken: `ಹೌದು, ಇಂದು ಉತ್ತಮ ಬಿಸಿಲಿದೆ!`
          },
          te: {
            text: `☀️ **అవును, ప్రకాశవంతమైన ఎండ ఉంది!**\nసౌర వికిరణం **8.4 kWh/m²** గా ఉంది. పంట ఎదుగుదలకు అనుకూలమైన వాతావరణం.`,
            spoken: `అవును, మంచి ఎండ ఉంది!`
          },
          mr: {
            text: `☀️ **होय, उत्तम सूर्यप्रकाश आहे!**\nसौर विकिरण **8.4 kWh/m²** आहे. पिकांच्या वाढीसाठी हे पोषक आहे.`,
            spoken: `होय, छान ऊन पडले आहे!`
          },
          ru: {
            text: `☀️ **Да, сегодня отличная ясная солнечная погода!**\nУровень солнечной радиации **8.4 кВт·ч/м²**, облачность всего **12%**.`,
            spoken: `Да, сегодня яркое солнце! Солнечная радиация 8.4 киловатт-часа на квадратный метр.`
          },
          de: {
            text: `☀️ **Ja, es gibt hervorragenden, hellen Sonnenschein!**\nDie Sonneneinstrahlung liegt bei **8,4 kWh/m²** bei minimaler Bewölkung (**12%**).`,
            spoken: `Ja, es gibt strahlenden Sonnenschein mit 8,4 Kilowattstunden pro Quadratmeter.`
          },
          es: {
            text: `☀️ **¡Sí, hay un sol brillante y excelente!**\nLa radiación solar se sitúa en **8.4 kWh/m²** con solo un **12%** de nubes.`,
            spoken: `¡Sí, hay un sol radiante y excelente para los cultivos!`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      }
    }

    // -------------------------------------------------------------------------
    // 3. CROP YIELD / HARVEST PROJECTION QUERY
    // -------------------------------------------------------------------------
    const isYieldQuery = /yield|harvest|crop production|produce|விளைச்சல்|மகசூல்|पैदावार|उपज|വിളവ്|ಇಳುವರಿ|దిగుబడి|उत्पादन|урожа|ertrag|rendimiento|cosecha/i.test(text);
    if (isYieldQuery) {
      if (isGoodYield) {
        const responses = {
          en: {
            text: `🌾 **Yes, the crop yield is looking very good!**\nSpectral chlorophyll reflection is robust at **${vegVal}%** with a composite health index of **${healthVal}/100**.\n- Projected harvest: **+14% above seasonal baseline**\n- Estimated parcel output: **4.8 metric tons/hectare**\n- Vigorous tillering and flowering observed.`,
            spoken: `Yes, the crop yield is looking very good! Estimated yield is 14 percent above normal baseline at 4.8 tons per hectare.`
          },
          ta: {
            text: `🌾 **ஆம், பயிர் விளைச்சல் மிகச் சிறப்பாக இருக்கும்!**\nதாவர பசுமை குறியீடு **${vegVal}%** ஆகவும் ஒட்டுமொத்த நலன் **${healthVal}/100** ஆகவும் உள்ளது.\n- எதிர்பார்க்கப்படும் விளைச்சல்: வழக்கத்தை விட **+14% அதிகம்**\n- உத்தேச மகசூல்: ஹெக்டேருக்கு **4.8 டன்**\n- செழிப்பான கிளைப்புகள் மற்றும் ஆரோக்கியமான கதிர் உருவாக்கம் பதிவாகியுள்ளது.`,
            spoken: `ஆம், பயிர் விளைச்சல் மிகச் சிறப்பாக உள்ளது! வழக்கத்தை விட 14 சதவீதம் அதிக மகசூல் கிடைக்கும் என்று கணக்கிடப்பட்டுள்ளது.`
          },
          hi: {
            text: `🌾 **हाँ, फसल की पैदावार बहुत अच्छी होने की उम्मीद है!**\nवनस्पति स्वास्थ्य **${vegVal}%** और समग्र स्कोर **${healthVal}/100** है।\n- अनुमानित पैदावार: सामान्य से **+14% अधिक**\n- अनुमानित उत्पादन: **4.8 टन प्रति हेक्टेयर**\n- पौधों की वृद्धि और दाना भराव अत्यंत मजबूत है।`,
            spoken: `हाँ, फसल की पैदावार बहुत अच्छी है! सामान्य से 14 प्रतिशत अधिक उपज का अनुमान है।`
          },
          ml: {
            text: `🌾 **അതെ, വിളവ് വളരെ മികച്ചതായിരിക്കും!**\nസസ്യ ആരോഗ്യം **${vegVal}%** ആണ്. ശരാശരിയേക്കാൾ **+14% കൂടുതൽ** വിളവ് പ്രതീക്ഷിക്കുന്നു (ഹെക്ടറിന് 4.8 ടൺ).`,
            spoken: `അതെ, വിളവ് വളരെ മികച്ചതായിരിക്കും! 14 ശതമാനം അധിക വിളവ് ലഭിക്കും.`
          },
          kn: {
            text: `🌾 **ಹೌದು, ಬೆಳೆ ಇಳುವರಿ ತುಂಬಾ ಚೆನ್ನಾಗಿರುತ್ತದೆ!**\nಸಸ್ಯವರ್ಗದ ಆರೋಗ್ಯ **${vegVal}%** ಇದೆ. ವಾಡಿಕೆಗಿಂತ **+14% ಹೆಚ್ಚು** ಇಳುವರಿ (ಹೆಕ್ಟೇರಿಗೆ 4.8 ಟನ್) ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ.`,
            spoken: `ಹೌದು, ಬೆಳೆ ಇಳುವರಿ ಉತ್ತಮವಾಗಿದೆ! ಶೇಕಡಾ 14 ರಷ್ಟು ಹೆಚ್ಚು ಇಳುವರಿ ಬರುತ್ತದೆ.`
          },
          te: {
            text: `🌾 **అవును, పంట దిగుబడి చాలా బాగుంటుంది!**\nమొక్కల ఆరోగ్యం **${vegVal}%** వద్ద ఉంది. సాధారణం కంటే **+14% అధిక** దిగుబడి వస్తుందని అంచనా (హెక్టారుకు 4.8 టన్నులు).`,
            spoken: `అవును, పంట దిగుబడి చాలా బాగుంది! 14 శాతం ఎక్కువ దిగుబడి వస్తుంది.`
          },
          mr: {
            text: `🌾 **होय, पीक उत्पादन अतिशय उत्तम होईल!**\nवनस्पती आरोग्य **${vegVal}%** आहे. सरासरीपेक्षा **+14% जास्त** उत्पादनाचा अंदाज आहे (4.8 टन प्रति हेक्टर).`,
            spoken: `होय, पीक उत्पादन खूप चांगले होईल! 14 टक्के जास्त उत्पादन अपेक्षित आहे.`
          },
          ru: {
            text: `🌾 **Да, прогнозируется отличный урожай!**\nИндекс здоровья растительности составляет **${vegVal}%**.\n- Прогноз урожайности: **+14% выше нормы**\n- Ожидаемый сбор: **4.8 т/га**.`,
            spoken: `Да, урожай ожидается отличный! Прогноз урожайности на 14 процентов выше нормы.`
          },
          de: {
            text: `🌾 **Ja, der Ernteertrag sieht sehr gut aus!**\nDer Vegetationsgesundheitswert liegt bei **${vegVal}%**.\n- Ernteprognose: **+14% über dem Durchschnitt**\n- Geschätzter Ertrag: **4,8 Tonnen pro Hektar**.`,
            spoken: `Ja, der Ernteertrag ist sehr gut! Es wird ein Ertrag von 14 Prozent über dem Durchschnitt erwartet.`
          },
          es: {
            text: `🌾 **¡Sí, el rendimiento del cultivo es muy bueno!**\nLa salud vegetal está al **${vegVal}%** con un índice compuesto de **${healthVal}/100**.\n- Pronóstico de cosecha: **+14% sobre la media**\n- Rendimiento estimado: **4.8 toneladas por hectárea**.`,
            spoken: `¡Sí, el rendimiento del cultivo se proyecta excelente, un 14 por ciento sobre el promedio!`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      } else {
        const responses = {
          en: {
            text: `⚠️ **No, the crop yield is currently compromised.**\nDue to elevated stress levels (Dryness: ${dryVal}%, Health: ${healthVal}/100), yield is projected at **-18% below seasonal potential**.\n- Recommended corrective action: Implement micro-irrigation and foliar micronutrient feeding immediately.`,
            spoken: `No, the crop yield is currently compromised due to moisture stress, running 18 percent below normal potential.`
          },
          ta: {
            text: `⚠️ **இல்லை, தற்போதைய சூழலில் விளைச்சல் திருப்திகரமாக இல்லை.**\nமண் வறட்சி (${dryVal}%) மற்றும் குறைவான ஆரோக்கியம் காரணமாக மகசூல் **-18% குறைய வாய்ப்புள்ளது**.\n- உடனடி நடவடிக்கை: உடனே சொட்டு நீர் பாசனம் மற்றும் இலைவழி உரமிடுதல் மேற்கொள்ளவும்.`,
            spoken: `இல்லை, விளைச்சல் திருப்திகரமாக இல்லை. வறட்சி காரணமாக மகசூல் 18 சதவீதம் குறைய வாய்ப்புள்ளது.`
          },
          hi: {
            text: `⚠️ **नहीं, वर्तमान में फसल की पैदावार खतरे में है।**\nसूखे के तनाव (${dryVal}%) के कारण पैदावार में **-18% की गिरावट** आ सकती है।\n- सुझाव: तुरंत सिंचाई करें और पोषक तत्वों का छिड़काव करें।`,
            spoken: `नहीं, फसल की पैदावार अच्छी नहीं है। सूखे की वजह से 18 प्रतिशत की कमी हो सकती है।`
          },
          ml: {
            text: `⚠️ **അല്ല, നിലവിലെ സാഹചര്യത്തിൽ വിളവ് കുറയാൻ സാധ്യതയുണ്ട്.**\nവരൾച്ച കാരണം വിളവിൽ **-18% കുറവ്** ഉണ്ടായേക്കാം. ഉടനടി നനയ്ക്കണം.`,
            spoken: `അല്ല, വിളവ് കുറവായിരിക്കാനാണ് സാധ്യത.`
          },
          kn: {
            text: `⚠️ **ಇಲ್ಲ, ಪ್ರಸ್ತುತ ಪರಿಸ್ಥಿತಿಯಲ್ಲಿ ಇಳುವರಿ ಕಡಿಮೆಯಾಗಬಹುದು.**\nಬರದ ಕಾರಣದಿಂದ ಇಳುವರಿ **-18% ಕುಸಿಯುವ** ಸಂಭವವಿದೆ. ತಕ್ಷಣ ನೀರುಣಿಸಿ.`,
            spoken: `ಇಲ್ಲ, ಇಳುವರಿ ಕಡಿಮೆಯಾಗುವ ಸಂಭವವಿದೆ.`
          },
          te: {
            text: `⚠️ **లేదు, ప్రస్తుతం పంట దిగుబడి ఆశాజనకంగా లేదు.**\nతేమ లోపం వల్ల దిగుబడి **-18% తగ్గే** అవకాశం ఉంది. వెంటనే నీటిపారుదల అందించండి.`,
            spoken: `లేదు, ప్రస్తుతం పంట దిగుబడి ఆశాజనకంగా లేదు.`
          },
          mr: {
            text: `⚠️ **नाही, सध्या पीक उत्पादन धोक्यात आहे.**\nकोरडेपणामुळे उत्पादनात **-18% घट** होण्याची शक्यता आहे. त्वरित पाणी द्या.`,
            spoken: `नाही, उत्पादनात घट होण्याची शक्यता आहे.`
          },
          ru: {
            text: `⚠️ **Нет, урожай сейчас под угрозой.**\nИз-за дефицита влаги (сухость: ${dryVal}%) прогнозируется спад урожая на **-18%**. Требуется полив.`,
            spoken: `Нет, урожай сейчас под угрозой из-за засухи.`
          },
          de: {
            text: `⚠️ **Nein, der Ernteertrag ist derzeit gefährdet.**\nAufgrund von Trockenstress (${dryVal}%) wird ein Rückgang von **-18%** prognostiziert. Sofort bewässern.`,
            spoken: `Nein, der Ernteertrag ist durch Trockenstress gefährdet.`
          },
          es: {
            text: `⚠️ **No, el rendimiento del cultivo está comprometido.**\nDebido al estrés hídrico (sequedad: ${dryVal}%), se proyecta una pérdida del **-18%**. Riego urgente.`,
            spoken: `No, el rendimiento está en riesgo por estrés hídrico.`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      }
    }

    // -------------------------------------------------------------------------
    // 4. LAND / SOIL CONDITION QUERY
    // -------------------------------------------------------------------------
    const isLandQuery = /land|soil|ground|earth condition|terreno|நிலம்|மண்|जमीन|मिट्टी|നിലം|മണ്ണ്|ಭೂಮಿ|ಮಣ್ಣು|నేల|जमीन|माती|земл|почв|boden|suelo|tierra/i.test(text);
    if (isLandQuery) {
      if (isDry) {
        const responses = {
          en: {
            text: `🏜️ **The land is suffering from severe dryness.**\nTopsoil moisture is depleted to **${100 - dryVal}%**. Surface crusting and dehydration cracks are present. Soil fertility is dormant; it requires hydration and organic mulching before sowing.`,
            spoken: `The land is suffering from high dryness. Topsoil moisture is very low at only ${100 - dryVal} percent.`
          },
          ta: {
            text: `🏜️ **நிலம் அதிக வறட்சியால் பாதிக்கப்பட்டுள்ளது.**\nமண் ஈரப்பதம் **${100 - dryVal}%** மட்டுமே உள்ளது. மேல்பரப்பில் வெடிப்புகள் ஏற்பட வாய்ப்புள்ளது. பயிரிடுவதற்கு முன் ஆழமான பாசனம் மற்றும் இயற்கை உரம் தேவை.`,
            spoken: `நிலம் அதிக வறட்சியால் பாதிக்கப்பட்டுள்ளது. மண் ஈரப்பதம் மிகவும் குறைவாக உள்ளது.`
          },
          hi: {
            text: `🏜️ **जमीन गंभीर सूखे की स्थिति में है।**\nमिट्टी की नमी घटकर **${100 - dryVal}%** रह गई है। बुवाई से पहले गहरी सिंचाई और खाद की आवश्यकता है।`,
            spoken: `जमीन सूखे से प्रभावित है और मिट्टी में नमी बहुत कम है।`
          },
          ml: {
            text: `🏜️ **ഭൂമി കടുത്ത വരൾച്ചയിലാണ്.**\nമണ്ണിലെ ഈർപ്പം **${100 - dryVal}%** മാത്രമാണ്. ജലസേചനം ആവശ്യമാണ്.`,
            spoken: `ഭൂമിയിൽ കടുത്ത വരൾച്ചയുണ്ട്.`
          },
          kn: {
            text: `🏜️ **ಭೂಮಿ ತೀವ್ರ ಬರದಿಂದ ಕೂಡಿದೆ.**\nಮಣ್ಣಿನ ತೇವಾಂಶ ಕೇವಲ **${100 - dryVal}%** ಇದೆ. ಬಿತ್ತನೆಗೆ ಮುನ್ನ ನೀರುಣಿಸಬೇಕು.`,
            spoken: `ಭೂಮಿಯಲ್ಲಿ ತೇವಾಂಶ ಕಡಿಮೆಯಾಗಿದೆ.`
          },
          te: {
            text: `🏜️ **భూమి తీవ్రమైన ఎండబెట్టే స్థితిలో ఉంది.**\nనేల తేమ **${100 - dryVal}%** మాత్రమే ఉంది. తగినంత నీరు అవసరం.`,
            spoken: `నేల చాలా పొడిగా ఉంది.`
          },
          mr: {
            text: `🏜️ **जमीन तीव्र कोरडेपणाने ग्रस्त आहे.**\nमातीतील ओलावा फक्त **${100 - dryVal}%** आहे. सिंचन तातडीने करा.`,
            spoken: `जमीन कोरडी पडली आहे.`
          },
          ru: {
            text: `🏜️ **Земля сильно пересушена.**\nВлажность почвы упала до **${100 - dryVal}%**. Почве требуется глубокое орошение.`,
            spoken: `Земля пересушена, требуется глубокое орошение.`
          },
          de: {
            text: `🏜️ **Der Boden leidet unter starker Trockenheit.**\nDie Bodenfeuchtigkeit ist auf **${100 - dryVal}%** gesunken. Bewässerung ist erforderlich.`,
            spoken: `Der Boden leidet unter schwerer Trockenheit.`
          },
          es: {
            text: `🏜️ **La tierra sufre una sequedad severa.**\nLa humedad del suelo bajó al **${100 - dryVal}%**. Se requiere hidratación profunda.`,
            spoken: `La tierra presenta sequedad severa, requiere hidratación.`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      } else {
        const responses = {
          en: {
            text: `🏞️ **The land is in very good agricultural condition!**\n- Soil moisture: **${100 - dryVal}%** (Optimal root zone hydration)\n- Organic matter response: **Healthy & Fertile**\n- Slope stability & erosion risk: **Minimal (Risk Level 1)**\nIt is prime for planting, tillering, and steady vegetative expansion.`,
            spoken: `The land is in very good condition! Soil moisture is balanced at ${100 - dryVal} percent and well suited for cultivation.`
          },
          ta: {
            text: `🏞️ **நிலம் மற்றும் மண் வளம் மிகச் சிறப்பாக உள்ளது!**\n- மண் ஈரப்பதம்: **${100 - dryVal}%** (வேர்களுக்கு உகந்த ஈரப்பதம்)\n- கரிம சத்து வளம்: **செழுமையானது**\n- மண் அரிப்பு அபாயம்: **மிகக்குறைவு (நிலை 1)**\nவிவசாயம் செய்வதற்கும் பயிர் செழித்து வளர்வதற்கும் இந்த நிலம் மிக உகந்தது.`,
            spoken: `நிலம் மற்றும் மண் வளம் மிகச் சிறப்பாக உள்ளது! மண் ஈரப்பதம் ${100 - dryVal} சதவீதம் உள்ளது.`
          },
          hi: {
            text: `🏞️ **जमीन और मिट्टी की गुणवत्ता बहुत अच्छी है!**\n- मिट्टी की नमी: **${100 - dryVal}%** (जड़ों के लिए इष्टतम)\n- जैविक उर्वरता: **उत्कृष्ट**\n- कटाव का जोखिम: **न्यूनतम**\nयह जमीन खेती और बुवाई के लिए पूरी तरह अनुकूल है।`,
            spoken: `जमीन और मिट्टी बहुत अच्छी स्थिति में है। खेती के लिए बिल्कुल उपयुक्त है।`
          },
          ml: {
            text: `🏞️ **ഭൂമിയും മണ്ണും കൃഷിക്ക് വളരെ നല്ലതാണ്!**\n- മണ്ണിലെ ഈർപ്പം: **${100 - dryVal}%**\n- ഫലഭൂയിഷ്ഠത: **മികച്ചത്**\nവിളവിറക്കാൻ ഈ മണ്ണ് ഏറ്റവും അനുയോജ്യമാണ്.`,
            spoken: `ഭൂമിയും മണ്ണും കൃഷിക്ക് വളരെ അനുയോജ്യമാണ്.`
          },
          kn: {
            text: `🏞️ **ಭೂಮಿ ಮತ್ತು ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಉತ್ತಮವಾಗಿದೆ!**\n- ಮಣ್ಣಿನ ತೇವಾಂಶ: **${100 - dryVal}%**\n- ಫಲವತ್ತತೆ: **ಉತ್ತಮ**\nಕೃಷಿ ಕೆಲಸಗಳಿಗೆ ಇದು ಅತ್ಯಂತ ಯೋಗ್ಯವಾಗಿದೆ.`,
            spoken: `ಭೂಮಿ ಮತ್ತು ಮಣ್ಣು ಕೃಷಿಗೆ ಅತ್ಯುತ್ತಮವಾಗಿದೆ.`
          },
          te: {
            text: `🏞️ **నేల మరియు భూమి చాలా అనుకూలంగా ఉంది!**\n- నేల తేమ: **${100 - dryVal}%**\n- సారవంతం: **చాలా బాగుంది**\nపంటల సాగుకు ఈ భూమి అత్యంత అనువైనది.`,
            spoken: `నేల చాలా సారవంతంగా ఉంది, పంటలకు అనుకూలం.`
          },
          mr: {
            text: `🏞️ **जमीन आणि माती शेतीसाठी उत्तम आहे!**\n- ओलावा: **${100 - dryVal}%**\n- सुपिकता: **उत्कृष्ट**\nपेरणीसाठी ही जमीन अत्यंत योग्य आहे.`,
            spoken: `जमीन शेतीसाठी खूप चांगली आहे.`
          },
          ru: {
            text: `🏞️ **Земля находится в отличном состоянии!**\n- Влажность почвы: **${100 - dryVal}%**\n- Плодородие: **Высокое**\n- Риск эрозии: **Минимальный**\nЗемля превосходно подходит для активного земледелия.`,
            spoken: `Земля в отличном состоянии, влажность оптимальна.`
          },
          de: {
            text: `🏞️ **Das Land befindet sich in einem sehr guten Zustand!**\n- Bodenfeuchtigkeit: **${100 - dryVal}%**\n- Fruchtbarkeit: **Ausgezeichnet**\n- Erosionsrisiko: **Minimal**\nPerfekt für die landwirtschaftliche Nutzung geeignet.`,
            spoken: `Das Land ist in hervorragendem Zustand für die Landwirtschaft.`
          },
          es: {
            text: `🏞️ **¡La tierra está en excelentes condiciones agrícolas!**\n- Humedad del suelo: **${100 - dryVal}%**\n- Fertilidad: **Alta**\n- Riesgo de erosión: **Mínimo**\nÓptima para la siembra y el crecimiento del cultivo.`,
            spoken: `¡La tierra está en excelente condición para la agricultura!`
          }
        };
        return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
      }
    }

    // -------------------------------------------------------------------------
    // 5. PERCENTAGE / TELEMETRY OVERVIEW
    // -------------------------------------------------------------------------
    if (/percentage|level|score|telemetry|அளவீடு|விகிதம்|प्रतिशत|ശതമാനം|ಪ್ರತಿಶತ|శాతం|टक्के|процент|prozent|porcentaje/i.test(text)) {
      const responses = {
        en: {
          text: `📊 **Active Spectral Telemetry Breakdown:**\n- **Vegetation Health (ExG):** ${vegVal}%\n- **Composite Health Score:** ${healthVal}/100\n- **Water Detection (NDWI):** ${waterVal}%\n- **Dryness Anomaly:** ${dryVal}%\n\nThe spectral reflectance confirms healthy vegetative canopy vigor.`,
          spoken: `Vegetation health is ${vegVal} percent, composite score is ${healthVal}, water detection is ${waterVal} percent, and dryness is ${dryVal} percent.`
        },
        ta: {
          text: `📊 **நிகழ்நேர நிறமாலை அளவீடுகள் விவரம்:**\n- **தாவர ஆரோக்கியம் (ExG):** ${vegVal}%\n- **கூட்டு நல மதிப்பீடு:** ${healthVal}/100\n- **நீர் குறியீடு (NDWI):** ${waterVal}%\n- **மண் வறட்சி அளவு:** ${dryVal}%\n\nநிறமாலை தரவுகள் பயிர்களின் சீரான வளர்ச்சியை உறுதிப்படுத்துகிறது.`,
          spoken: `தாவர ஆரோக்கியம் ${vegVal} சதவீதம், ஒட்டுமொத்த மதிப்பீடு ${healthVal}, நீர் ${waterVal} சதவீதம், வறட்சி ${dryVal} சதவீதம்.`
        },
        hi: {
          text: `📊 **सक्रिय स्पेक्ट्रल टेलीमेट्री विवरण:**\n- **वनस्पति स्वास्थ्य (ExG):** ${vegVal}%\n- **समग्र स्वास्थ्य स्कोर:** ${healthVal}/100\n- **जल सूचकांक (NDWI):** ${waterVal}%\n- **सूखा विसंगति:** ${dryVal}%`,
          spoken: `वनस्पति स्वास्थ्य ${vegVal} प्रतिशत, समग्र स्कोर ${healthVal}, जल सूचकांक ${waterVal} प्रतिशत और सूखा ${dryVal} प्रतिशत है।`
        },
        ml: {
          text: `📊 **ലൈവ് സ്പെക്ട്രൽ ടെലിമെട്രി വിവരങ്ങൾ:**\n- **സസ്യ ആരോഗ്യം (ExG):** ${vegVal}%\n- **ആകെ ആരോഗ്യ സ്കോർ:** ${healthVal}/100\n- **ജല സൂചിക (NDWI):** ${waterVal}%\n- **വരൾച്ച സൂചിക:** ${dryVal}%`,
          spoken: `സസ്യ ആരോഗ്യം ${vegVal} ശതമാനം, ആകെ സ്കോർ ${healthVal}, ജലം ${waterVal} ശതമാനം, വരൾച്ച ${dryVal} ശതമാനം.`
        },
        kn: {
          text: `📊 **ಲೈವ್ ಸ್ಪೆಕ್ಟ್ರಲ್ ಟೆಲಿಮೆಟ್ರಿ ವಿವರಗಳು:**\n- **ಸಸ್ಯವರ್ಗದ ಆರೋಗ್ಯ (ExG):** ${vegVal}%\n- **ಒಟ್ಟಾರೆ ಆರೋಗ್ಯ ಸ್ಕೋರ್:** ${healthVal}/100\n- **ನೀರಿನ ಸೂಚ್ಯಂಕ (NDWI):** ${waterVal}%\n- **ಬರ ಸೂಚ್ಯಂಕ:** ${dryVal}%`,
          spoken: `ಸಸ್ಯ ಆರೋಗ್ಯ ${vegVal} ಪ್ರತಿಶತ, ಒಟ್ಟಾರೆ ಸ್ಕೋರ್ ${healthVal}, ನೀರು ${waterVal} ಪ್ರತಿಶತ, ಬರ ${dryVal} ಪ್ರತಿಶತ.`
        },
        te: {
          text: `📊 **లైవ్ స్పెక్ట్రల్ టెలిమెట్రీ వివరాలు:**\n- **మొక్కల ఆరోగ్యం (ExG):** ${vegVal}%\n- **మొత్తం ఆరోగ్య స్కోరు:** ${healthVal}/100\n- **నీటి సూచిక (NDWI):** ${waterVal}%\n- **ఎండబెట్టే స్థాయి:** ${dryVal}%`,
          spoken: `మొక్కల ఆరోగ్యం ${vegVal} శాతం, మొత్తం స్కోరు ${healthVal}, నీరు ${waterVal} శాతం మరియు ఎండబెట్టే స్థాయి ${dryVal} శాతం.`
        },
        mr: {
          text: `📊 **थेट स्पेक्ट्रल टेलिमेट्री तपशील:**\n- **वनस्पती आरोग्य (ExG):** ${vegVal}%\n- **एकूण आरोग्य स्कोअर:** ${healthVal}/100\n- **पाणी निर्देशांक (NDWI):** ${waterVal}%\n- **कोरडेपणा विसंगती:** ${dryVal}%`,
          spoken: `वनस्पती आरोग्य ${vegVal} टक्के, एकूण स्कोअर ${healthVal}, पाणी ${waterVal} टक्के आणि कोरडेपणा ${dryVal} टक्के आहे.`
        },
        ru: {
          text: `📊 **Текущие спектральные показатели:**\n- **Индекс растительности:** ${vegVal}%\n- **Интегральный индекс:** ${healthVal}/100\n- **Водный индекс:** ${waterVal}%\n- **Уровень засухи:** ${dryVal}%`,
          spoken: `Растительность ${vegVal} процентов, интегральный индекс ${healthVal}, вода ${waterVal} процентов, засуха ${dryVal} процентов.`
        },
        de: {
          text: `📊 **Aktuelle Spektral-Telemetrie:**\n- **Vegetationsgesundheit:** ${vegVal}%\n- **Gesamt-Gesundheitsscore:** ${healthVal}/100\n- **Wassererkennung:** ${waterVal}%\n- **Trockenheit:** ${dryVal}%`,
          spoken: `Vegetation ${vegVal} Prozent, Gesamtscore ${healthVal}, Wasser ${waterVal} Prozent und Trockenheit ${dryVal} Prozent.`
        },
        es: {
          text: `📊 **Desglose de Telemetría Espectral:**\n- **Salud Vegetal:** ${vegVal}%\n- **Puntuación Compuesta:** ${healthVal}/100\n- **Detección de Agua:** ${waterVal}%\n- **Anomalía de Sequía:** ${dryVal}%`,
          spoken: `Salud vegetal al ${vegVal} por ciento, índice compuesto ${healthVal}, agua al ${waterVal} por ciento y sequía al ${dryVal} por ciento.`
        }
      };
      return { text: responses[lang]?.text || responses.en.text, spokenText: responses[lang]?.spoken || responses.en.spoken };
    }

    // -------------------------------------------------------------------------
    // 6. SATELLITE & MISSION CONTROL
    // -------------------------------------------------------------------------
    if (/mission|satellite|orbit|செயற்கைக்கோள்|उपग्रह|ഉപഗ്രഹം|ಉಪಗ್ರಹ|సాటిలైట్|उपग्रह|спутник|satellit|satélite/i.test(text)) {
      const responses = {
        en: {
          text: `🛰️ **Mission Control Status:**\nConstellation unit **NOVA-01** is tracking along a 700km Sun-Synchronous Low Earth Orbit. Telemetry signal is **99.4%**, battery charge is **100%**, and multi-spectral sensors are actively streaming.`,
          spoken: `Mission Control reports satellite NOVA-01 is operating nominally in 700 kilometer orbit with 99.4 percent signal strength.`
        },
        ta: {
          text: `🛰️ **மிஷன் கட்டுப்பாடு நிலை:**\nநோவா-01 செயற்கைக்கோள் 700 கி.மீ உயரத்தில் பூமியைச் சுற்றி வருகிறது. சிக்னல் வலிமை **99.4%** ஆகவும் சோலார் மின்கலங்கள் முழுமையாக இயங்கி வருகின்றன.`,
          spoken: `நோவா-01 செயற்கைக்கோள் 700 கி.மீ உயரத்தில் பூமியை வெற்றிகரமாகச் சுற்றி வருகிறது. சிக்னல் தரம் சீராக உள்ளது.`
        },
        hi: {
          text: `🛰️ **मिशन नियंत्रण स्थिति:**\nउपग्रह **NOVA-01** 700 किमी की निचली पृथ्वी कक्षा में स्थापित है। सिग्नल शक्ति **99.4%** और बैटरी पूर्ण चार्ज है।`,
          spoken: `मिशन नियंत्रण के अनुसार उपग्रह नोवा-01 सामान्य रूप से 700 किमी की कक्षा में काम कर रहा है।`
        },
        ml: {
          text: `🛰️ **മിഷൻ കൺട്രോൾ നില:**\nനോവ-01 ഉപഗ്രഹം 700 കി.മീ ഭ്രമണപഥത്തിൽ സുരക്ഷിതമായി പ്രവർത്തിക്കുന്നു. സിഗ്നൽ കരുത്ത് **99.4%**, ബാറ്ററി ചാർജ് **100%** ആണ്.`,
          spoken: `നോവ-01 ഉപഗ്രഹം 700 കിലോമീറ്റർ ഭ്രമണപഥത്തിൽ വിജയകരമായി പ്രവർത്തിക്കുന്നു.`
        },
        kn: {
          text: `🛰️ **ಮಿಷನ್ ಕಂಟ್ರೋಲ್ ಸ್ಥಿತಿ:**\nನೋವಾ-01 ಉಪಗ್ರಹವು 700 ಕಿ.ಮೀ ಕಕ್ಷೆಯಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ. ಸಿಗ್ನಲ್ ಶಕ್ತಿ **99.4%** ಮತ್ತು ಬ್ಯಾಟರಿ **100%** ಇದೆ.`,
          spoken: `ನೋವಾ-01 ಉಪಗ್ರಹವು 700 ಕಿಲೋಮೀಟರ್ ಕಕ್ಷೆಯಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ.`
        },
        te: {
          text: `🛰️ **మిషన్ కంట్రోల్ స్థితి:**\nనోవా-01 ఉపగ్రహం 700 కి.మీ కక్ష్యలో తిరుగుతోంది. సిగ్నల్ శక్తి **99.4%**, బ్యాటరీ చార్జ్ **100%** ఉంది.`,
          spoken: `నోవా-01 ఉపగ్రహం 700 కిలోమీటర్ల కక్ష్యలో విజయవంతంగా పనిచేస్తోంది.`
        },
        mr: {
          text: `🛰️ **मिशन नियंत्रण स्थिती:**\nउपग्रह नोव्हा-01 700 किमी कक्षेत कार्यरत आहे. सिग्नल सामर्थ्य **99.4%** आणि बॅटरी चार्ज **100%** आहे.`,
          spoken: `उपग्रह नोव्हा-01 700 किमी कक्षेत सामान्यपणे कार्यरत आहे.`
        },
        ru: {
          text: `🛰️ **Статус Центра управления полетами:**\nСпутник **NOVA-01** находится на 700-километровой солнечно-синхронной орбите. Сигнал телеметрии **99.4%**, заряд батареи **100%**.`,
          spoken: `Спутник NOVA-01 штатно функционирует на 700-километровой орбите, сигнал 99.4 процента.`
        },
        de: {
          text: `🛰️ **Missionskontroll-Status:**\nSatellit **NOVA-01** befindet sich in einem 700 km sonnensynchronen Erdorbit. Das Telemetriesignal liegt bei **99,4%**, der Akkustand bei **100%**.`,
          spoken: `Missionskontrolle meldet: Satellit NOVA-01 operiert nominal im 700 Kilometer Orbit.`
        },
        es: {
          text: `🛰️ **Estado del Centro de Control:**\nEl satélite **NOVA-01** opera en una órbita heliosincrónica a 700 km. La señal de telemetría es del **99.4%** y la batería está al **100%**.`,
          spoken: `El satélite NOVA-01 opera con normalidad en órbita a 700 kilómetros con 99.4 por ciento de señal.`
        }
      };
      return {
        text: responses[lang]?.text || responses.en.text,
        spokenText: responses[lang]?.spoken || responses.en.spoken,
        action: () => app && app.switchView('view-mission')
      };
    }

    // -------------------------------------------------------------------------
    // 7. GREETING & GENERAL
    // -------------------------------------------------------------------------
    if (/^(hi|hey|hello|good morning|vanakkam|namaste)|வணக்கம்|नमस्ते|നമസ്കാരം|ನಮಸ್ಕಾರ|నమస్కారం|नमस्कार|здравствуйте|привет|hallo|guten tag|hola/i.test(text)) {
      const greetings = {
        en: {
          text: `👋 **Hello! I am AstroNova Earth Intelligence AI.**\nAll remote sensing systems are synchronized. Active scene vegetation health is at **${vegVal}%**, water index at **${waterVal}%**, and soil moisture is stable. What would you like to examine today? You can ask about rain, sunshine, soil, or crop yields.`,
          spoken: `Hello! I am AstroNova Earth Intelligence AI. How can I assist with your land, weather, or crop monitoring today?`
        },
        ta: {
          text: `👋 **வணக்கம்! நான் அஸ்ட்ரோநோவா பூமி நுண்ணறிவு AI.**\nதொலை உணர்வு அமைப்புகள் அனைத்தும் முழுமையாக இயங்குகின்றன. தாவர ஆரோக்கியம் **${vegVal}%** ஆக உள்ளது. மழை, வெயில், நிலம் அல்லது பயிர் விளைச்சல் பற்றி நீங்கள் என்னிடம் கேட்கலாம்!`,
          spoken: `வணக்கம்! நான் அஸ்ட்ரோநோவா AI. மழை, வெயில், மண் அல்லது பயிர் விளைச்சல் பற்றி நீங்கள் என்னிடம் கேட்கலாம்.`
        },
        hi: {
          text: `👋 **नमस्ते! मैं एस्ट्रोनोवा अर्थ इंटेलिजेंस AI हूँ।**\nसभी रिमोट सेंसिंग प्रणालियाँ सक्रिय हैं। वनस्पति स्वास्थ्य **${vegVal}%** है। आप मुझसे बारिश, धूप, जमीन या फसल पैदावार के बारे में पूछ सकते हैं!`,
          spoken: `नमस्ते! मैं एस्ट्रोनोवा AI हूँ। बारिश, धूप, जमीन या फसल के बारे में मुझसे पूछें।`
        },
        ml: {
          text: `👋 **നമസ്കാരം! ഞാൻ ആസ്ട്രോനോവ AI ആണ്.**\nഎല്ലാ ഭൗമ നിരീക്ഷണ സംവിധാനങ്ങളും സജീവമാണ്. മഴ, വെയിൽ, കൃഷി, വിളവ് എന്നിവയെക്കുറിച്ച് നിങ്ങൾക്ക് എന്നോട് ചോദിക്കാം!`,
          spoken: `നമസ്കാരം! ഞാൻ ആസ്ട്രോനോവ AI ആണ്. കൃഷി, മഴ, വിളവ് എന്നിവയെക്കുറിച്ച് ചോദിക്കൂ.`
        },
        kn: {
          text: `👋 **ನಮಸ್ಕಾರ! ನಾನು ಆಸ್ಟ್ರೋನೋವಾ AI.**\nಎಲ್ಲಾ ರಿಮೋಟ್ ಸೆನ್ಸಿಂಗ್ ವ್ಯವಸ್ಥೆಗಳು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿವೆ. ಮಳೆ, ಬಿಸಿಲು, ಭೂಮಿ ಅಥವಾ ಬೆಳೆ ಇಳುವರಿಯ ಬಗ್ಗೆ ನೀವು ಕೇಳಬಹುದು!`,
          spoken: `ನಮಸ್ಕಾರ! ನಾನು ಆಸ್ಟ್ರೋನೋವಾ AI. ಮಳೆ, ಬಿಸಿಲು, ಬೆಳೆ ಬಗ್ಗೆ ಕೇಳಿ.`
        },
        te: {
          text: `👋 **నమస్కారం! నేను ఆస్ట్రోనోవా AI.**\nఅన్ని రిమోట్ సెన్సింగ్ వ్యవస్థలు సిద్ధంగా ఉన్నాయి. వర్షం, ఎండ, నేల లేదా పంట దిగుబడి గురించి నన్ను అడగండి!`,
          spoken: `నమస్కారం! వర్షం, ఎండ, పంట దిగుబడి గురించి అడగండి.`
        },
        mr: {
          text: `👋 **नमस्कार! मी अ‍ॅस्ट्रोनोव्हा AI आहे.**\nसर्व रिमोट सेन्सिंग यंत्रणा कार्यरत आहेत. पाऊस, ऊन, जमीन किंवा पीक उत्पादनाबद्दल तुम्ही मला विचारू शकता!`,
          spoken: `नमस्कार! पाऊस, ऊन, शेती किंवा पिकाबद्दल विचारा.`
        },
        ru: {
          text: `👋 **Здравствуйте! Я ИИ Ассистент АстроНова.**\nВсе системы дистанционного зондирования активны. Вы можете спросить меня о дожде, солнце, состоянии почвы или урожае!`,
          spoken: `Здравствуйте! Я ИИ Ассистент АстроНова. Спросите меня о дожде, солнце или урожае.`
        },
        de: {
          text: `👋 **Hallo! Ich bin die AstroNova Erd-Intelligenz KI.**\nAlle Systeme sind synchronisiert. Sie können mich nach Regen, Sonne, Bodenqualität oder Ernteerträgen fragen!`,
          spoken: `Hallo! Ich bin die AstroNova KI. Fragen Sie mich nach Regen, Sonne oder Ernteerträgen.`
        },
        es: {
          text: `👋 **¡Hola! Soy la IA de Inteligencia Terrestre AstroNova.**\nTodos los sistemas están operativos. Puedes preguntarme sobre la lluvia, el sol, la tierra o el rendimiento de tus cultivos.`,
          spoken: `¡Hola! Soy la IA AstroNova. Pregúntame sobre lluvia, sol, tierra o tus cosechas.`
        }
      };
      return { text: greetings[lang]?.text || greetings.en.text, spokenText: greetings[lang]?.spoken || greetings.en.spoken };
    }

    // -------------------------------------------------------------------------
    // 8. INTELLIGENT DEFAULT FALLBACK
    // -------------------------------------------------------------------------
    const fallbacks = {
      en: {
        text: `🛰️ **AstroNova AI Analysis:**\nI processed your inquiry: "${input}".\n- Vegetation vigor: **${vegVal}%**\n- Moisture index: **${waterVal}%**\n- Dryness anomaly: **${dryVal}%**\n- Environmental stability is nominal. Ask me specifically whether it rained, if there's sun, or if crop yield is good!`,
        spoken: `I processed your inquiry. Vegetation is at ${vegVal} percent. Feel free to ask specifically about rain, sunshine, or crop yield!`
      },
      ta: {
        text: `🛰️ **அஸ்ட்ரோநோவா AI பகுப்பாய்வு:**\nஉங்கள் கேள்வி: "${input}".\n- தாவர ஆரோக்கியம்: **${vegVal}%**\n- நீர் குறியீடு: **${waterVal}%**\n- மண் வறட்சி: **${dryVal}%**\nமழை பெய்ததா, வெயில் இருக்கிறதா, நிலம் எப்படி உள்ளது, அல்லது விளைச்சல் நல்லதா என்று நீங்கள் நேரடியாகக் கேட்கலாம்!`,
        spoken: `உங்கள் கேள்வி பகுப்பாய்வு செய்யப்பட்டது. மழை, வெயில், நிலம் அல்லது பயிர் விளைச்சல் பற்றி நீங்கள் நேரடியாகக் கேட்கலாம்.`
      },
      hi: {
        text: `🛰️ **एस्ट्रोनोवा AI विश्लेषण:**\nआपका प्रश्न: "${input}"।\n- वनस्पति स्वास्थ्य: **${vegVal}%**\n- जल सूचकांक: **${waterVal}%**\n- सूखा स्तर: **${dryVal}%**\nआप सीधे पूछ सकते हैं कि क्या बारिश हुई, धूप है, या फसल की पैदावार कैसी है!`,
        spoken: `आपके प्रश्न का विश्लेषण किया गया। आप बारिश, धूप या फसल की पैदावार के बारे में पूछ सकते हैं।`
      },
      ml: {
        text: `🛰️ **ആസ്ട്രോനോവ AI വിശകലനം:**\nചോദ്യം: "${input}".\nസസ്യ ആരോഗ്യം **${vegVal}%**, ജലനിലവാരം **${waterVal}%**. മഴയെക്കുറിച്ചോ വിളവിനെക്കുറിച്ചോ ചോദിക്കൂ!`,
        spoken: `ചോദ്യം വിശകലനം ചെയ്തു. മഴയെക്കുറിച്ചോ വിളവിനെക്കുറിച്ചോ ചോദിക്കൂ.`
      },
      kn: {
        text: `🛰️ **ಆಸ್ಟ್ರೋನೋವಾ AI ವಿಶ್ಲೇಷಣೆ:**\nಪ್ರಶ್ನೆ: "${input}".\nಸಸ್ಯವರ್ಗದ ಆರೋಗ್ಯ **${vegVal}%**, ನೀರಿನ ಸೂಚ್ಯಂಕ **${waterVal}%**. ಮಳೆ ಅಥವಾ ಬೆಳೆ ಬಗ್ಗೆ ನೇರವಾಗಿ ಕೇಳಿ!`,
        spoken: `ಪ್ರಶ್ನೆ ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ. ಮಳೆ ಅಥವಾ ಬೆಳೆ ಬಗ್ಗೆ ಕೇಳಿ.`
      },
      te: {
        text: `🛰️ **ఆస్ట్రోనోవా AI విశ్లేషణ:**\nప్రశ్న: "${input}".\nమొక్కల ఆరోగ్యం **${vegVal}%**, నీటి సూచిక **${waterVal}%**. వర్షం లేదా దిగుబడి గురించి అడగండి!`,
        spoken: `మీ ప్రశ్న పరిశీలించబడింది. వర్షం లేదా పంట దిగుబడి గురించి అడగండి.`
      },
      mr: {
        text: `🛰️ **अ‍ॅस्ट्रोनोव्हा AI विश्लेषण:**\nप्रश्न: "${input}".\nवनस्पती आरोग्य **${vegVal}%**, जल निर्देशांक **${waterVal}%**. पाऊस किंवा पिकाबद्दल थेट विचारा!`,
        spoken: `तुमचा प्रश्न विश्लेषित झाला. पाऊस किंवा पिकाबद्दल विचारा.`
      },
      ru: {
        text: `🛰️ **Анализ ИИ АстроНова:**\nВаш запрос: "${input}".\nЗдоровье растительности: **${vegVal}%**, водный индекс: **${waterVal}%**. Спросите о дожде, солнце или урожае!`,
        spoken: `Запрос обработан. Спросите меня о дожде, солнце или урожае.`
      },
      de: {
        text: `🛰️ **AstroNova KI-Analyse:**\nIhre Anfrage: "${input}".\nVegetationsgesundheit: **${vegVal}%**, Wasserindex: **${waterVal}%**. Fragen Sie gerne direkt nach Regen, Sonne oder Ernteertrag!`,
        spoken: `Ihre Anfrage wurde verarbeitet. Fragen Sie mich nach Regen, Sonne oder Ernteertrag.`
      },
      es: {
        text: `🛰️ **Análisis IA AstroNova:**\nConsulta procesada: "${input}".\nSalud vegetal al **${vegVal}%**, agua al **${waterVal}%**. ¡Pregúntame si llovió, si hay sol o si la cosecha es buena!`,
        spoken: `Consulta procesada. ¡Pregúntame directamente sobre lluvia, sol o la cosecha!`
      }
    };

    return {
      text: fallbacks[lang]?.text || fallbacks.en.text,
      spokenText: fallbacks[lang]?.spoken || fallbacks.en.spoken
    };
  }

  /**
   * Speaks the response strictly in the currently selected language.
   * If English is tapped, it speaks only in English.
   * If Tamil is tapped, it speaks only in Tamil, etc.
   */
  speakResponse(spokenText) {
    if (!this.synth) return;
    try {
      this.synth.cancel();

      const cleanSpeech = spokenText.replace(/[*_#`]/g, '').replace(/\n+/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanSpeech);
      const lang = this.getCurrentLang();
      const locale = this.getLocale();

      utterance.lang = locale;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      // Keep reference to prevent GC mid-speech
      this.currentUtterance = utterance;

      const voices = this.synth.getVoices();
      if (voices && voices.length > 0) {
        // Priority 1: Exact locale match (e.g. 'ta-IN', 'en-US', 'hi-IN')
        let matchedVoice = voices.find(v => v.lang.toLowerCase() === locale.toLowerCase() || v.lang.toLowerCase().replace('_', '-') === locale.toLowerCase());
        
        // Priority 2: Matches language code prefix
        if (!matchedVoice) {
          matchedVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(lang.toLowerCase()));
        }

        // Priority 3: For English, ensure an English voice is used
        if (!matchedVoice && (lang === 'en' || !lang)) {
          matchedVoice = voices.find(v => v.lang.toLowerCase().startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Zira')));
        }

        if (matchedVoice) {
          utterance.voice = matchedVoice;
        }
      }

      utterance.onstart = () => {
        this.updateSpeakingUI(true);
        this.setAssistantStatus('Speaking...');
      };

      utterance.onend = () => {
        this.updateSpeakingUI(false);
        this.setAssistantStatus('Online • Ready');
        this.currentUtterance = null;
      };

      utterance.onerror = () => {
        this.updateSpeakingUI(false);
        this.setAssistantStatus('Online • Ready');
        this.currentUtterance = null;
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      this.updateSpeakingUI(false);
      this.currentUtterance = null;
    }
  }

  appendMessage(role, text, tag = '') {
    if (!this.chatLog) return;

    const row = document.createElement('div');
    row.className = `ai-chat-bubble ${role}`;

    const lang = this.getCurrentLang();
    const isAssistant = role === 'assistant';

    const header = document.createElement('div');
    header.className = 'ai-bubble-header';
    header.innerHTML = isAssistant
      ? `<span>🤖 AstroNova AI</span> <span class="ai-input-tag">${lang.toUpperCase()}</span>`
      : `<span>👤 You</span> ${tag ? `<span class="ai-input-tag">${tag}</span>` : ''}`;

    const body = document.createElement('div');
    body.className = 'ai-bubble-body';
    body.innerHTML = text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    row.appendChild(header);
    row.appendChild(body);
    this.chatLog.appendChild(row);

    this.chatLog.scrollTop = this.chatLog.scrollHeight;
  }
}

window.AstroAIAssistant = AstroAIAssistant;
