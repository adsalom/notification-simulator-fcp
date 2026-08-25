// Main Application Controller & Export Engine for Notification FX Studio

class NotificationStudio {
  constructor() {
    this.audio = new NotificationAudioEngine();
    this.currentPlatform = 'ios_banner';
    this.state = JSON.parse(JSON.stringify(window.FX_PLATFORMS.ios_banner.defaultData));
    
    // Configuración del Lienzo (Stage)
    this.aspectRatio = '16-9'; // '16-9' | '9-16' | '1-1'
    this.canvasBg = 'bg-transparent'; // 'bg-transparent' | 'bg-green' | 'bg-blue' | 'bg-video-mock'
    
    // Estado de la Línea de Tiempo
    this.isPlaying = false;
    this.currentTime = 0; // segundos
    this.totalDuration = 4.5;
    this.playbackTimer = null;
    this.animTimeouts = [];

    this.init();
  }

  init() {
    this.renderPresetsGrid();
    this.renderIconPicker();
    this.bindEvents();
    this.loadPlatformPreset('ios_banner', false); // No reproducir al inicio para que esté visible
    this.updateLiveCard();
    this.resetTimeline();
  }

  // Renderiza las tarjetas de presets en la barra lateral
  renderPresetsGrid() {
    const grid = document.getElementById('presets-grid');
    if (!grid) return;

    grid.innerHTML = '';
    Object.values(window.FX_PLATFORMS).forEach(plat => {
      const card = document.createElement('div');
      card.className = `preset-card ${plat.id === this.currentPlatform ? 'active' : ''}`;
      card.dataset.id = plat.id;

      const iconSvg = window.FX_SVG_ICONS[plat.defaultData.presetIcon] || window.FX_SVG_ICONS.imessage;

      card.innerHTML = `
        <div class="preset-icon">${iconSvg}</div>
        <div class="preset-info">
          <span class="preset-name">${plat.name}</span>
          <span class="preset-cat">${plat.category}</span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.loadPlatformPreset(plat.id, true);
      });

      grid.appendChild(card);
    });
  }

  // Renderiza el selector de iconos SVG rápidos
  renderIconPicker() {
    const picker = document.getElementById('icon-picker-row');
    if (!picker) return;

    picker.innerHTML = '';
    Object.entries(window.FX_SVG_ICONS).forEach(([iconKey, svgString]) => {
      const chip = document.createElement('div');
      chip.className = `icon-chip ${iconKey === this.state.presetIcon ? 'active' : ''}`;
      chip.dataset.icon = iconKey;
      chip.innerHTML = svgString;

      chip.addEventListener('click', () => {
        this.state.avatarType = 'icon';
        this.state.presetIcon = iconKey;
        this.state.avatarUrl = '';
        this.syncFormFromState();
        this.updateLiveCard();
        this.highlightActiveIconChip();
      });

      picker.appendChild(chip);
    });
  }

  highlightActiveIconChip() {
    document.querySelectorAll('.icon-chip').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.icon === this.state.presetIcon && this.state.avatarType === 'icon');
    });
  }

  // Carga un preset seleccionado
  loadPlatformPreset(platId, autoPlay = true) {
    if (!window.FX_PLATFORMS[platId]) return;
    this.currentPlatform = platId;
    this.state = JSON.parse(JSON.stringify(window.FX_PLATFORMS[platId].defaultData));
    this.totalDuration = this.state.duration || 4.5;

    // Actualizar selección visual de presets
    document.querySelectorAll('.preset-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === platId);
    });

    this.syncFormFromState();
    this.highlightActiveIconChip();
    this.updateLiveCard();

    if (autoPlay) {
      this.playAnimationPreview();
      this.showToast(`Plantilla "${window.FX_PLATFORMS[platId].name}" cargada`, 'info');
    } else {
      this.resetTimeline();
    }
  }

  // Sincroniza los controles del formulario con el estado actual
  syncFormFromState() {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    };

    setVal('inp-app-name', this.state.appName);
    setVal('inp-sender', this.state.sender);
    setVal('inp-message', this.state.message);
    setVal('inp-time', this.state.time);
    setVal('inp-avatar-url', this.state.avatarUrl || '');
    setVal('inp-attachment-url', this.state.attachmentUrl || '');
    setVal('select-theme', this.state.theme);
    setVal('select-sound', this.state.sound);
    setVal('select-animation', this.state.animation);
    setVal('range-duration', this.state.duration);
    setVal('range-blur', this.state.blurIntensity || 20);
    setVal('range-radius', this.state.borderRadius || 22);

    const verifiedEl = document.getElementById('chk-verified');
    if (verifiedEl) verifiedEl.checked = !!this.state.verified;

    const durValEl = document.getElementById('val-duration');
    if (durValEl) durValEl.textContent = `${this.state.duration}s`;

    const blurValEl = document.getElementById('val-blur');
    if (blurValEl) blurValEl.textContent = `${this.state.blurIntensity || 20}px`;

    const radiusValEl = document.getElementById('val-radius');
    if (radiusValEl) radiusValEl.textContent = `${this.state.borderRadius || 22}px`;
  }

  // Asocia los eventos de la interfaz
  bindEvents() {
    // Tabs de la barra lateral
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;
        document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const panel = document.getElementById(`panel-${targetTab}`);
        if (panel) panel.classList.add('active');
      });
    });

    // Inputs en tiempo real
    const bindInput = (id, stateKey, isNumber = false) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', (e) => {
        this.state[stateKey] = isNumber ? parseFloat(e.target.value) : e.target.value;
        this.updateLiveCard();
      });
    };

    bindInput('inp-app-name', 'appName');
    bindInput('inp-sender', 'sender');
    bindInput('inp-message', 'message');
    bindInput('inp-time', 'time');
    bindInput('inp-avatar-url', 'avatarUrl');
    bindInput('inp-attachment-url', 'attachmentUrl');
    bindInput('select-theme', 'theme');
    bindInput('select-sound', 'sound');
    bindInput('select-animation', 'animation');

    // Duración
    const durSlider = document.getElementById('range-duration');
    if (durSlider) {
      durSlider.addEventListener('input', (e) => {
        this.state.duration = parseFloat(e.target.value);
        this.totalDuration = this.state.duration;
        document.getElementById('val-duration').textContent = `${this.state.duration}s`;
        this.resetTimeline();
      });
    }

    // Blur
    const blurSlider = document.getElementById('range-blur');
    if (blurSlider) {
      blurSlider.addEventListener('input', (e) => {
        this.state.blurIntensity = parseInt(e.target.value);
        document.getElementById('val-blur').textContent = `${this.state.blurIntensity}px`;
        this.updateLiveCard();
      });
    }

    // Border Radius
    const radiusSlider = document.getElementById('range-radius');
    if (radiusSlider) {
      radiusSlider.addEventListener('input', (e) => {
        this.state.borderRadius = parseInt(e.target.value);
        document.getElementById('val-radius').textContent = `${this.state.borderRadius}px`;
        this.updateLiveCard();
      });
    }

    // Checkbox Verificado
    const chkVerified = document.getElementById('chk-verified');
    if (chkVerified) {
      chkVerified.addEventListener('change', (e) => {
        this.state.verified = e.target.checked;
        this.updateLiveCard();
      });
    }

    // Subida de imagen personalizada
    const fileAvatar = document.getElementById('file-avatar-upload');
    if (fileAvatar) {
      fileAvatar.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            this.state.avatarType = 'custom_file';
            this.state.avatarUrl = event.target.result;
            document.getElementById('inp-avatar-url').value = '';
            this.highlightActiveIconChip();
            this.updateLiveCard();
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Botones de Aspect Ratio
    document.querySelectorAll('.btn-aspect').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-aspect').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setAspectRatio(btn.dataset.ratio);
      });
    });

    // Botones de Fondo del Lienzo (Stage)
    document.querySelectorAll('.bg-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.bg-pill-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.setCanvasBackground(btn.dataset.bg);
      });
    });

    // Controles de Línea de Tiempo
    const btnPlay = document.getElementById('btn-timeline-play');
    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        if (this.isPlaying) {
          this.pauseTimeline();
        } else {
          this.playAnimationPreview();
        }
      });
    }

    const btnReset = document.getElementById('btn-timeline-reset');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetTimeline());
    }

    const btnSoundTest = document.getElementById('btn-test-sound');
    if (btnSoundTest) {
      btnSoundTest.addEventListener('click', () => {
        this.audio.playSound(this.state.sound);
      });
    }

    // Botones de Exportación para FCP
    document.getElementById('btn-header-export')?.addEventListener('click', () => {
      const tab = document.querySelector('.sidebar-tab[data-tab="export"]');
      if (tab) tab.click();
    });
    document.getElementById('btn-export-green')?.addEventListener('click', () => this.exportVideo('green'));
    document.getElementById('btn-export-blue')?.addEventListener('click', () => this.exportVideo('blue'));
    document.getElementById('btn-export-alpha')?.addEventListener('click', () => this.exportVideo('transparent'));
    document.getElementById('btn-export-png')?.addEventListener('click', () => this.exportPng4k());
    document.getElementById('btn-export-wav')?.addEventListener('click', () => this.exportAudioTrack());
    document.getElementById('btn-copy-clipboard')?.addEventListener('click', () => this.copyPngToClipboard());
  }

  setAspectRatio(ratio) {
    this.aspectRatio = ratio;
    const frame = document.getElementById('video-frame');
    if (!frame) return;
    frame.className = `video-frame ratio-${ratio} ${this.canvasBg}`;
  }

  setCanvasBackground(bgClass) {
    this.canvasBg = bgClass;
    const frame = document.getElementById('video-frame');
    if (!frame) return;
    frame.className = `video-frame ratio-${this.aspectRatio} ${bgClass}`;
  }

  // Genera el HTML y renderiza la tarjeta de notificación en vivo
  updateLiveCard() {
    const container = document.getElementById('notification-card-container');
    if (!container) return;

    let iconHtml = '';
    if (this.state.avatarUrl && (this.state.avatarType === 'url' || this.state.avatarType === 'custom_file')) {
      iconHtml = `<img src="${this.state.avatarUrl}" alt="Avatar" />`;
    } else {
      iconHtml = window.FX_SVG_ICONS[this.state.presetIcon] || window.FX_SVG_ICONS.imessage;
    }

    const verifiedSvg = `
      <span class="verified-badge" title="Verificado">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </span>
    `;

    const attachmentHtml = this.state.attachmentUrl 
      ? `<img class="ios-attachment-preview" src="${this.state.attachmentUrl}" alt="Adjunto" />` 
      : '';

    let cardHtml = '';

    // Estilo 1: iOS Standard Banner
    if (this.currentPlatform === 'ios_banner' || this.currentPlatform === 'instagram_dm' || this.currentPlatform === 'instagram_like' || this.currentPlatform === 'tiktok' || this.currentPlatform === 'twitter_x') {
      const themeClass = this.state.theme === 'light' ? 'theme-light' : 'theme-dark';
      cardHtml = `
        <div class="notification-card style-ios_banner ${themeClass}" 
             style="backdrop-filter: blur(${this.state.blurIntensity}px); -webkit-backdrop-filter: blur(${this.state.blurIntensity}px); border-radius: ${this.state.borderRadius}px;">
          <div class="ios-app-icon-wrap" style="border-radius: ${Math.round(this.state.borderRadius * 0.45)}px;">
            ${iconHtml}
          </div>
          <div class="ios-content-body">
            <div class="ios-header-row">
              <span class="ios-app-name">${this.state.appName}</span>
              <span class="ios-time-ago">${this.state.time}</span>
            </div>
            <div class="ios-title-row">
              <span class="ios-sender-title">${this.escapeHtml(this.state.sender)}</span>
              ${this.state.verified ? verifiedSvg : ''}
            </div>
            <div class="ios-message-text">${this.escapeHtml(this.state.message)}</div>
            ${attachmentHtml}
          </div>
        </div>
      `;
    } 
    // Estilo 2: Dynamic Island
    else if (this.currentPlatform === 'ios_dynamic_island') {
      cardHtml = `
        <div class="notification-card style-ios_dynamic_island">
          <div class="island-icon">
            ${iconHtml}
          </div>
          <div class="island-text-area">
            <span class="island-title">${this.escapeHtml(this.state.appName)}: ${this.escapeHtml(this.state.sender)}</span>
            <span class="island-subtitle">${this.escapeHtml(this.state.message)}</span>
          </div>
          <div class="island-badge-right">${this.escapeHtml(this.state.time)}</div>
        </div>
      `;
    }
    // Estilo 3: macOS Sequoia / Sonoma Desktop Banner
    else if (this.currentPlatform === 'macos_banner') {
      cardHtml = `
        <div class="notification-card style-macos_banner" style="border-radius: ${this.state.borderRadius}px;">
          <div class="macos-top-row">
            <div class="macos-icon" style="border-radius: ${Math.round(this.state.borderRadius * 0.4)}px;">
              ${iconHtml}
            </div>
            <div class="macos-header-info">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span class="macos-app-title">${this.escapeHtml(this.state.appName)}</span>
                <span class="macos-time">${this.escapeHtml(this.state.time)}</span>
              </div>
              <div style="font-size: 13px; font-weight: 600; margin-top: 1px;">${this.escapeHtml(this.state.sender)}</div>
            </div>
          </div>
          <div class="macos-msg-body">${this.escapeHtml(this.state.message)}</div>
          ${attachmentHtml}
          <div class="macos-actions-row">
            <button class="macos-btn">Opciones</button>
            <button class="macos-btn" style="background: rgba(59, 130, 246, 0.4);">Abrir</button>
          </div>
        </div>
      `;
    }
    // Estilo 4: WhatsApp
    else if (this.currentPlatform === 'whatsapp') {
      cardHtml = `
        <div class="notification-card style-whatsapp" style="border-radius: ${this.state.borderRadius}px;">
          <div class="whatsapp-avatar-badge">
            <div class="whatsapp-avatar">
              ${iconHtml}
            </div>
            <div class="whatsapp-corner-badge">
              <svg viewBox="0 0 100 100" fill="none"><path d="M50 18C32.327 18 18 32.327 18 50C18 56.12 19.742 61.85 22.77 66.72L19 82L34.67 78.33C39.31 80.99 44.52 82 50 82C67.673 82 82 67.673 82 50C82 32.327 67.673 18 50 18ZM68.14 63.36C67.38 65.48 64.38 67.24 62.06 67.74C60.48 68.08 58.42 68.34 51.52 65.48C42.7 61.82 37.04 52.88 36.6 52.3C36.18 51.72 33.04 47.54 33.04 43.22C33.04 38.9 35.22 36.8 36.1 35.9C36.82 35.16 38.02 34.82 39.16 34.82C39.52 34.82 39.86 34.84 40.16 34.86C41.04 34.9 41.48 34.96 42.06 36.34C42.78 38.08 44.54 42.38 44.76 42.82C44.98 43.26 45.14 43.86 44.84 44.44C44.56 45.04 44.38 45.28 43.94 45.8C43.5 46.32 43.1 46.68 42.66 47.22C42.26 47.68 41.8 48.18 42.32 49.06C42.84 49.94 44.62 52.86 47.24 55.2C50.62 58.22 53.38 59.18 54.38 59.6C55.14 59.92 56.06 59.84 56.62 59.24C57.34 58.46 58.22 57.22 59.12 55.96C59.76 55.06 60.58 54.94 61.42 55.26C62.28 55.56 66.86 57.82 67.8 58.3C68.74 58.78 69.36 59.02 69.58 59.4C69.8 59.78 69.8 61.24 68.14 63.36Z" fill="white"/></svg>
            </div>
          </div>
          <div class="ios-content-body">
            <div class="ios-header-row">
              <span class="ios-app-name" style="color: #25D366; font-weight: 700;">WhatsApp</span>
              <span class="ios-time-ago">${this.state.time}</span>
            </div>
            <div class="ios-title-row">
              <span class="ios-sender-title">${this.escapeHtml(this.state.sender)}</span>
              ${this.state.verified ? verifiedSvg : ''}
            </div>
            <div class="ios-message-text">${this.escapeHtml(this.state.message)}</div>
            ${attachmentHtml}
          </div>
        </div>
      `;
    }
    // Estilo 5: YouTube
    else if (this.currentPlatform === 'youtube') {
      cardHtml = `
        <div class="notification-card style-ios_banner theme-dark" style="border-radius: ${this.state.borderRadius}px; border-left: 4px solid #FF0000;">
          <div class="ios-app-icon-wrap">
            ${iconHtml}
          </div>
          <div class="ios-content-body">
            <div class="ios-header-row">
              <span class="ios-app-name" style="color: #FF0000; font-weight: 700;">YouTube</span>
              <span class="ios-time-ago">${this.state.time}</span>
            </div>
            <div class="ios-title-row">
              <span class="ios-sender-title">${this.escapeHtml(this.state.sender)}</span>
              ${this.state.verified ? verifiedSvg : ''}
            </div>
            <div class="ios-message-text">${this.escapeHtml(this.state.message)}</div>
            ${attachmentHtml}
          </div>
        </div>
      `;
    }
    // Estilo 6: Discord
    else if (this.currentPlatform === 'discord') {
      cardHtml = `
        <div class="notification-card style-discord">
          <div class="ios-app-icon-wrap" style="width: 38px; height: 38px; border-radius: 50%;">
            ${iconHtml}
          </div>
          <div class="ios-content-body">
            <div class="ios-header-row">
              <span style="font-size: 11px; font-weight: 700; color: #5865F2;">Discord</span>
              <span style="font-size: 10px; color: #949ba4;">${this.state.time}</span>
            </div>
            <div style="font-size: 13.5px; font-weight: 700; color: #ffffff;">${this.escapeHtml(this.state.sender)}</div>
            <div style="font-size: 12.5px; color: #dbdee1; margin-top: 2px;">${this.escapeHtml(this.state.message)}</div>
          </div>
        </div>
      `;
    }
    // Estilo 7: Android Material You
    else if (this.currentPlatform === 'android_material') {
      cardHtml = `
        <div class="notification-card style-android_material">
          <div class="ios-app-icon-wrap" style="border-radius: 50%; width: 38px; height: 38px;">
            ${iconHtml}
          </div>
          <div class="ios-content-body">
            <div class="ios-header-row">
              <span style="font-size: 11px; font-weight: 600; color: #d0bcff;">${this.state.appName} • ${this.state.time}</span>
            </div>
            <div class="ios-sender-title" style="color: #fff; font-size: 13.5px;">${this.escapeHtml(this.state.sender)}</div>
            <div class="ios-message-text" style="color: #cac4d0; font-size: 12.5px;">${this.escapeHtml(this.state.message)}</div>
          </div>
        </div>
      `;
    }

    container.innerHTML = cardHtml;
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ====================================================
  // SISTEMA DE ANIMACIÓN Y TIMELINE
  // ====================================================

  clearAllAnimTimeouts() {
    this.animTimeouts.forEach(t => clearTimeout(t));
    this.animTimeouts = [];
  }

  playAnimationPreview() {
    this.resetTimeline();
    this.isPlaying = true;
    this.clearAllAnimTimeouts();

    const playBtn = document.getElementById('btn-timeline-play');
    if (playBtn) playBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="4" width="4" height="16" rx="1"/>
        <rect x="14" y="4" width="4" height="16" rx="1"/>
      </svg>
    `;

    const wrapper = document.getElementById('notification-wrapper');
    const animType = this.state.animation || 'ios_bounce_down';
    const totalMs = this.state.duration * 1000;
    const enterDelayMs = (this.state.enterDelay || 0.5) * 1000;
    const exitDelayMs = (this.state.exitDelay || 0.5) * 1000;
    const soundTimingMs = (this.state.soundTiming || 0.6) * 1000;

    // Estado inicial: oculto para iniciar animación
    wrapper.className = 'notification-wrapper anim-hidden';

    // 1. Entrada
    this.animTimeouts.push(setTimeout(() => {
      if (!this.isPlaying) return;
      wrapper.className = `notification-wrapper anim-enter-${animType}`;
    }, enterDelayMs));

    // 2. Disparo de sonido sincronizado
    this.animTimeouts.push(setTimeout(() => {
      if (!this.isPlaying) return;
      this.audio.playSound(this.state.sound);
    }, enterDelayMs + soundTimingMs));

    // 3. Salida
    this.animTimeouts.push(setTimeout(() => {
      if (!this.isPlaying) return;
      wrapper.className = `notification-wrapper anim-exit-${animType}`;
    }, Math.max(enterDelayMs + 1000, totalMs - exitDelayMs)));

    // 4. Finalización -> Restablecer a visible para que el editor pueda seguir diseñando
    const startTime = Date.now();
    this.playbackTimer = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      this.currentTime = Math.min(elapsed, this.totalDuration);
      
      const pct = (this.currentTime / this.totalDuration) * 100;
      const progressEl = document.getElementById('timeline-progress');
      if (progressEl) progressEl.style.width = `${pct}%`;

      const curTimeEl = document.getElementById('lbl-cur-time');
      if (curTimeEl) curTimeEl.textContent = `${this.currentTime.toFixed(1)}s`;

      if (elapsed >= this.totalDuration) {
        clearInterval(this.playbackTimer);
        this.isPlaying = false;
        if (playBtn) playBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        `;
        // Restablecer a estado visible de reposo
        wrapper.className = 'notification-wrapper';
      }
    }, 50);
  }

  pauseTimeline() {
    this.isPlaying = false;
    clearInterval(this.playbackTimer);
    this.clearAllAnimTimeouts();
    const playBtn = document.getElementById('btn-timeline-play');
    if (playBtn) playBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3"/>
      </svg>
    `;
    const wrapper = document.getElementById('notification-wrapper');
    if (wrapper) wrapper.className = 'notification-wrapper';
  }

  resetTimeline() {
    this.pauseTimeline();
    this.currentTime = 0;
    const progressEl = document.getElementById('timeline-progress');
    if (progressEl) progressEl.style.width = `0%`;
    const curTimeEl = document.getElementById('lbl-cur-time');
    if (curTimeEl) curTimeEl.textContent = `0.0s`;
    const totalTimeEl = document.getElementById('lbl-total-time');
    if (totalTimeEl) totalTimeEl.textContent = `${this.totalDuration.toFixed(1)}s`;

    const wrapper = document.getElementById('notification-wrapper');
    if (wrapper) wrapper.className = 'notification-wrapper';
  }

  // ====================================================
  // MOTOR DE EXPORTACIÓN PARA FINAL CUT PRO
  // ====================================================

  // Captura la tarjeta HTML renderizada a un Canvas de alta resolución
  async captureCardCanvas(scale = 3) {
    const card = document.querySelector('.notification-card');
    if (!card) throw new Error('No se encontró el elemento de notificación');

    // Asegurar que el contenedor esté en estado visible y sin transformaciones activas
    const wrapper = document.getElementById('notification-wrapper');
    if (wrapper) wrapper.className = 'notification-wrapper';

    // Método A: Usar html2canvas si está disponible (Pixel-Perfect DOM capture)
    if (typeof window.html2canvas === 'function') {
      const canvas = await window.html2canvas(card, {
        scale: scale,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
        imageTimeout: 0
      });
      return canvas;
    }

    // Método B: Fallback vía SVG foreignObject
    const rect = card.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = Math.round((rect.width + 20) * scale);
    canvas.height = Math.round((rect.height + 20) * scale);
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    const styles = Array.from(document.styleSheets)
      .map(sheet => {
        try { return Array.from(sheet.cssRules).map(r => r.cssText).join(' '); } catch (e) { return ''; }
      }).join(' ');

    const svgData = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${rect.width + 20}" height="${rect.height + 20}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml" style="padding: 10px; display: flex; align-items: center; justify-content: center;">
            <style>${styles}</style>
            ${card.outerHTML}
          </div>
        </foreignObject>
      </svg>
    `;

    return new Promise((resolve, reject) => {
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(err);
      };

      img.src = url;
    });
  }

  // 1. Exportación de Imagen PNG 4K con Fondo Transparente (Retina Alpha)
  async exportPng4k() {
    this.showExportModal('Generando Imagen PNG 4K con Canal Alfa...', 30);
    try {
      const canvas = await this.captureCardCanvas(4);
      this.updateExportProgress(80);

      canvas.toBlob(blob => {
        this.updateExportProgress(100);
        setTimeout(() => {
          this.hideExportModal();
          this.downloadBlob(blob, `Notificacion_${this.state.appName}_4K_Alpha.png`);
          this.showToast('PNG 4K transparente descargado con éxito', 'success');
        }, 300);
      }, 'image/png');

    } catch (e) {
      console.error(e);
      this.hideExportModal();
      this.showToast('Error al exportar PNG: ' + e.message, 'error');
    }
  }

  // 2. Exportación de Video en formato .MP4 a 60 FPS (Fondo Verde / Azul Chroma Key o Transparente)
  async exportVideo(bgMode) {
    const bgName = bgMode === 'green' ? 'Fondo Verde (Chroma Key)' : (bgMode === 'blue' ? 'Fondo Azul' : 'Transparente');
    this.showExportModal(`Preparando Render de Video MP4 60 FPS (${bgName})...`, 10);

    const prevBg = this.canvasBg;
    if (bgMode === 'green') this.setCanvasBackground('bg-green');
    else if (bgMode === 'blue') this.setCanvasBackground('bg-blue');
    else this.setCanvasBackground('bg-transparent');

    try {
      // 1. Capturar la tarjeta con todos sus elementos internos y estilos
      const cardCanvas = await this.captureCardCanvas(3);
      this.updateExportProgress(20);

      // Dimensiones según la relación de aspecto seleccionada
      const width = this.aspectRatio === '9-16' ? 1080 : 1920;
      const height = this.aspectRatio === '9-16' ? 1920 : (this.aspectRatio === '1-1' ? 1080 : 1080);

      const recordCanvas = document.createElement('canvas');
      recordCanvas.width = width;
      recordCanvas.height = height;
      const recordCtx = recordCanvas.getContext('2d', { willReadFrequently: false });

      // Dimensiones de renderizado de la tarjeta en el video final
      const targetCardWidth = this.aspectRatio === '9-16' 
        ? Math.min(width * 0.90, 960) 
        : (this.aspectRatio === '1-1' ? Math.min(width * 0.82, 880) : Math.min(width * 0.48, 920));
      const targetCardHeight = targetCardWidth * (cardCanvas.height / cardCanvas.width);

      // Posición de reposo de la notificación
      let baseRestX = (width - targetCardWidth) / 2;
      let baseRestY = this.aspectRatio === '9-16' ? height * 0.08 : height * 0.07;
      if (this.currentPlatform === 'macos_banner') {
        baseRestX = width - targetCardWidth - (width * 0.03);
        baseRestY = height * 0.06;
      }

      const animType = this.state.animation || 'ios_bounce_down';
      const totalDurationSec = this.state.duration;
      const fps = 60;
      const totalFrames = Math.round(totalDurationSec * fps);
      const enterDelayMs = (this.state.enterDelay || 0.5) * 1000;
      const exitDelayMs = (this.state.exitDelay || 0.5) * 1000;
      const enterDurationMs = 600;
      const exitDurationMs = 500;
      const durationMs = totalDurationSec * 1000;
      const exitStartMs = Math.max(enterDelayMs + 1000, durationMs - exitDelayMs);

      // Funciones de Easing
      const easeOutBack = (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
      };
      const easeInBack = (x) => {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return c3 * x * x * x - c1 * x * x;
      };
      const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
      const easeInCubic = (x) => x * x * x;

      // Función de dibujo de cada frame
      const drawFrameAtTime = (elapsed) => {
        // 1. Limpiar o rellenar el fondo
        if (bgMode === 'green') {
          recordCtx.fillStyle = '#00FF00';
          recordCtx.fillRect(0, 0, width, height);
        } else if (bgMode === 'blue') {
          recordCtx.fillStyle = '#0000FF';
          recordCtx.fillRect(0, 0, width, height);
        } else {
          recordCtx.clearRect(0, 0, width, height);
        }

        // 2. Calcular cinemática de la animación
        let opacity = 0;
        let currentX = baseRestX;
        let currentY = baseRestY;
        let scaleX = 1;
        let scaleY = 1;

        if (elapsed < enterDelayMs) {
          opacity = 0;
        } else if (elapsed < enterDelayMs + enterDurationMs) {
          const p = Math.min(1, Math.max(0, (elapsed - enterDelayMs) / enterDurationMs));

          if (animType === 'ios_bounce_down') {
            const eased = easeOutBack(p);
            currentY = baseRestY - (1 - eased) * 180;
            scaleX = scaleY = 0.85 + 0.15 * Math.min(1.05, eased);
            opacity = Math.min(1, p * 2.5);
          } else if (animType === 'island_expand') {
            const eased = easeOutBack(p);
            scaleX = scaleY = 0.35 + 0.65 * eased;
            currentY = baseRestY - (1 - eased) * 50;
            opacity = Math.min(1, p * 3);
          } else if (animType === 'macos_slide_right') {
            const eased = easeOutCubic(p);
            currentX = baseRestX + (1 - eased) * 260;
            opacity = p;
          } else {
            const eased = easeOutCubic(p);
            scaleX = scaleY = 0.88 + 0.12 * eased;
            opacity = p;
          }

        } else if (elapsed < exitStartMs) {
          opacity = 1;
          currentX = baseRestX;
          currentY = baseRestY;
          scaleX = scaleY = 1;

        } else if (elapsed < exitStartMs + exitDurationMs) {
          const p = Math.min(1, Math.max(0, (elapsed - exitStartMs) / exitDurationMs));

          if (animType === 'ios_bounce_down') {
            const eased = easeInBack(p);
            currentY = baseRestY - eased * 160;
            scaleX = scaleY = 1 - 0.15 * p;
            opacity = Math.max(0, 1 - p);
          } else if (animType === 'island_expand') {
            const eased = easeInCubic(p);
            scaleX = scaleY = Math.max(0.3, 1 - 0.7 * eased);
            currentY = baseRestY - eased * 40;
            opacity = Math.max(0, 1 - p);
          } else if (animType === 'macos_slide_right') {
            const eased = easeInCubic(p);
            currentX = baseRestX + eased * 260;
            opacity = Math.max(0, 1 - p);
          } else {
            const eased = easeInCubic(p);
            scaleX = scaleY = Math.max(0.8, 1 - 0.2 * eased);
            opacity = Math.max(0, 1 - p);
          }

        } else {
          opacity = 0;
        }

        // 3. Dibujar la tarjeta completa con su contenido real
        if (opacity > 0) {
          recordCtx.save();
          recordCtx.globalAlpha = Math.max(0, Math.min(1, opacity));
          
          const centerX = currentX + targetCardWidth / 2;
          const centerY = currentY + targetCardHeight / 2;
          
          recordCtx.translate(centerX, centerY);
          recordCtx.scale(scaleX, scaleY);
          
          recordCtx.drawImage(
            cardCanvas, 
            -targetCardWidth / 2, 
            -targetCardHeight / 2, 
            targetCardWidth, 
            targetCardHeight
          );
          
          recordCtx.restore();
        }
      };

      // MÉTODO 1: WebCodecs + MP4 Muxer (Genera archivo .MP4 nativo H.264 + Audio AAC 48kHz para Final Cut Pro)
      if (typeof window.Mp4Muxer !== 'undefined' && typeof window.VideoEncoder === 'function') {
        
        // 1. Preparar y sintetizar pista de audio AAC a 48kHz
        let hasAudio = false;
        let audioEncoder = null;
        let audioBuffer = null;

        const soundTimingSec = (this.state.enterDelay || 0.5) + (this.state.soundTiming || 0.6);

        if (typeof window.AudioEncoder === 'function' && typeof window.AudioData === 'function') {
          try {
            audioBuffer = await this.audio.renderOfflineBuffer(this.state.sound, totalDurationSec, soundTimingSec);
            const isAudioSupported = await AudioEncoder.isConfigSupported({
              codec: 'mp4a.40.2',
              numberOfChannels: 2,
              sampleRate: 48000,
              bitrate: 192000
            });
            if (isAudioSupported.supported) {
              hasAudio = true;
            }
          } catch (err) {
            console.warn('AudioEncoder no disponible, continuando solo video:', err);
          }
        }

        const muxer = new window.Mp4Muxer.Muxer({
          target: new window.Mp4Muxer.ArrayBufferTarget(),
          video: {
            codec: 'avc',
            width: width,
            height: height
          },
          audio: hasAudio ? {
            codec: 'aac',
            numberOfChannels: 2,
            sampleRate: 48000
          } : undefined,
          fastStart: 'in-memory',
          firstTimestampBehavior: 'offset'
        });

        const videoEncoder = new VideoEncoder({
          output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
          error: (e) => console.error('VideoEncoder Error:', e)
        });

        await videoEncoder.configure({
          codec: 'avc1.4d002a', // H.264 Main Profile
          width: width,
          height: height,
          bitrate: 20_000_000,
          framerate: fps
        });

        // 2. Encodear Audio AAC si está activo
        if (hasAudio && audioBuffer) {
          audioEncoder = new AudioEncoder({
            output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
            error: (e) => console.error('AudioEncoder Error:', e)
          });

          await audioEncoder.configure({
            codec: 'mp4a.40.2',
            numberOfChannels: 2,
            sampleRate: 48000,
            bitrate: 192000
          });

          const totalSamples = audioBuffer.length;
          const samplesPerFrame = 1024;
          const leftChan = audioBuffer.getChannelData(0);
          const rightChan = audioBuffer.getChannelData(1);

          for (let offset = 0; offset < totalSamples; offset += samplesPerFrame) {
            const frameCount = Math.min(samplesPerFrame, totalSamples - offset);
            const interleaved = new Float32Array(frameCount * 2);
            for (let i = 0; i < frameCount; i++) {
              interleaved[i * 2] = leftChan[offset + i];
              interleaved[i * 2 + 1] = rightChan[offset + i];
            }

            const audioData = new AudioData({
              format: 'f32',
              sampleRate: 48000,
              numberOfFrames: frameCount,
              numberOfChannels: 2,
              timestamp: Math.round((offset / 48000) * 1_000_000),
              data: interleaved
            });

            audioEncoder.encode(audioData);
            audioData.close();
          }

          await audioEncoder.flush();
        }

        // 3. Renderizar y encodear los frames de video a 60 FPS
        for (let frame = 0; frame < totalFrames; frame++) {
          const elapsed = (frame / fps) * 1000;
          drawFrameAtTime(elapsed);

          const timestampMicros = Math.round((frame / fps) * 1_000_000);
          const durationMicros = Math.round((1 / fps) * 1_000_000);
          
          const videoFrame = new VideoFrame(recordCanvas, {
            timestamp: timestampMicros,
            duration: durationMicros
          });

          videoEncoder.encode(videoFrame, { keyFrame: frame % (fps * 2) === 0 });
          videoFrame.close();

          if (frame % 10 === 0) {
            const pct = 20 + Math.round((frame / totalFrames) * 75);
            this.updateExportProgress(pct);
            await new Promise(r => setTimeout(r, 0));
          }
        }

        this.updateExportProgress(96);
        await videoEncoder.flush();
        muxer.finalize();

        const mp4Buffer = muxer.target.buffer;
        const mp4Blob = new Blob([mp4Buffer], { type: 'video/mp4' });

        this.updateExportProgress(100);
        this.setCanvasBackground(prevBg);

        setTimeout(() => {
          this.hideExportModal();
          this.downloadBlob(mp4Blob, `Notificacion_${this.state.appName}_${bgMode}_60FPS.mp4`);
          this.showToast(`¡Video MP4 60 FPS con Audio descargado! Listo para Final Cut Pro`, 'success');
        }, 300);

        return;
      }

      // MÉTODO 2: Fallback vía MediaRecorder si WebCodecs no estuviera disponible
      const stream = recordCanvas.captureStream(60);
      let mimeType = 'video/mp4;codecs=avc1';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = 'video/webm';

      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';

      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType,
        videoBitsPerSecond: 20000000
      });

      const chunks = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        this.updateExportProgress(100);
        this.setCanvasBackground(prevBg);

        setTimeout(() => {
          this.hideExportModal();
          this.downloadBlob(videoBlob, `Notificacion_${this.state.appName}_${bgMode}_60FPS.${ext}`);
          this.showToast(`Video ${ext.toUpperCase()} listo para Final Cut Pro`, 'success');
        }, 400);
      };

      recorder.start();
      const startTime = performance.now();

      const animLoop = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(100, Math.round((elapsed / durationMs) * 100));
        this.updateExportProgress(progress);

        drawFrameAtTime(elapsed);

        if (elapsed < durationMs) {
          requestAnimationFrame(animLoop);
        } else {
          recorder.stop();
        }
      };

      requestAnimationFrame(animLoop);

    } catch (e) {
      console.error(e);
      this.setCanvasBackground(prevBg);
      this.hideExportModal();
      this.showToast('Error en grabación: ' + e.message, 'error');
    }
  }

  // 3. Exporta la pista de Audio como archivo WAV 48kHz para Final Cut Pro
  async exportAudioTrack() {
    try {
      this.showToast('Generando pista WAV a 48kHz...', 'info');
      const wavBlob = await this.audio.exportSoundAsWav(this.state.sound);
      this.downloadBlob(wavBlob, `Sonido_${this.state.sound}_48kHz_FCP.wav`);
      this.showToast('Pista WAV descargada con éxito', 'success');
    } catch (e) {
      console.error(e);
      this.showToast('Error al exportar audio: ' + e.message, 'error');
    }
  }

  // 4. Copiar PNG directamente al portapapeles de macOS
  async copyPngToClipboard() {
    try {
      const canvas = await this.captureCardCanvas(2);
      canvas.toBlob(async blob => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          this.showToast('¡Imagen PNG copiada al portapapeles!', 'success');
        } catch (err) {
          this.downloadBlob(blob, `Notificacion_${this.state.appName}.png`);
          this.showToast('Descargando imagen PNG...', 'info');
        }
      }, 'image/png');

    } catch (e) {
      console.error(e);
      this.showToast('No se pudo copiar: ' + e.message, 'error');
    }
  }

  // Utilitarios de UI y Descarga
  roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  showExportModal(title, initialProgress = 0) {
    const modal = document.getElementById('export-modal-backdrop');
    if (!modal) return;
    document.getElementById('modal-export-title').textContent = title;
    this.updateExportProgress(initialProgress);
    modal.classList.add('show');
  }

  updateExportProgress(pct) {
    const fill = document.getElementById('modal-progress-fill');
    const label = document.getElementById('modal-progress-label');
    if (fill) fill.style.width = `${pct}%`;
    if (label) label.textContent = `${pct}%`;
  }

  hideExportModal() {
    const modal = document.getElementById('export-modal-backdrop');
    if (modal) modal.classList.remove('show');
  }

  showToast(message, type = 'info') {
    let toast = document.getElementById('toast-msg');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-msg';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }
    toast.className = `toast-msg show ${type}`;
    toast.textContent = message;
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

// Iniciar aplicación al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
  window.fxStudio = new NotificationStudio();
});
