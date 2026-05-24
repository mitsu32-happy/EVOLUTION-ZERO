const INTRO_SEEN_KEY = 'ez_intro_seen_v1';
const INTRO_VIDEO_PATH = 'assets/video/intro/opening_intro.mp4';
const INTRO_AUDIO_PATH = 'assets/audio/intro/opening_intro.mp3';

function assetUrl(path) {
  return `${import.meta.env.BASE_URL}${path}`;
}

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function getParams() {
  try {
    return new URLSearchParams(globalThis.location?.search ?? '');
  } catch {
    return new URLSearchParams();
  }
}

export class IntroOverlay {
  constructor({ audioManager = null, saveManager = null, onComplete = null } = {}) {
    this.audioManager = audioManager;
    this.saveManager = saveManager;
    this.onComplete = onComplete;
    this.mode = 'hidden';
    this.shouldMarkSeen = false;
    this.isFinishing = false;
    this.audioEnabled = true;
    this.audioBufferPromise = null;
    this.audioContext = null;
    this.audioGain = null;
    this.audioSource = null;
    this.audioStartedAt = 0;
    this.audioOffset = 0;

    this.root = document.createElement('div');
    this.root.className = 'ez-intro-overlay';
    this.root.hidden = true;

    this.gate = document.createElement('button');
    this.gate.type = 'button';
    this.gate.className = 'ez-intro-gate';
    this.gate.setAttribute('aria-label', 'Start opening intro');
    this.gate.innerHTML = '<span>TAP TO START</span>';

    this.video = document.createElement('video');
    this.video.className = 'ez-intro-video';
    this.video.src = assetUrl(INTRO_VIDEO_PATH);
    this.video.preload = 'auto';
    this.video.playsInline = true;
    this.video.muted = true;
    this.video.controls = false;
    this.video.loop = false;
    this.video.setAttribute('playsinline', '');
    this.video.setAttribute('webkit-playsinline', '');

    this.audio = document.createElement('audio');
    this.audio.className = 'ez-intro-audio';
    this.audio.src = assetUrl(INTRO_AUDIO_PATH);
    this.audio.preload = 'auto';

    this.preloadIntroAudioBuffer();

    this.skipButton = document.createElement('button');
    this.skipButton.type = 'button';
    this.skipButton.className = 'ez-intro-skip';
    this.skipButton.textContent = 'SKIP';

    this.audioToggle = document.createElement('button');
    this.audioToggle.type = 'button';
    this.audioToggle.className = 'ez-intro-audio-toggle';
    this.audioToggle.setAttribute('aria-pressed', 'false');
    this.updateAudioToggleLabel();

    this.root.append(this.video, this.gate, this.skipButton, this.audioToggle, this.audio);
    (document.getElementById('app') ?? document.body).appendChild(this.root);

    this.handleGatePointer = (event) => {
      event.preventDefault();
      if (this.mode !== 'introGate') {
        return;
      }
      this.startPlayback();
    };
    this.handleSkipPointer = (event) => {
      event.preventDefault();
      if (this.mode !== 'introPlaying') {
        return;
      }
      this.finish({ skipped: true });
    };
    this.handleAudioTogglePointer = (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.toggleAudio();
    };
    this.handleEnded = () => this.finish({ skipped: false });
    this.handleVideoError = () => {
      console.warn('[EVOLUTION ZERO] opening intro video could not be loaded');
      this.finish({ skipped: false });
    };
    this.handleAudioError = () => {
      console.warn('[EVOLUTION ZERO] opening intro audio could not be loaded');
    };

    this.gate.addEventListener('pointerdown', this.handleGatePointer);
    this.skipButton.addEventListener('pointerdown', this.handleSkipPointer);
    this.audioToggle.addEventListener('pointerdown', this.handleAudioTogglePointer);
    this.video.addEventListener('ended', this.handleEnded);
    this.video.addEventListener('error', this.handleVideoError);
    this.audio.addEventListener('error', this.handleAudioError);
  }

  shouldShowOnBoot() {
    const storage = getStorage();
    const params = getParams();

    if (params.get('debugIntroReset') === '1') {
      try {
        storage?.removeItem(INTRO_SEEN_KEY);
      } catch {
        // Debug reset should never block startup.
      }
      return true;
    }

    if (params.get('debugIntroSeen') === '1') {
      return false;
    }

    return true;
  }

  showInitialGate() {
    this.shouldMarkSeen = true;
    this.audioManager?.stopTransientAudio?.();
    this.audioManager?.stopBgm?.();
    this.syncAudioStateFromSettings();
    this.showGate();
  }

  playFromTitle() {
    this.shouldMarkSeen = false;
    this.audioManager?.stopTransientAudio?.();
    this.audioManager?.stopBgm?.();
    this.syncAudioStateFromSettings();
    this.root.hidden = false;
    this.mode = 'introPlaying';
    this.root.classList.remove('is-gate');
    this.root.classList.add('is-playing');
    this.startPlayback();
  }

  showGate() {
    this.resetMedia();
    this.syncAudioStateFromSettings();
    this.root.hidden = false;
    this.mode = 'introGate';
    this.isFinishing = false;
    this.root.classList.add('is-gate');
    this.root.classList.remove('is-playing');
  }

  async startPlayback() {
    if (this.mode === 'introPlaying' && !this.video.paused) {
      return;
    }

    this.mode = 'introPlaying';
    this.root.hidden = false;
    this.root.classList.remove('is-gate');
    this.root.classList.add('is-playing');
    this.audioManager?.stopBgm?.();
    this.audioManager?.stopTransientAudio?.();

    try {
      this.video.currentTime = 0;
    } catch {
      // Some browsers block currentTime before metadata. Playback can still continue.
    }

    try {
      this.audio.currentTime = 0;
    } catch {
      // Audio can still attempt to play from start once metadata is available.
    }

    this.audioManager?.unlockAudio?.();
    const audioPlay = this.playIntroAudio();

    try {
      await this.video.play();
    } catch (error) {
      console.warn('[EVOLUTION ZERO] opening intro video playback skipped', error);
      await audioPlay;
      this.showGate();
      return;
    }

    await audioPlay;
  }

  async playIntroAudio() {
    this.syncAudioStateFromSettings();

    if (!this.audioEnabled) {
      this.stopIntroAudio();
      return;
    }

    const offset = Number.isFinite(this.video.currentTime) ? this.video.currentTime : 0;

    this.audioManager?.playOptional?.('intro_opening', {
      cooldown: 0,
      maxInstances: 1,
      volume: 1,
    });

    this.audio.muted = false;
    this.audio.volume = this.getIntroVolume();

    try {
      this.audio.currentTime = offset;
    } catch {
      // Audio can still attempt to play from its current position.
    }

    const elementPlay = this.audio.play()
      .catch((error) => {
        console.warn('[EVOLUTION ZERO] opening intro audio playback skipped', error);
      });

    this.playIntroAudioWithWebAudio(offset)
      .then((playedWithWebAudio) => {
        if (playedWithWebAudio && !this.audio.paused) {
          this.audio.pause();
        }
        if (playedWithWebAudio) {
          this.audioManager?.stopTransientAudio?.();
        }
      })
      .catch((error) => {
        console.warn('[EVOLUTION ZERO] opening intro WebAudio playback skipped', error);
      });

    await elementPlay;
  }

  preloadIntroAudioBuffer() {
    if (typeof fetch !== 'function') {
      return;
    }

    this.audioBufferPromise = fetch(assetUrl(INTRO_AUDIO_PATH))
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.arrayBuffer();
      })
      .catch((error) => {
        console.warn('[EVOLUTION ZERO] opening intro audio preload skipped', error);
        return null;
      });
  }

  async ensureIntroAudioContext() {
    if (typeof window === 'undefined') {
      return null;
    }

    const Context = window.AudioContext || window.webkitAudioContext;

    if (!Context) {
      return null;
    }

    this.audioContext = this.audioContext ?? new Context();

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    return this.audioContext;
  }

  async getIntroAudioBuffer(context) {
    if (!context || !this.audioBufferPromise) {
      return null;
    }

    if (this.decodedAudioBuffer) {
      return this.decodedAudioBuffer;
    }

    const arrayBuffer = await this.audioBufferPromise;

    if (!arrayBuffer) {
      return null;
    }

    this.decodedAudioBuffer = await context.decodeAudioData(arrayBuffer.slice(0));
    return this.decodedAudioBuffer;
  }

  async playIntroAudioWithWebAudio(offset = 0) {
    const context = await this.ensureIntroAudioContext();
    const buffer = await this.getIntroAudioBuffer(context);

    if (!context || !buffer) {
      return false;
    }

    this.stopIntroAudio({ stopManagedAudio: false });

    this.audioGain = context.createGain();
    this.audioGain.gain.value = this.getIntroVolume();
    this.audioGain.connect(context.destination);

    this.audioSource = context.createBufferSource();
    this.audioSource.buffer = buffer;
    this.audioSource.connect(this.audioGain);
    this.audioOffset = Math.max(0, Math.min(offset, Math.max(0, buffer.duration - 0.05)));
    this.audioStartedAt = context.currentTime - this.audioOffset;
    this.audioSource.start(0, this.audioOffset);
    this.audioSource.onended = () => {
      this.audioSource = null;
    };

    return true;
  }

  toggleAudio() {
    const nextMuted = this.audioEnabled;
    const nextSettings = {
      ...(this.saveManager?.getAudioSettings?.() ?? {}),
      muted: nextMuted,
    };

    if (this.saveManager?.updateAudioSettings) {
      this.saveManager.updateAudioSettings(nextSettings);
    }

    this.audioManager?.applySettings?.(nextSettings);
    this.syncAudioStateFromSettings();
    this.updateAudioToggleLabel();

    if (!this.audioEnabled) {
      this.stopIntroAudio();
      return;
    }

    if (this.mode === 'introPlaying' && !this.video.paused) {
      this.playIntroAudio();
    }
  }

  updateAudioToggleLabel() {
    if (!this.audioToggle) {
      return;
    }

    this.audioToggle.textContent = this.audioEnabled ? 'SOUND ON' : 'SOUND OFF';
    this.audioToggle.setAttribute('aria-pressed', this.audioEnabled ? 'false' : 'true');
  }

  syncAudioStateFromSettings() {
    const settings = this.saveManager?.getAudioSettings?.() ?? {};
    const muted = Boolean(settings.muted ?? this.audioManager?.muted ?? false);

    this.audioEnabled = !muted;
    this.audio.muted = muted;
    this.audio.volume = this.getIntroVolume(settings);
    if (this.audioGain) {
      this.audioGain.gain.value = this.audioEnabled ? this.getIntroVolume(settings) : 0;
    }
    this.updateAudioToggleLabel();
  }

  getIntroVolume(settings = this.saveManager?.getAudioSettings?.() ?? {}) {
    const masterVolume = Number.isFinite(Number(settings.masterVolume))
      ? Number(settings.masterVolume)
      : Number(this.audioManager?.masterVolume ?? 0.8);

    return Math.max(0, Math.min(1, masterVolume * 0.8));
  }

  finish({ skipped = false } = {}) {
    if (this.isFinishing) {
      return;
    }

    this.isFinishing = true;
    this.stopMedia();
    this.root.hidden = true;
    this.root.classList.remove('is-gate', 'is-playing');
    this.mode = 'title';

    if (this.shouldMarkSeen) {
      try {
        getStorage()?.setItem(INTRO_SEEN_KEY, '1');
      } catch {
        // Intro persistence should never block reaching title.
      }
    }

    this.onComplete?.({ skipped, markedSeen: this.shouldMarkSeen });
    this.shouldMarkSeen = false;
    this.isFinishing = false;
  }

  stopMedia() {
    this.video.pause();
    this.stopIntroAudio();
    this.resetMedia();
  }

  stopIntroAudio({ stopManagedAudio = true } = {}) {
    this.audio.pause();
    if (stopManagedAudio) {
      this.audioManager?.stopTransientAudio?.();
    }

    if (this.audioSource) {
      try {
        this.audioSource.stop(0);
      } catch {
        // Already stopped.
      }
      this.audioSource = null;
    }

    if (this.audioGain) {
      try {
        this.audioGain.disconnect();
      } catch {
        // Already disconnected.
      }
      this.audioGain = null;
    }
  }

  resetMedia() {
    try {
      this.video.currentTime = 0;
    } catch {
      // Ignore metadata timing differences.
    }

    try {
      this.audio.currentTime = 0;
    } catch {
      // Ignore metadata timing differences.
    }
  }
}

export { INTRO_SEEN_KEY };
