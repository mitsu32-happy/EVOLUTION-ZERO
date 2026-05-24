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

    this.gate.addEventListener('pointerup', this.handleGatePointer);
    this.skipButton.addEventListener('pointerup', this.handleSkipPointer);
    this.audioToggle.addEventListener('pointerup', this.handleAudioTogglePointer);
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
    this.audioManager?.unlockAudio?.();

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
      this.audio.pause();
      return;
    }

    this.audio.muted = false;
    this.audio.volume = this.getIntroVolume();

    try {
      await this.audio.play();
    } catch (error) {
      console.warn('[EVOLUTION ZERO] opening intro audio playback skipped', error);
    }
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
      this.audio.muted = true;
      this.audio.pause();
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
    this.audio.pause();
    this.resetMedia();
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
