// Motor de síntesis y generación de efectos de sonido para Notification FX Studio
// Utiliza Web Audio API (48kHz Studio Quality) y exportador a formato WAV para Final Cut Pro

class NotificationAudioEngine {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 48000 });
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Reproduce un sonido en tiempo real
  playSound(soundId) {
    try {
      const ctx = this.getAudioContext();
      this._renderSoundToDestination(soundId, ctx, ctx.destination, 0);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Genera un archivo WAV en memoria listo para descargar e importar en Final Cut Pro
  async exportSoundAsWav(soundId) {
    const sampleRate = 48000;
    const duration = 2.0; // 2 segundos de buffer con cola de reverberación
    const offlineCtx = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

    this._renderSoundToDestination(soundId, offlineCtx, offlineCtx.destination, 0.05);

    const renderedBuffer = await offlineCtx.startRendering();
    return this._audioBufferToWavBlob(renderedBuffer);
  }

  // Genera un AudioBuffer completo sincronizado para el video
  async renderOfflineBuffer(soundId, totalDurationSec = 4.5, triggerTimeSec = 0.6) {
    const sampleRate = 48000;
    const offlineCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * Math.max(1, totalDurationSec)), sampleRate);
    this._renderSoundToDestination(soundId, offlineCtx, offlineCtx.destination, triggerTimeSec);
    return await offlineCtx.startRendering();
  }

  // Motor interno de síntesis acústica
  _renderSoundToDestination(soundId, ctx, destination, startTime) {
    const now = startTime || ctx.currentTime;

    switch (soundId) {
      case 'apple_tritone':
        this._synthTritone(ctx, destination, now);
        break;
      case 'apple_ding':
        this._synthAppleDing(ctx, destination, now);
        break;
      case 'macos_submarine':
        this._synthMacSubmarine(ctx, destination, now);
        break;
      case 'whatsapp_whistle':
        this._synthWhatsApp(ctx, destination, now);
        break;
      case 'discord_ping':
        this._synthDiscordPing(ctx, destination, now);
        break;
      case 'pop_soft':
        this._synthPopSoft(ctx, destination, now);
        break;
      case 'pop_chime':
        this._synthPopChime(ctx, destination, now);
        break;
      case 'android_pop':
        this._synthAndroidPop(ctx, destination, now);
        break;
      default:
        this._synthAppleDing(ctx, destination, now);
        break;
    }
  }

  // 1. Apple Tri-tone clásico (G5, B5, D6)
  _synthTritone(ctx, dest, t0) {
    const notes = [
      { freq: 783.99, time: 0.00, dur: 0.28 }, // G5
      { freq: 987.77, time: 0.12, dur: 0.28 }, // B5
      { freq: 1174.66, time: 0.24, dur: 0.65 }  // D6
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, t0 + note.time);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(note.freq * 2, t0 + note.time);

      gain.gain.setValueAtTime(0.001, t0 + note.time);
      gain.gain.exponentialRampToValueAtTime(0.35, t0 + note.time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.time + note.dur);

      overtoneGain.gain.setValueAtTime(0.001, t0 + note.time);
      overtoneGain.gain.exponentialRampToValueAtTime(0.08, t0 + note.time + 0.01);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.time + note.dur * 0.5);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(dest);
      overtoneGain.connect(dest);

      osc.start(t0 + note.time);
      overtone.start(t0 + note.time);
      osc.stop(t0 + note.time + note.dur + 0.05);
      overtone.stop(t0 + note.time + note.dur + 0.05);
    });
  }

  // 2. Apple Ding (Campana nítida)
  _synthAppleDing(ctx, dest, t0) {
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.5, t0); // C6

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2093.0, t0); // C7 armónico

    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.4, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.8);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc.start(t0);
    osc2.start(t0);
    osc.stop(t0 + 0.85);
    osc2.stop(t0 + 0.85);
  }

  // 3. macOS Submarine / Water Drop
  _synthMacSubmarine(ctx, dest, t0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, t0);
    osc.frequency.exponentialRampToValueAtTime(780, t0 + 0.08);
    osc.frequency.exponentialRampToValueAtTime(440, t0 + 0.35);

    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.45, t0 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.45);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t0);
    osc.stop(t0 + 0.5);
  }

  // 4. WhatsApp Whistle / Tone
  _synthWhatsApp(ctx, dest, t0) {
    const notes = [
      { freq: 1318.51, time: 0.0, dur: 0.12 }, // E6
      { freq: 1760.00, time: 0.10, dur: 0.28 }  // A6
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(note.freq, t0 + note.time);

      gain.gain.setValueAtTime(0.001, t0 + note.time);
      gain.gain.exponentialRampToValueAtTime(0.35, t0 + note.time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.time + note.dur);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t0 + note.time);
      osc.stop(t0 + note.time + note.dur + 0.05);
    });
  }

  // 5. Discord Ping
  _synthDiscordPing(ctx, dest, t0) {
    const notes = [
      { freq: 1244.51, time: 0.0, dur: 0.12 }, // D#6
      { freq: 830.61, time: 0.09, dur: 0.35 }  // G#5
    ];

    notes.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, t0 + note.time);

      gain.gain.setValueAtTime(0.001, t0 + note.time);
      gain.gain.exponentialRampToValueAtTime(0.3, t0 + note.time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + note.time + note.dur);

      osc.connect(gain);
      gain.connect(dest);

      osc.start(t0 + note.time);
      osc.stop(t0 + note.time + note.dur + 0.05);
    });
  }

  // 6. Pop suave
  _synthPopSoft(ctx, dest, t0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t0);
    osc.frequency.exponentialRampToValueAtTime(1400, t0 + 0.04);
    osc.frequency.exponentialRampToValueAtTime(800, t0 + 0.15);

    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.4, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.25);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t0);
    osc.stop(t0 + 0.3);
  }

  // 7. Pop Chime
  _synthPopChime(ctx, dest, t0) {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1174.66, t0); // D6
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1760.00, t0 + 0.05); // A6

    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(dest);

    osc1.start(t0);
    osc2.start(t0 + 0.05);
    osc1.stop(t0 + 0.55);
    osc2.stop(t0 + 0.55);
  }

  // 8. Android Pop
  _synthAndroidPop(ctx, dest, t0) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t0);
    osc.frequency.exponentialRampToValueAtTime(1200, t0 + 0.03);
    osc.frequency.exponentialRampToValueAtTime(600, t0 + 0.12);

    gain.gain.setValueAtTime(0.001, t0);
    gain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);

    osc.connect(gain);
    gain.connect(dest);

    osc.start(t0);
    osc.stop(t0 + 0.25);
  }

  // Conversor AudioBuffer -> WAV Blob
  _audioBufferToWavBlob(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const outBuffer = new ArrayBuffer(length);
    const view = new DataView(outBuffer);
    const channels = [];
    let sample = 0;
    let offset = 0;
    let pos = 0;

    // Header RIFF
    writeString(view, pos, 'RIFF'); pos += 4;
    view.setUint32(pos, length - 8, true); pos += 4;
    writeString(view, pos, 'WAVE'); pos += 4;
    writeString(view, pos, 'fmt '); pos += 4;
    view.setUint32(pos, 16, true); pos += 4; // SubChunk1Size (16 para PCM)
    view.setUint16(pos, 1, true); pos += 2; // AudioFormat (1 = PCM)
    view.setUint16(pos, numOfChan, true); pos += 2;
    view.setUint32(pos, buffer.sampleRate, true); pos += 4;
    view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true); pos += 4; // ByteRate
    view.setUint16(pos, numOfChan * 2, true); pos += 2; // BlockAlign
    view.setUint16(pos, 16, true); pos += 2; // BitsPerSample
    writeString(view, pos, 'data'); pos += 4;
    view.setUint32(pos, length - pos - 4, true); pos += 4;

    for (let i = 0; i < buffer.numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }

    while (offset < buffer.length) {
      for (let i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
        view.setInt16(pos, sample, true);
        pos += 2;
      }
      offset++;
    }

    return new Blob([outBuffer], { type: 'audio/wav' });

    function writeString(view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    }
  }
}

window.NotificationAudioEngine = NotificationAudioEngine;
